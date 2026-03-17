from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from backend.core.dependencies import get_current_user, get_db
from backend.modules.ia.schemas import (
    RankingRequest,
    RankingResponse,
    ScoringRequest,
    ScoringResponse,
)
from backend.modules.ia.service import IAService

router = APIRouter(prefix="/api/v1/ia", tags=["ia"])


@router.post("/scoring", response_model=ScoringResponse)
async def score_candidato(
    request: ScoringRequest,
    db: AsyncSession = Depends(get_db),
    _: str = Depends(get_current_user),
):
    service = IAService(db)
    return await service.score_candidato(request)


@router.post("/ranking", response_model=RankingResponse)
async def get_ranking(
    request: RankingRequest,
    db: AsyncSession = Depends(get_db),
    _: str = Depends(get_current_user),
):
    service = IAService(db)
    return await service.get_ranking(request)
