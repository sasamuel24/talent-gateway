from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from backend.core.security import hash_password
from backend.modules.usuarios.repository import UsuarioRepository
from backend.modules.usuarios.schemas import UsuarioCreate, UsuarioUpdate


class UsuarioService:
    def __init__(self, db: AsyncSession):
        self.repository = UsuarioRepository(db)

    async def list_usuarios(self, skip: int = 0, limit: int = 100) -> list:
        return await self.repository.get_all(skip=skip, limit=limit)

    async def get_usuario(self, usuario_id: int):
        usuario = await self.repository.get_by_id(usuario_id)
        if not usuario:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Usuario {usuario_id} no encontrado",
            )
        return usuario

    async def create_usuario(self, data: UsuarioCreate):
        payload = data.model_dump(exclude={"password"})
        payload["hashed_password"] = hash_password(data.password)
        return await self.repository.create(payload)

    async def update_usuario(self, usuario_id: int, data: UsuarioUpdate):
        await self.get_usuario(usuario_id)
        return await self.repository.update(usuario_id, data.model_dump(exclude_none=True))

    async def delete_usuario(self, usuario_id: int) -> bool:
        await self.get_usuario(usuario_id)
        return await self.repository.delete(usuario_id)
