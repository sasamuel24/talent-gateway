"""
Script de análisis IA en batch para todas las aplicaciones existentes.

Uso desde backend/:
    python run_ia_batch.py              # analiza solo las que NO tienen score
    python run_ia_batch.py --todos      # re-analiza absolutamente todas

Muestra progreso en tiempo real y un resumen al final.
"""
import asyncio
import sys
import time
import uuid
from sqlalchemy import select

from db.session import AsyncSessionLocal
from db.models import Application
from modules.ia.analyzer import analyze_application


async def obtener_aplicaciones(solo_sin_score: bool) -> list[uuid.UUID]:
    async with AsyncSessionLocal() as db:
        query = select(Application.id)
        if solo_sin_score:
            query = query.where(Application.ai_score.is_(None))
        query = query.order_by(Application.applied_date.asc())
        result = await db.execute(query)
        return [row[0] for row in result.fetchall()]


async def main():
    solo_sin_score = "--todos" not in sys.argv

    print("=" * 60)
    print("  CQ Talent Portal — Análisis IA en Batch")
    print("=" * 60)

    print("\n[1/2] Consultando aplicaciones...", end="", flush=True)
    ids = await obtener_aplicaciones(solo_sin_score)
    modo = "sin score IA" if solo_sin_score else "TODAS"
    print(f" {len(ids)} encontradas ({modo})")

    if not ids:
        print("\n  Nada que procesar. Usa --todos para re-analizar todas.")
        return

    print(f"\n[2/2] Procesando una por una (puede tardar ~5s por candidato)...\n")

    ok = 0
    errores = 0
    inicio = time.time()

    for i, app_id in enumerate(ids, 1):
        print(f"  [{i:>3}/{len(ids)}] {app_id} ...", end="", flush=True)
        t0 = time.time()
        try:
            async with AsyncSessionLocal() as db:
                await analyze_application(app_id, db)
            elapsed = time.time() - t0
            print(f" OK ({elapsed:.1f}s)")
            ok += 1
        except Exception as exc:
            elapsed = time.time() - t0
            print(f" ERROR ({elapsed:.1f}s): {exc}")
            errores += 1

        # Pausa de 0.5s entre llamadas para no saturar la API de Claude
        if i < len(ids):
            await asyncio.sleep(0.5)

    total = time.time() - inicio
    print("\n" + "=" * 60)
    print(f"  Completado en {total:.0f}s")
    print(f"  Exitosos : {ok}")
    print(f"  Errores  : {errores}")
    print("=" * 60)


if __name__ == "__main__":
    asyncio.run(main())
