from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from backend.core.security import create_access_token, verify_password
from backend.modules.auth.repository import AuthRepository
from backend.modules.auth.schemas import LoginRequest, TokenResponse


class AuthService:
    def __init__(self, db: AsyncSession):
        self.repository = AuthRepository(db)

    async def login(self, credentials: LoginRequest) -> TokenResponse:
        user = await self.repository.get_user_by_email(credentials.email)
        if not user or not verify_password(credentials.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Credenciales incorrectas",
                headers={"WWW-Authenticate": "Bearer"},
            )
        token = create_access_token(subject=user.id)
        return TokenResponse(access_token=token)
