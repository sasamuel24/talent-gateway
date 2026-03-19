from __future__ import annotations

import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from db.models import Application, Candidate, CandidateExperience, CandidateEducation, CandidateLanguage


class ApplicationRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    def _full_options(self):
        """Opciones de carga eager para obtener candidato con sub-relaciones y job."""
        return [
            selectinload(Application.candidate).selectinload(Candidate.experience),
            selectinload(Application.candidate).selectinload(Candidate.education),
            selectinload(Application.candidate).selectinload(Candidate.languages),
            selectinload(Application.job),
        ]

    async def get_all(
        self,
        skip: int = 0,
        limit: int = 100,
        job_id: uuid.UUID | None = None,
        ai_decision: str | None = None,
        human_decision: str | None = None,
    ) -> list[Application]:
        query = select(Application).options(*self._full_options())
        if job_id is not None:
            query = query.where(Application.job_id == job_id)
        if ai_decision is not None:
            query = query.where(Application.ai_decision == ai_decision)
        if human_decision is not None:
            query = query.where(Application.human_decision == human_decision)
        query = query.order_by(Application.applied_date.desc()).offset(skip).limit(limit)
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def get_by_id(self, application_id: uuid.UUID) -> Application | None:
        result = await self.db.execute(
            select(Application)
            .options(*self._full_options())
            .where(Application.id == application_id)
        )
        return result.scalar_one_or_none()

    async def get_by_candidate_and_job(
        self, candidate_id: uuid.UUID, job_id: uuid.UUID
    ) -> Application | None:
        result = await self.db.execute(
            select(Application)
            .options(*self._full_options())
            .where(
                Application.candidate_id == candidate_id,
                Application.job_id == job_id,
            )
        )
        return result.scalar_one_or_none()

    async def create(self, data: dict) -> Application:
        application = Application(**data)
        self.db.add(application)
        await self.db.flush()
        # Recargar con todas las relaciones
        result = await self.db.execute(
            select(Application)
            .options(*self._full_options())
            .where(Application.id == application.id)
        )
        return result.scalar_one()

    async def update(self, application_id: uuid.UUID, data: dict) -> Application | None:
        application = await self.get_by_id(application_id)
        if application is None:
            return None
        for key, value in data.items():
            setattr(application, key, value)
        await self.db.flush()
        result = await self.db.execute(
            select(Application)
            .options(*self._full_options())
            .where(Application.id == application_id)
        )
        return result.scalar_one()

    async def check_duplicate(
        self, candidate_id: uuid.UUID, job_id: uuid.UUID
    ) -> bool:
        existing = await self.get_by_candidate_and_job(candidate_id, job_id)
        return existing is not None
