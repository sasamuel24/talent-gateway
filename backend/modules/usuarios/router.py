from typing import Annotated

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from backend.core.dependencies import get_current_user, get_db
from backend.modules.usuarios.schemas import UsuarioCreate, UsuarioResponse, UsuarioUpdate
from backend.modules.usuarios.service import UsuarioService

router = APIRouter(prefix="/api/v1/usuarios", tags=["usuarios"])


@router.get("/", response_model=list[UsuarioResponse])
async def list_usuarios(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    _: str = Depends(get_current_user),
):
    service = UsuarioService(db)
    return await service.list_usuarios(skip=skip, limit=limit)


@router.get("/{usuario_id}", response_model=UsuarioResponse)
async def get_usuario(
    usuario_id: int,
    db: AsyncSession = Depends(get_db),
    _: str = Depends(get_current_user),
):
    service = UsuarioService(db)
    return await service.get_usuario(usuario_id)


@router.post("/", response_model=UsuarioResponse, status_code=status.HTTP_201_CREATED)
async def create_usuario(
    data: UsuarioCreate,
    db: AsyncSession = Depends(get_db),
    _: str = Depends(get_current_user),
):
    service = UsuarioService(db)
    return await service.create_usuario(data)


@router.put("/{usuario_id}", response_model=UsuarioResponse)
async def update_usuario(
    usuario_id: int,
    data: UsuarioUpdate,
    db: AsyncSession = Depends(get_db),
    _: str = Depends(get_current_user),
):
    service = UsuarioService(db)
    return await service.update_usuario(usuario_id, data)


@router.delete("/{usuario_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_usuario(
    usuario_id: int,
    db: AsyncSession = Depends(get_db),
    _: str = Depends(get_current_user),
):
    service = UsuarioService(db)
    await service.delete_usuario(usuario_id)
