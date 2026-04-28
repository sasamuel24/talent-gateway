from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession

from core.security import verify_token
from db.session import get_session

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")
candidate_oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/candidate-auth/login")


async def get_db() -> AsyncSession:
    async for session in get_session():
        yield session


async def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],
    db: Annotated[AsyncSession, Depends(get_db)],
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="No se pudo validar las credenciales",
        headers={"WWW-Authenticate": "Bearer"},
    )
    payload = verify_token(token)
    if payload is None:
        raise credentials_exception
    user_id: str = payload.get("sub")
    if user_id is None:
        raise credentials_exception
    return user_id


async def get_current_candidate(
    token: Annotated[str, Depends(candidate_oauth2_scheme)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> str:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="No se pudo validar las credenciales del candidato",
        headers={"WWW-Authenticate": "Bearer"},
    )
    payload = verify_token(token)
    if payload is None:
        raise credentials_exception
    if payload.get("scope") != "candidate":
        raise credentials_exception
    candidate_id: str = payload.get("sub")
    if candidate_id is None:
        raise credentials_exception
    return candidate_id
