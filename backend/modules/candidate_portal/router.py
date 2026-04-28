from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from core.dependencies import get_current_candidate, get_db
from modules.candidate_portal.schemas import PortalApplicationDetail, PortalApplicationItem
from modules.candidate_portal.service import CandidatePortalService

router = APIRouter(prefix="/api/v1/candidate-portal", tags=["candidate-portal"])


@router.get("/applications", response_model=list[PortalApplicationItem])
async def list_my_applications(
    candidate_id: Annotated[str, Depends(get_current_candidate)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> list[PortalApplicationItem]:
    """Listar todas las postulaciones del candidato autenticado."""
    return await CandidatePortalService(db).list_applications(candidate_id)


@router.get("/applications/{application_id}", response_model=PortalApplicationDetail)
async def get_my_application(
    application_id: str,
    candidate_id: Annotated[str, Depends(get_current_candidate)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> PortalApplicationDetail:
    """Detalle de una postulación específica del candidato autenticado."""
    return await CandidatePortalService(db).get_application(candidate_id, application_id)
