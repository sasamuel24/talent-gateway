from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from backend.modules.areas.repository import AreaRepository
from backend.modules.areas.schemas import AreaCreate, AreaUpdate


class AreaService:
    def __init__(self, db: AsyncSession):
        self.repository = AreaRepository(db)

    async def list_areas(self, skip: int = 0, limit: int = 100) -> list:
        return await self.repository.get_all(skip=skip, limit=limit)

    async def get_area(self, area_id: int):
        area = await self.repository.get_by_id(area_id)
        if not area:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Area {area_id} no encontrada",
            )
        return area

    async def create_area(self, data: AreaCreate):
        return await self.repository.create(data.model_dump())

    async def update_area(self, area_id: int, data: AreaUpdate):
        await self.get_area(area_id)
        return await self.repository.update(area_id, data.model_dump(exclude_none=True))

    async def delete_area(self, area_id: int) -> bool:
        await self.get_area(area_id)
        return await self.repository.delete(area_id)
