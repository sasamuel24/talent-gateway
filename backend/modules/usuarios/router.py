from __future__ import annotations

import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from core.dependencies import get_current_user, get_db
from modules.usuarios.schemas import UserCreate, UserResponse, UserUpdate
from modules.usuarios.service import UserService

router = APIRouter(prefix="/api/v1/usuarios", tags=["usuarios"])


@router.get("/", response_model=list[UserResponse])
async def list_users(
    skip: int = 0,
    limit: int = 100,
    db: Annotated[AsyncSession, Depends(get_db)] = None,
    _: Annotated[str, Depends(get_current_user)] = None,
) -> list[UserResponse]:
    service = UserService(db)
    return await service.list_users(skip=skip, limit=limit)


@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def create_user(
    data: UserCreate,
    db: Annotated[AsyncSession, Depends(get_db)] = None,
    _: Annotated[str, Depends(get_current_user)] = None,
) -> UserResponse:
    service = UserService(db)
    return await service.create_user(data)


@router.get("/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: uuid.UUID,
    db: Annotated[AsyncSession, Depends(get_db)] = None,
    _: Annotated[str, Depends(get_current_user)] = None,
) -> UserResponse:
    service = UserService(db)
    return await service.get_user(user_id)


@router.put("/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: uuid.UUID,
    data: UserUpdate,
    db: Annotated[AsyncSession, Depends(get_db)] = None,
    _: Annotated[str, Depends(get_current_user)] = None,
) -> UserResponse:
    service = UserService(db)
    return await service.update_user(user_id, data)


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(
    user_id: uuid.UUID,
    db: Annotated[AsyncSession, Depends(get_db)] = None,
    _: Annotated[str, Depends(get_current_user)] = None,
) -> None:
    service = UserService(db)
    await service.delete_user(user_id)
