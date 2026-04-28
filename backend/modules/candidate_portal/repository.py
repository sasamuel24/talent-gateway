from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from db.models import Application


class CandidatePortalRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def list_applications(self, candidate_id: str) -> list[Application]:
        result = await self.db.execute(
            select(Application)
            .options(selectinload(Application.job))
            .where(Application.candidate_id == candidate_id)
            .order_by(Application.applied_date.desc())
        )
        return list(result.scalars().all())

    async def get_application(
        self, candidate_id: str, application_id: str
    ) -> Application | None:
        result = await self.db.execute(
            select(Application)
            .options(selectinload(Application.job))
            .where(
                Application.id == application_id,
                Application.candidate_id == candidate_id,
            )
        )
        return result.scalar_one_or_none()
