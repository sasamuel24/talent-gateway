import io
import json
import logging
import uuid
from urllib.parse import urlparse

import anthropic
import pdfplumber
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from core.config import settings
from core.s3 import get_bucket_name, get_s3_client
from db.models import Application, Candidate, Job

logger = logging.getLogger(__name__)

_SYSTEM_PROMPT = (
    "Eres un experto reclutador de Café Quindío. "
    "Evalúa objetivamente qué tan apto es un candidato para una vacante. "
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
        logger.warning("PDF extraction failed: %s", exc)
        return ""


def _build_prompt(job: Job, candidate: Candidate, cv_text: str) -> str:
    def req_list(type_: str) -> str:
        items = [r.content for r in job.requirements if r.type == type_]
        return "\n".join(f"• {i}" for i in items) if items else "No especificado"

    exp_text = "\n".join(
        f"- {e.position} en {e.company} ({e.start_date or '?'} → {e.end_date or 'actual'})"
        + (f": {e.details}" if e.details else "")
        for e in candidate.experience
    ) or "Sin experiencia registrada"

    edu_text = "\n".join(
        f"- {e.degree or ''} en {e.field_of_study or ''} — {e.institution or ''}"
        for e in candidate.education
    ) or "Sin educación registrada"

    lang_text = ", ".join(
        f"{l.language} ({l.level})" for l in candidate.languages
    ) or "No especificado"

    cv_section = cv_text[:3000] if cv_text else "No disponible"

    return f"""VACANTE: {job.title}
ÁREA: {job.area or 'N/A'} | UBICACIÓN: {job.location or 'N/A'}

FUNCIONES:
{req_list('funcion')}

REQUISITOS:
{req_list('requisito')}

PERFIL IDEAL:
{req_list('perfil_ideal')}

---
CANDIDATO: {candidate.name}
EXPERIENCIA:
{exp_text}

EDUCACIÓN:
{edu_text}

IDIOMAS: {lang_text}

HOJA DE VIDA (texto):
{cv_section}

---
Evalúa y responde con este JSON exacto (sin texto extra):
{{
  "score": <entero 0-100>,
  "decision": <"aprobado" si >=70, "rechazado" si <50, "pendiente" si 50-69>,
  "justificacion": "<párrafo completo, sin cortar>"
}}"""


async def analyze_application(application_id: uuid.UUID, db: AsyncSession) -> None:
    """Analiza una aplicación con Claude y actualiza ai_score, ai_decision, ai_justificacion."""
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
        logger.error("Application %s not found", application_id)
        return

    cv_text = _extract_pdf_text(app.candidate.cv_url) if app.candidate.cv_url else ""
    prompt = _build_prompt(app.job, app.candidate, cv_text)

    try:
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
    except Exception as exc:
        logger.error("Claude API error for application %s: %s", application_id, exc)
        return

    app.ai_score = score
    app.ai_decision = decision
    app.ai_justificacion = justificacion
    await db.commit()
    logger.info(
        "IA analysis done — application=%s score=%s decision=%s",
        application_id, score, decision,
    )
