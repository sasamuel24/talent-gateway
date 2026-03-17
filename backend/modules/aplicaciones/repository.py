from sqlalchemy.ext.asyncio import AsyncSession


class AplicacionRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all(
        self,
        skip: int = 0,
        limit: int = 100,
        convocatoria_id: int | None = None,
        candidato_id: int | None = None,
    ) -> list:
        return []

    async def get_by_id(self, aplicacion_id: int):
        return None

    async def create(self, data: dict):
        raise NotImplementedError

    async def update(self, aplicacion_id: int, data: dict):
        raise NotImplementedError

    async def delete(self, aplicacion_id: int) -> bool:
        raise NotImplementedError
