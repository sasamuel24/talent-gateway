from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends
from fastapi import status as http_status
from sqlalchemy.ext.asyncio import AsyncSession

from core.dependencies import get_current_user, get_db
from modules.ia.schemas import (
    AIScoreRequest,
    AIScoreResponse,
    AIWeightResponse,
    AIWeightUpdate,
    MetricsHistoryResponse,
    TrainingCaseCreate,
    TrainingCaseResponse,
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
    """Calcula score IA para un candidato en una convocatoria (placeholder Sprint 1)."""
    service = IAService(db)
    return await service.score_candidate(request)


@router.get("/metrics", response_model=MetricsHistoryResponse)
async def get_metrics(
    db: Annotated[AsyncSession, Depends(get_db)] = None,
    _: Annotated[str, Depends(get_current_user)] = None,
) -> MetricsHistoryResponse:
    service = IAService(db)
    return await service.get_latest_metrics()


@router.get("/training-cases", response_model=list[TrainingCaseResponse])
async def get_training_cases(
    skip: int = 0,
    limit: int = 100,
    db: Annotated[AsyncSession, Depends(get_db)] = None,
    _: Annotated[str, Depends(get_current_user)] = None,
) -> list[TrainingCaseResponse]:
    service = IAService(db)
    return await service.get_training_cases(skip=skip, limit=limit)


@router.post(
    "/training-cases",
    response_model=TrainingCaseResponse,
    status_code=http_status.HTTP_201_CREATED,
)
async def create_training_case(
    data: TrainingCaseCreate,
    db: Annotated[AsyncSession, Depends(get_db)] = None,
    _: Annotated[str, Depends(get_current_user)] = None,
) -> TrainingCaseResponse:
    service = IAService(db)
    return await service.create_training_case(data)
