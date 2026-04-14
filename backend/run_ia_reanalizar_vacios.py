"""
Script de re-análisis IA para candidatos con datos estructurados vacíos.

Identifica aplicaciones cuyo candidato NO tiene experiencia, educación o idioma
registrados en el formulario, y los re-analiza priorizando el texto del PDF.

Uso desde backend/ (con venv activo):
    python run_ia_reanalizar_vacios.py           # modo real
    python run_ia_reanalizar_vacios.py --dry-run # solo muestra quiénes serían afectados
"""

import asyncio
import io
import json
import logging
import sys
import time
import uuid
from urllib.parse import urlparse

import anthropic
import pdfplumber
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from core.config import settings
from core.s3 import get_bucket_name, get_s3_client
from db.models import Application, Candidate, Job
from db.session import AsyncSessionLocal

logging.basicConfig(level=logging.WARNING)
logger = logging.getLogger(__name__)

DRY_RUN = "--dry-run" in sys.argv

_SYSTEM_PROMPT = (
    "Eres un experto reclutador de Café Quindío. "
    "Evalúa objetivamente qué tan apto es un candidato para una vacante. "
    "Cuando los campos estructurados estén vacíos, extrae la información "
    "directamente del texto de la hoja de vida adjunta. "
    "Responde ÚNICAMENTE con un objeto JSON válido, sin texto adicional."
)


def _extract_pdf_text(cv_url: str) -> str:
    try:
        key = urlparse(cv_url).path.lstrip("/")
        response = get_s3_client().get_object(Bucket=get_bucket_name(), Key=key)
        pdf_bytes = response["Body"].read()
        with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
            return "\n".join(page.extract_text() or "" for page in pdf.pages).strip()
    except Exception as exc:
        return f"[No disponible: {exc}]"


def _build_prompt_enriquecido(job: Job, candidate: Candidate, cv_text: str) -> str:
    """Prompt que prioriza el CV cuando los campos estructurados están vacíos."""

    def req_list(type_: str) -> str:
        items = [r.content for r in job.requirements if r.type == type_]
        return "\n".join(f"• {i}" for i in items) if items else "No especificado"

    tiene_exp = bool(candidate.experience)
    tiene_edu = bool(candidate.education)
    tiene_lang = bool(candidate.languages)

    exp_text = "\n".join(
        f"- {e.position} en {e.company} ({e.start_date or '?'} → {e.end_date or 'actual'})"
        + (f": {e.details}" if e.details else "")
        for e in candidate.experience
    ) if tiene_exp else "⚠ No registrado en el formulario — extraer del texto del CV"

    edu_text = "\n".join(
        f"- {e.degree or ''} en {e.field_of_study or ''} — {e.institution or ''}"
        for e in candidate.education
    ) if tiene_edu else "⚠ No registrado en el formulario — extraer del texto del CV"

    lang_text = ", ".join(
        f"{l.language} ({l.level})" for l in candidate.languages
    ) if tiene_lang else "⚠ No registrado en el formulario — extraer del texto del CV"

    cv_section = cv_text[:4000] if cv_text and "No disponible" not in cv_text else "No disponible"

    instruccion_extra = ""
    if not tiene_exp or not tiene_edu or not tiene_lang:
        instruccion_extra = (
            "\n⚠ INSTRUCCIÓN ESPECIAL: Algunos campos estructurados están vacíos porque el candidato "
            "se registró antes de que fueran obligatorios. El texto completo del CV está disponible abajo. "
            "Úsalo como fuente principal para evaluar experiencia, educación e idiomas. "
            "NO penalices al candidato por campos vacíos si el CV contiene la información relevante.\n"
        )

    return f"""VACANTE: {job.title}
ÁREA: {job.area or 'N/A'} | UBICACIÓN: {job.location or 'N/A'}

FUNCIONES:
{req_list('funcion')}

REQUISITOS:
{req_list('requisito')}

PERFIL IDEAL:
{req_list('perfil_ideal')}
{instruccion_extra}
---
CANDIDATO: {candidate.name}

EXPERIENCIA (formulario):
{exp_text}

EDUCACIÓN (formulario):
{edu_text}

IDIOMAS (formulario):
{lang_text}

HOJA DE VIDA — texto completo extraído del PDF:
{cv_section}

---
Evalúa basándote en toda la información disponible (formulario + PDF) y responde con este JSON exacto:
{{
  "score": <entero 0-100>,
  "decision": <"aprobado" si >=70, "rechazado" si <50, "pendiente" si 50-69>,
  "justificacion": "<párrafo completo explicando la evaluación, mencionando qué información se tomó del CV>"
}}"""


