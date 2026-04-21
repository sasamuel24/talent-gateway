from __future__ import annotations

import uuid
from typing import Annotated

from fastapi import APIRouter, BackgroundTasks, Depends, Query
from fastapi import status as http_status
from sqlalchemy.ext.asyncio import AsyncSession

from core.dependencies import get_current_user, get_db
from core.email import send_application_confirmation
from db.session import AsyncSessionLocal
from modules.aplicaciones.schemas import (
    ApplicationCreate,
    ApplicationDecisionUpdate,
    ApplicationFullResponse,
    ApplicationNotesUpdate,
    ApplicationSubmit,
)
from modules.aplicaciones.service import ApplicationService
from modules.ia.analyzer import analyze_application


async def _run_ai_analysis(application_id: uuid.UUID) -> None:
    """Background task con su propia sesión de BD."""
    async with AsyncSessionLocal() as db:
        try:
            await analyze_application(application_id, db)
        except Exception as exc:
            import logging
            logging.getLogger(__name__).error(
                "Background IA analysis failed for %s: %s", application_id, exc
            )


router = APIRouter(prefix="/api/v1/aplicaciones", tags=["aplicaciones"])


@router.get("", response_model=list[ApplicationFullResponse])
async def list_applications(
    skip: int = 0,
    limit: int = 100,
    job_id: uuid.UUID | None = Query(default=None),
    ai_decision: str | None = Query(default=None),
    human_decision: str | None = Query(default=None),
    db: Annotated[AsyncSession, Depends(get_db)] = None,
    _: Annotated[str, Depends(get_current_user)] = None,
) -> list[ApplicationFullResponse]:
    service = ApplicationService(db)
    return await service.list_applications(
        skip=skip,
        limit=limit,
        job_id=job_id,
        ai_decision=ai_decision,
        human_decision=human_decision,
    )


@router.post(
    "/submit",
    response_model=ApplicationFullResponse,
    status_code=http_status.HTTP_201_CREATED,
)
async def submit_application(
    data: ApplicationSubmit,
    background_tasks: BackgroundTasks,
    db: Annotated[AsyncSession, Depends(get_db)] = None,
) -> ApplicationFullResponse:
    """Endpoint atómico: crea candidato + perfil + aplicación en una sola transacción."""
    service = ApplicationService(db)
    app = await service.submit_application(data)
    await db.commit()
    background_tasks.add_task(_run_ai_analysis, uuid.UUID(str(app.id)))
    background_tasks.add_task(
        send_application_confirmation,
        candidate_email=app.candidate.email,
        candidate_name=app.candidate.name,
        job_title=app.job.title,
    )
    return app


@router.post(
    "",
    response_model=ApplicationFullResponse,
    status_code=http_status.HTTP_201_CREATED,
)
async def create_application(
    data: ApplicationCreate,
    background_tasks: BackgroundTasks,
    db: Annotated[AsyncSession, Depends(get_db)] = None,
) -> ApplicationFullResponse:
    service = ApplicationService(db)
    app = await service.create_application(data)
    await db.commit()  # commit antes del background task para evitar race condition
    background_tasks.add_task(_run_ai_analysis, uuid.UUID(str(app.id)))
    background_tasks.add_task(
        send_application_confirmation,
        candidate_email=app.candidate.email,
        candidate_name=app.candidate.name,
        job_title=app.job.title,
    )
    return app


@router.post("/{application_id}/analizar-ia", status_code=http_status.HTTP_202_ACCEPTED)
async def reanalizar_ia(
    application_id: uuid.UUID,
    background_tasks: BackgroundTasks,
    db: Annotated[AsyncSession, Depends(get_db)] = None,
    _: Annotated[str, Depends(get_current_user)] = None,
) -> dict:
    """Dispara re-análisis IA en background para una aplicación existente."""
    background_tasks.add_task(_run_ai_analysis, application_id)
    return {"message": "Análisis IA iniciado", "application_id": str(application_id)}


@router.get("/{application_id}", response_model=ApplicationFullResponse)
async def get_application(
    application_id: uuid.UUID,
    db: Annotated[AsyncSession, Depends(get_db)] = None,
    _: Annotated[str, Depends(get_current_user)] = None,
) -> ApplicationFullResponse:
    service = ApplicationService(db)
    return await service.get_application(application_id)


@router.patch("/{application_id}/decision", response_model=ApplicationFullResponse)
async def update_human_decision(
    application_id: uuid.UUID,
    data: ApplicationDecisionUpdate,
    db: Annotated[AsyncSession, Depends(get_db)] = None,
    _: Annotated[str, Depends(get_current_user)] = None,
) -> ApplicationFullResponse:
    """Actualiza la decision humana de una aplicacion."""
    service = ApplicationService(db)
    return await service.update_decision(application_id, data)


@router.patch("/{application_id}/notes", response_model=ApplicationFullResponse)
async def update_notes(
    application_id: uuid.UUID,
    data: ApplicationNotesUpdate,
    db: Annotated[AsyncSession, Depends(get_db)] = None,
    _: Annotated[str, Depends(get_current_user)] = None,
) -> ApplicationFullResponse:
    """Actualiza las notas del reclutador sobre una aplicacion."""
    service = ApplicationService(db)
    return await service.update_notes(application_id, data)
