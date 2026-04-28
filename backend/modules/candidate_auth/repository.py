from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from db.models import Candidate


class CandidateAuthRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_email(self, email: str) -> Candidate | None:
        result = await self.db.execute(select(Candidate).where(Candidate.email == email))
        return result.scalar_one_or_none()

    async def get_by_id(self, candidate_id: str) -> Candidate | None:
        result = await self.db.execute(
            select(Candidate).where(Candidate.id == candidate_id)
        )
        return result.scalar_one_or_none()

    async def create(
        self,
        name: str,
        email: str,
        password_hash: str,
        phone: str | None,
    ) -> Candidate:
        candidate = Candidate(
            name=name,
            email=email,
            password_hash=password_hash,
            phone=phone,
        )
        self.db.add(candidate)
        await self.db.commit()
        await self.db.refresh(candidate)
        return candidate
