from __future__ import annotations

import logging
import random
import uuid
from decimal import Decimal

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from modules.ia.repository import IARepository
from modules.ia.schemas import (
    AIScoreRequest,
    AIScoreResponse,
    AIWeightResponse,
    AIWeightUpdate,
    ScoreBreakdown,
)

logger = logging.getLogger(__name__)


class IAService:
    def __init__(self, db: AsyncSession):
        self.repository = IARepository(db)

    async def get_weights(self) -> list[AIWeightResponse]:
        weights = await self.repository.get_all_weights()
        return [AIWeightResponse.model_validate(w) for w in weights]

    async def update_weight(
        self, weight_id: str, data: AIWeightUpdate
    ) -> AIWeightResponse:
        weight = await self.repository.update_weight(
            weight_id, data.model_dump(exclude_none=True)
        )
        if weight is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Peso IA '{weight_id}' no encontrado",
            )
        return AIWeightResponse.model_validate(weight)

    async def score_candidate(self, request: AIScoreRequest) -> AIScoreResponse:
        """
        Placeholder de scoring IA.
        Retorna un score simulado basado en pesos de criterios.
        El algoritmo ML real se implementará en Sprint 2.
        """
        logger.info(
            "Scoring candidato=%s para job=%s", request.candidate_id, request.job_id
        )
        weights = await self.repository.get_all_weights()
        breakdown: list[ScoreBreakdown] = []
        total_score = 0.0
        total_weight = sum(w.weight for w in weights) or 1

        for w in weights:
            raw = round(random.uniform(0.4, 1.0), 2)
            weighted = round(raw * w.weight, 2)
            total_score += weighted
            breakdown.append(
                ScoreBreakdown(
                    criterion=w.label,
                    weight=w.weight,
                    raw_score=raw,
                    weighted_score=weighted,
                )
            )

        final_score = round(min((total_score / total_weight) * 100, 100), 2)
        decision = "aprobado" if final_score >= 70 else (
            "rechazado" if final_score < 40 else "pendiente"
        )
        return AIScoreResponse(
            candidate_id=request.candidate_id,
            job_id=request.job_id,
            score=Decimal(str(final_score)),
            decision=decision,
            breakdown=breakdown,
        )