async def analizar_con_pdf(application_id: uuid.UUID, db) -> dict:
    result = await db.execute(
        select(Application)
        .options(
            selectinload(Application.candidate).selectinload(Candidate.experience),
            selectinload(Application.candidate).selectinload(Candidate.education),
            selectinload(Application.candidate).selectinload(Candidate.languages),
            selectinload(Application.job).selectinload(Job.requirements),
        )
        .where(Application.id == application_id)
    )
    app = result.scalar_one_or_none()
    if app is None:
        raise ValueError(f"Application {application_id} no encontrada")

    cv_text = _extract_pdf_text(app.candidate.cv_url) if app.candidate.cv_url else ""
    prompt = _build_prompt_enriquecido(app.job, app.candidate, cv_text)

    client = anthropic.AsyncAnthropic(api_key=settings.ANTHROPIC_API_KEY)
    message = await client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=1024,
        system=_SYSTEM_PROMPT,
        messages=[{"role": "user", "content": prompt}],
    )
    raw = message.content[0].text.strip()
    start, end = raw.find("{"), raw.rfind("}") + 1
    data = json.loads(raw[start:end])

    score = max(0, min(100, int(data.get("score", 50))))
    decision = data.get("decision", "pendiente")
    if decision not in ("aprobado", "rechazado", "pendiente"):
        decision = "pendiente"
    justificacion = str(data.get("justificacion", ""))[:1500]

    app.ai_score = score
    app.ai_decision = decision
    app.ai_justificacion = justificacion
    await db.commit()

    return {"score": score, "decision": decision, "tiene_cv": bool(cv_text)}


async def obtener_aplicaciones_con_vacios() -> list[tuple[uuid.UUID, str, str]]:
    """Retorna (app_id, nombre_candidato, email) de apps con exp/edu/idioma vacíos."""
    async with AsyncSessionLocal() as db:
        result = await db.execute(
            select(Application)
            .options(
                selectinload(Application.candidate).selectinload(Candidate.experience),
                selectinload(Application.candidate).selectinload(Candidate.education),
                selectinload(Application.candidate).selectinload(Candidate.languages),
            )
            .order_by(Application.applied_date.asc())
        )
        apps = result.scalars().all()

    vacios = []
    for app in apps:
        c = app.candidate
        if not c.experience or not c.education or not c.languages:
            vacios.append((app.id, c.name, c.email))
    return vacios


async def main():
    print("=" * 65)
    print("  CQ Talent Portal — Re-análisis IA (candidatos con datos vacíos)")
    print("=" * 65)
    if DRY_RUN:
        print("  MODO DRY-RUN: solo muestra afectados, no modifica nada\n")

    print("\n[1/2] Buscando candidatos con experiencia/educación/idioma vacíos...")
    vacios = await obtener_aplicaciones_con_vacios()

    if not vacios:
        print("  No hay candidatos con datos vacíos. Todo en orden.")
        return

    print(f"  {len(vacios)} candidatos encontrados:\n")
    for _, nombre, email in vacios:
        print(f"    • {nombre} <{email}>")

    if DRY_RUN:
        print("\n  (Dry-run: nada fue modificado)")
        return

    print(f"\n[2/2] Re-analizando con Claude (prioriza PDF del CV)...\n")

    ok = errores = 0
    inicio = time.time()

    for i, (app_id, nombre, email) in enumerate(vacios, 1):
        print(f"  [{i:>3}/{len(vacios)}] {nombre} ...", end="", flush=True)
        t0 = time.time()
        try:
            async with AsyncSessionLocal() as db:
                resultado = await analizar_con_pdf(app_id, db)
            elapsed = time.time() - t0
            cv_info = "con PDF" if resultado["tiene_cv"] else "SIN PDF"
            print(f" {resultado['decision'].upper()} {resultado['score']}pts ({cv_info}, {elapsed:.1f}s)")
            ok += 1
        except Exception as exc:
            elapsed = time.time() - t0
            print(f" ERROR ({elapsed:.1f}s): {exc}")
            errores += 1

        if i < len(vacios):
            await asyncio.sleep(0.5)

    total = time.time() - inicio
    print("\n" + "=" * 65)
    print(f"  Completado en {total:.0f}s  |  Exitosos: {ok}  |  Errores: {errores}")
    print("=" * 65)


if __name__ == "__main__":
    asyncio.run(main())
