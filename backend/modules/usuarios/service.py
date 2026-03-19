from __future__ import annotations

import logging
import uuid

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from core.security import hash_password
from modules.usuarios.repository import UserRepository
from modules.usuarios.schemas import UserCreate, UserResponse, UserUpdate

logger = logging.getLogger(__name__)


class UserService:
    def __init__(self, db: AsyncSession):
        self.repository = UserRepository(db)

    async def list_users(self, skip: int = 0, limit: int = 100) -> list[UserResponse]:
        users = await self.repository.get_all(skip=skip, limit=limit)
        return [UserResponse.model_validate(u) for u in users]

    async def get_user(self, user_id: uuid.UUID) -> UserResponse:
        user = await self.repository.get_by_id(user_id)
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Usuario {user_id} no encontrado",
            )
        return UserResponse.model_validate(user)

    async def create_user(self, data: UserCreate) -> UserResponse:
        existing = await self.repository.get_by_email(data.email)
        if existing is not None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Email {data.email} ya registrado",
            )
        payload = data.model_dump(exclude={"password"})
        payload["password_hash"] = hash_password(data.password)
        user = await self.repository.create(payload)
        logger.info("Usuario creado: %s", user.id)
        return UserResponse.model_validate(user)

    async def update_user(self, user_id: uuid.UUID, data: UserUpdate) -> UserResponse:
        await self.get_user(user_id)
        update_data = data.model_dump(exclude_none=True)
        if "password" in update_data:
            update_data["password_hash"] = hash_password(update_data.pop("password"))
        user = await self.repository.update(user_id, update_data)
        return UserResponse.model_validate(user)

    async def delete_user(self, user_id: uuid.UUID) -> None:
        await self.get_user(user_id)
        await self.repository.delete(user_id)
        logger.info("Usuario eliminado: %s", user_id)


# Alias de compatibilidad con el router antiguo
UsuarioService = UserService
