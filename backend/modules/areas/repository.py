from sqlalchemy.ext.asyncio import AsyncSession


class AreaRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all(self, skip: int = 0, limit: int = 100) -> list:
        return []

    async def get_by_id(self, area_id: int):
        return None

    async def create(self, data: dict):
        raise NotImplementedError

    async def update(self, area_id: int, data: dict):
        raise NotImplementedError

    async def delete(self, area_id: int) -> bool:
        raise NotImplementedError
