from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from backend.core.dependencies import get_current_user, get_db
from backend.modules.candidatos.schemas import (
    CandidatoCreate,
    CandidatoResponse,
    CandidatoUpdate,
)
from backend.modules.candidatos.service import CandidatoService

router = APIRouter(prefix="/api/v1/candidatos", tags=["candidatos"])


@router.get("/", response_model=list[CandidatoResponse])
async def list_candidatos(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    _: str = Depends(get_current_user),
):
    service = CandidatoService(db)
    return await service.list_candidatos(skip=skip, limit=limit)


@router.get("/{candidato_id}", response_model=CandidatoResponse)
async def get_candidato(
    candidato_id: int,
    db: AsyncSession = Depends(get_db),
    _: str = Depends(get_current_user),
):
    service = CandidatoService(db)
    return await service.get_candidato(candidato_id)


@router.post("/", response_model=CandidatoResponse, status_code=status.HTTP_201_CREATED)
async def create_candidato(
    data: CandidatoCreate,
    db: AsyncSession = Depends(get_db),
):
    service = CandidatoService(db)
    return await service.create_candidato(data)


@router.put("/{candidato_id}", response_model=CandidatoResponse)
async def update_candidato(
    candidato_id: int,
    data: CandidatoUpdate,
    db: AsyncSession = Depends(get_db),
    _: str = Depends(get_current_user),
):
    service = CandidatoService(db)
    return await service.update_candidato(candidato_id, data)


@router.delete("/{candidato_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_candidato(
    candidato_id: int,
    db: AsyncSession = Depends(get_db),
    _: str = Depends(get_current_user),
):
    service = CandidatoService(db)
    await service.delete_candidato(candidato_id)
