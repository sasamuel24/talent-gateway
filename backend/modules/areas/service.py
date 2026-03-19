from __future__ import annotations

import logging

from sqlalchemy.ext.asyncio import AsyncSession

from modules.areas.repository import AreaRepository
from modules.areas.schemas import AreaStats

logger = logging.getLogger(__name__)


class AreaService:
    def __init__(self, db: AsyncSession):
        self.repository = AreaRepository(db)

    async def list_areas(self) -> list[str]:
        return await self.repository.get_all_areas()

    async def get_area_stats(self) -> list[AreaStats]:
        stats_data = await self.repository.get_area_stats()
        return [AreaStats(**item) for item in stats_data]
