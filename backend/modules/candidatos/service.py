from __future__ import annotations

import logging
import uuid

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from modules.candidatos.repository import CandidateRepository
from modules.candidatos.schemas import (
    CandidateCreate,
    CandidateResponse,
    CandidateUpdate,
    EducationCreate,
    EducationResponse,
    ExperienceCreate,
    ExperienceResponse,
    LanguageCreate,
    LanguageResponse,
)

logger = logging.getLogger(__name__)


class CandidateService:
    def __init__(self, db: AsyncSession):
        self.repository = CandidateRepository(db)

    async def list_candidates(
        self,
        skip: int = 0,
        limit: int = 100,
        search: str | None = None,
    ) -> list[CandidateResponse]:
        candidates = await self.repository.get_all(skip=skip, limit=limit, search=search)
        return [CandidateResponse.model_validate(c) for c in candidates]

    async def get_candidate(self, candidate_id: uuid.UUID) -> CandidateResponse:
        candidate = await self.repository.get_by_id(candidate_id)
        if candidate is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Candidato {candidate_id} no encontrado",
            )
        return CandidateResponse.model_validate(candidate)

    async def create_candidate(self, data: CandidateCreate) -> CandidateResponse:
        """Crea un candidato. Si el email ya existe retorna el existente (upsert suave)."""
        existing = await self.repository.get_by_email(data.email)
        if existing is not None:
            logger.info("Candidato ya existe con email %s, retornando existente", data.email)
            return CandidateResponse.model_validate(existing)
        candidate = await self.repository.create(data.model_dump())
        logger.info("Candidato creado: %s", candidate.id)
        return CandidateResponse.model_validate(candidate)

    async def update_candidate(
        self, candidate_id: uuid.UUID, data: CandidateUpdate
    ) -> CandidateResponse:
        await self.get_candidate(candidate_id)
        candidate = await self.repository.update(
            candidate_id, data.model_dump(exclude_none=True)
        )
        return CandidateResponse.model_validate(candidate)

    async def add_experience(
        self, candidate_id: uuid.UUID, data: ExperienceCreate
    ) -> ExperienceResponse:
        await self.get_candidate(candidate_id)
        exp = await self.repository.add_experience(candidate_id, data.model_dump())
        return ExperienceResponse.model_validate(exp)

    async def add_education(
        self, candidate_id: uuid.UUID, data: EducationCreate
    ) -> EducationResponse:
        await self.get_candidate(candidate_id)
        edu = await self.repository.add_education(candidate_id, data.model_dump())
        return EducationResponse.model_validate(edu)

    async def add_language(
        self, candidate_id: uuid.UUID, data: LanguageCreate
    ) -> LanguageResponse:
        await self.get_candidate(candidate_id)
        lang = await self.repository.add_language(candidate_id, data.model_dump())
        return LanguageResponse.model_validate(lang)


# Alias de compatibilidad con router antiguo
CandidatoService = CandidateService
