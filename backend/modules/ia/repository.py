from __future__ import annotations

import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from db.models import AIMetricsHistory, AITrainingCase, AIWeight


class IARepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all_weights(self) -> list[AIWeight]:
        result = await self.db.execute(select(AIWeight).order_by(AIWeight.category, AIWeight.id))
        return list(result.scalars().all())

    async def get_weight_by_id(self, weight_id: str) -> AIWeight | None:
        result = await self.db.execute(select(AIWeight).where(AIWeight.id == weight_id))
        return result.scalar_one_or_none()

    async def update_weight(self, weight_id: str, data: dict) -> AIWeight | None:
        weight = await self.get_weight_by_id(weight_id)
        if weight is None:
            return None
        for key, value in data.items():
            setattr(weight, key, value)
        await self.db.flush()
        await self.db.refresh(weight)
        return weight

    async def get_latest_metrics(self) -> AIMetricsHistory | None:
        result = await self.db.execute(
            select(AIMetricsHistory).order_by(AIMetricsHistory.recorded_at.desc()).limit(1)
        )
        return result.scalar_one_or_none()

    async def get_training_cases(
        self, skip: int = 0, limit: int = 100
    ) -> list[AITrainingCase]:
        result = await self.db.execute(
            select(AITrainingCase)
            .order_by(AITrainingCase.id.desc())
            .offset(skip)
            .limit(limit)
        )
        return list(result.scalars().all())

    async def create_training_case(self, data: dict) -> AITrainingCase:
        case = AITrainingCase(**data)
        self.db.add(case)
        await self.db.flush()
        await self.db.refresh(case)
        return case

    async def get_candidate_data(self, candidate_id: uuid.UUID) -> dict:
        """Retorna datos básicos del candidato para scoring."""
        from db.models import Candidate
        from sqlalchemy.orm import selectinload

        result = await self.db.execute(
            select(Candidate)
            .options(
                selectinload(Candidate.experience),
                selectinload(Candidate.education),
                selectinload(Candidate.languages),
            )
            .where(Candidate.id == candidate_id)
        )
        candidate = result.scalar_one_or_none()
        if candidate is None:
            return {}
        return {
            "id": str(candidate.id),
            "name": candidate.name,
            "experience_count": len(candidate.experience),
            "education_count": len(candidate.education),
            "languages_count": len(candidate.languages),
        }

    async def get_job_data(self, job_id: uuid.UUID) -> dict:
        """Retorna datos básicos del job para scoring."""
        from db.models import Job
        from sqlalchemy.orm import selectinload

        result = await self.db.execute(
            select(Job)
            .options(selectinload(Job.requirements))
            .where(Job.id == job_id)
        )
        job = result.scalar_one_or_none()
        if job is None:
            return {}
        return {
            "id": str(job.id),
            "title": job.title,
            "area": job.area,
            "requirements_count": len(job.requirements),
            "ai_prompt": job.ai_prompt,
        }
