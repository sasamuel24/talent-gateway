from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from core.dependencies import get_current_user, get_db
from modules.ia.schemas import (
    AIScoreRequest,
    AIScoreResponse,
    AIWeightResponse,
    AIWeightUpdate,
)
from modules.ia.service import IAService

router = APIRouter(prefix="/api/v1/ia", tags=["ia"])


@router.get("/weights", response_model=list[AIWeightResponse])
async def get_weights(
    db: Annotated[AsyncSession, Depends(get_db)] = None,
    _: Annotated[str, Depends(get_current_user)] = None,
) -> list[AIWeightResponse]:
    service = IAService(db)
    return await service.get_weights()


@router.put("/weights/{weight_id}", response_model=AIWeightResponse)
async def update_weight(
    weight_id: str,
    data: AIWeightUpdate,
    db: Annotated[AsyncSession, Depends(get_db)] = None,
    _: Annotated[str, Depends(get_current_user)] = None,
) -> AIWeightResponse:
    service = IAService(db)
    return await service.update_weight(weight_id, data)


@router.post("/score", response_model=AIScoreResponse)
async def score_candidate(
    request: AIScoreRequest,
    db: Annotated[AsyncSession, Depends(get_db)] = None,
    _: Annotated[str, Depends(get_current_user)] = None,
) -> AIScoreResponse:
    """Calcula score IA para un candidato en una convocatoria."""
    service = IAService(db)
    return await service.score_candidate(request)
