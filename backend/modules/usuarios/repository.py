from sqlalchemy.ext.asyncio import AsyncSession


class UsuarioRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all(self, skip: int = 0, limit: int = 100) -> list:
        # result = await self.db.execute(select(Usuario).offset(skip).limit(limit))
        # return result.scalars().all()
        return []

    async def get_by_id(self, usuario_id: int):
        # result = await self.db.execute(select(Usuario).where(Usuario.id == usuario_id))
        # return result.scalar_one_or_none()
        return None

    async def create(self, data: dict):
        # usuario = Usuario(**data)
        # self.db.add(usuario)
        # await self.db.flush()
        # return usuario
        raise NotImplementedError

    async def update(self, usuario_id: int, data: dict):
        raise NotImplementedError

    async def delete(self, usuario_id: int) -> bool:
        raise NotImplementedError
