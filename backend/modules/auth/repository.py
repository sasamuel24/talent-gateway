from sqlalchemy.ext.asyncio import AsyncSession


class AuthRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_user_by_email(self, email: str):
        # Se implementara cuando exista el modelo Usuario
        # result = await self.db.execute(select(Usuario).where(Usuario.email == email))
        # return result.scalar_one_or_none()
        raise NotImplementedError("Implementar cuando el modelo Usuario exista")
