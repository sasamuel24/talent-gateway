from sqlalchemy.ext.asyncio import AsyncSession


class CandidatoRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all(self, skip: int = 0, limit: int = 100) -> list:
        return []

    async def get_by_id(self, candidato_id: int):
        return None

    async def get_by_email(self, email: str):
        return None

    async def create(self, data: dict):
        raise NotImplementedError

    async def update(self, candidato_id: int, data: dict):
        raise NotImplementedError

    async def delete(self, candidato_id: int) -> bool:
        raise NotImplementedError
