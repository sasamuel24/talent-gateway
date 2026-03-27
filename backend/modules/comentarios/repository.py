import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from db.models import ApplicationComment


class CommentRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_application(self, application_id: uuid.UUID) -> list[ApplicationComment]:
        result = await self.db.execute(
            select(ApplicationComment)
            .where(ApplicationComment.application_id == application_id)
            .order_by(ApplicationComment.created_at.asc())
        )
        return list(result.scalars().all())

    async def create(self, data: dict) -> ApplicationComment:
        comment = ApplicationComment(**data)
        self.db.add(comment)
        await self.db.flush()
        await self.db.refresh(comment)
        return comment

    async def delete(self, comment_id: int) -> bool:
        result = await self.db.execute(
            select(ApplicationComment).where(ApplicationComment.id == comment_id)
        )
        comment = result.scalar_one_or_none()
        if comment is None:
            return False
        await self.db.delete(comment)
        await self.db.flush()
        return True
