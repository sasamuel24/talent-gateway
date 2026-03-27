from __future__ import annotations

import uuid

from sqlalchemy import or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from db.models import (
    Candidate,
    CandidateEducation,
    CandidateExperience,
    CandidateLanguage,
)


class CandidateRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all(
        self,
        skip: int = 0,
        limit: int = 100,
        search: str | None = None,
    ) -> list[Candidate]:
        query = select(Candidate).options(
            selectinload(Candidate.experience),
            selectinload(Candidate.education),
            selectinload(Candidate.languages),
        )
        if search:
            term = f"%{search}%"
            query = query.where(
                or_(
                    Candidate.name.ilike(term),
                    Candidate.email.ilike(term),
                )
            )
        query = query.order_by(Candidate.created_at.desc()).offset(skip).limit(limit)
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def get_by_id(self, candidate_id: uuid.UUID) -> Candidate | None:
        result = await self.db.execute(
            select(Candidate)
            .options(
                selectinload(Candidate.experience),
                selectinload(Candidate.education),
                selectinload(Candidate.languages),
            )
            .where(Candidate.id == candidate_id)
        )
        return result.scalar_one_or_none()

    async def get_by_email(self, email: str) -> Candidate | None:
        result = await self.db.execute(
            select(Candidate)
            .options(
                selectinload(Candidate.experience),
                selectinload(Candidate.education),
                selectinload(Candidate.languages),
            )
            .where(Candidate.email == email)
        )
        return result.scalar_one_or_none()

    async def create(self, data: dict) -> Candidate:
        candidate = Candidate(**data)
        self.db.add(candidate)
        await self.db.flush()
        await self.db.refresh(candidate, ["experience", "education", "languages"])
        return candidate

    async def update(self, candidate_id: uuid.UUID, data: dict) -> Candidate | None:
        candidate = await self.get_by_id(candidate_id)
        if candidate is None:
            return None
        for key, value in data.items():
            setattr(candidate, key, value)
        await self.db.flush()
        await self.db.refresh(candidate, ["experience", "education", "languages"])
        return candidate

    async def add_experience(
        self, candidate_id: uuid.UUID, data: dict
    ) -> CandidateExperience:
        exp = CandidateExperience(candidate_id=candidate_id, **data)
        self.db.add(exp)
        await self.db.flush()
        await self.db.refresh(exp)
        return exp

    async def add_education(
        self, candidate_id: uuid.UUID, data: dict
    ) -> CandidateEducation:
        edu = CandidateEducation(candidate_id=candidate_id, **data)
        self.db.add(edu)
        await self.db.flush()
        await self.db.refresh(edu)
        return edu

    async def add_language(
        self, candidate_id: uuid.UUID, data: dict
    ) -> CandidateLanguage:
        lang = CandidateLanguage(candidate_id=candidate_id, **data)
        self.db.add(lang)
        await self.db.flush()
        await self.db.refresh(lang)
        return lang

    async def clear_profile_data(self, candidate_id: uuid.UUID) -> None:
        """Elimina experiencia, educación e idiomas previos para reemplazarlos en una nueva aplicación."""
        from sqlalchemy import delete
        await self.db.execute(
            delete(CandidateExperience).where(CandidateExperience.candidate_id == candidate_id)
        )
        await self.db.execute(
            delete(CandidateEducation).where(CandidateEducation.candidate_id == candidate_id)
        )
        await self.db.execute(
            delete(CandidateLanguage).where(CandidateLanguage.candidate_id == candidate_id)
        )
        await self.db.flush()
