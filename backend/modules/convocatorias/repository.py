from sqlalchemy.ext.asyncio import AsyncSession


class ConvocatoriaRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all(self, skip: int = 0, limit: int = 100, activa: bool | None = None) -> list:
        return []

    async def get_by_id(self, convocatoria_id: int):
        return None

    async def create(self, data: dict):
        raise NotImplementedError

    async def update(self, convocatoria_id: int, data: dict):
        raise NotImplementedError

    async def delete(self, convocatoria_id: int) -> bool:
        raise NotImplementedError
