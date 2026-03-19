from __future__ import annotations

import logging

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from core.security import create_access_token, verify_password
from modules.auth.repository import AuthRepository
from modules.auth.schemas import LoginRequest, LoginResponse
from modules.usuarios.schemas import UserResponse

logger = logging.getLogger(__name__)


class AuthService:
    def __init__(self, db: AsyncSession):
        self.repository = AuthRepository(db)

    async def login(self, credentials: LoginRequest) -> LoginResponse:
        user = await self.repository.get_user_by_email(credentials.email)
        if user is None or not verify_password(credentials.password, user.password_hash):
            logger.warning("Intento de login fallido para email: %s", credentials.email)
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Credenciales incorrectas",
                headers={"WWW-Authenticate": "Bearer"},
            )
        if user.status == "inactivo":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Usuario inactivo",
            )
        token = create_access_token(subject=str(user.id))
        logger.info("Login exitoso para user_id: %s", user.id)
        return LoginResponse(
            access_token=token,
            token_type="bearer",
            user=UserResponse.model_validate(user),
        )
