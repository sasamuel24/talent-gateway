from __future__ import annotations

import uuid

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from db.models import Application, Job, JobRequirement


class JobRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all(
        self,
        skip: int = 0,
        limit: int = 100,
        status: str | None = None,
        area: str | None = None,
        location: str | None = None,
        search: str | None = None,
    ) -> list[Job]:
        subq = (
            select(func.count(Application.id))
            .where(Application.job_id == Job.id)
            .scalar_subquery()
        )
        query = select(Job, subq.label("candidates_count"))
        if status is not None:
            query = query.where(Job.status == status)
        if area is not None:
            query = query.where(Job.area == area)
        if location is not None:
            query = query.where(Job.location.ilike(f"%{location}%"))
        if search is not None:
            query = query.where(Job.title.ilike(f"%{search}%"))
        query = query.order_by(Job.created_at.desc()).offset(skip).limit(limit)
        result = await self.db.execute(query)
        rows = result.all()
        jobs: list[Job] = []
        for row in rows:
            job = row[0]
            job.candidates_count = row[1] or 0
            jobs.append(job)
        return jobs

    async def get_by_id(self, job_id: uuid.UUID) -> Job | None:
        result = await self.db.execute(
            select(Job)
            .options(selectinload(Job.requirements))
            .where(Job.id == job_id)
        )
        return result.scalar_one_or_none()

    async def get_by_ref_id(self, ref_id: str) -> Job | None:
        result = await self.db.execute(select(Job).where(Job.ref_id == ref_id))
        return result.scalar_one_or_none()

    async def get_next_ref_sequence(self) -> int:
        """Retorna el siguiente número secuencial global para ref_id CQ-NNN."""
        result = await self.db.execute(
            select(Job.ref_id)
            .where(Job.ref_id.like("CQ-%"))
            .order_by(Job.ref_id.desc())
            .limit(1)
        )
        last = result.scalar_one_or_none()
        if last is None:
            return 1
        try:
            return int(last.split("-")[-1]) + 1
        except (ValueError, IndexError):
            return 1

    async def create(self, data: dict) -> Job:
        job = Job(**data)
        self.db.add(job)
        await self.db.flush()
        await self.db.refresh(job, ["requirements"])
        return job

    async def update(self, job_id: uuid.UUID, data: dict) -> Job | None:
        job = await self.get_by_id(job_id)
        if job is None:
            return None
        for key, value in data.items():
            setattr(job, key, value)
        await self.db.flush()
        await self.db.refresh(job, ["requirements"])
        return job

    async def delete(self, job_id: uuid.UUID) -> bool:
        job = await self.get_by_id(job_id)
        if job is None:
            return False
        await self.db.delete(job)
        await self.db.flush()
        return True

    async def increment_views(self, job_id: uuid.UUID) -> Job | None:
        job = await self.get_by_id(job_id)
        if job is None:
            return None
        job.views += 1
        await self.db.flush()
        await self.db.refresh(job, ["requirements"])
        return job

    async def add_requirement(self, job_id: uuid.UUID, data: dict) -> JobRequirement:
        req = JobRequirement(job_id=job_id, **data)
        self.db.add(req)
        await self.db.flush()
        await self.db.refresh(req)
        return req
