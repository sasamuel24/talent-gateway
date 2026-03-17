from typing import Annotated

from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession

from backend.core.dependencies import get_db
from backend.modules.auth.schemas import TokenResponse
from backend.modules.auth.service import AuthService

router = APIRouter(prefix="/api/v1/auth", tags=["auth"])


@router.post("/login", response_model=TokenResponse)
async def login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: Annotated[AsyncSession, Depends(get_db)],
):
    from backend.modules.auth.schemas import LoginRequest

    service = AuthService(db)
    credentials = LoginRequest(email=form_data.username, password=form_data.password)
    return await service.login(credentials)
