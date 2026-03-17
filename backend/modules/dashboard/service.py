from sqlalchemy.ext.asyncio import AsyncSession

from backend.modules.dashboard.repository import DashboardRepository
from backend.modules.dashboard.schemas import DashboardStats


class DashboardService:
    def __init__(self, db: AsyncSession):
        self.repository = DashboardRepository(db)

    async def get_stats(self) -> DashboardStats:
        data = await self.repository.get_stats()
        return DashboardStats(**data)
