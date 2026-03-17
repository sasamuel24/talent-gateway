import logging
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from backend.modules.ia.repository import IARepository
from backend.modules.ia.schemas import (
    RankingRequest,
    RankingResponse,
    ScoringRequest,
    ScoringResponse,
)

logger = logging.getLogger(__name__)


class IAService:
    def __init__(self, db: AsyncSession):
        self.repository = IARepository(db)

    async def score_candidato(self, request: ScoringRequest) -> ScoringResponse:
        """
        Calcula el puntaje de un candidato para una convocatoria.
        El algoritmo real de IA se implementara en Sprint 2.
        """
        logger.info(
            "Scoring aplicacion %s para convocatoria %s",
            request.aplicacion_id,
            request.convocatoria_id,
        )
        # Placeholder — se reemplazara con modelo IA real
        return ScoringResponse(
            aplicacion_id=request.aplicacion_id,
            puntaje=0.0,
            fortalezas=[],
            brechas=[],
            resumen="Motor IA en desarrollo (Sprint 2)",
        )

    async def get_ranking(self, request: RankingRequest) -> RankingResponse:
        """Retorna el ranking de candidatos para una convocatoria."""
        aplicaciones = await self.repository.get_aplicaciones_por_convocatoria(
            request.convocatoria_id
        )
        return RankingResponse(
            convocatoria_id=request.convocatoria_id,
            total_candidatos=len(aplicaciones),
            ranking=[],
        )
