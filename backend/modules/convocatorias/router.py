from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from backend.core.dependencies import get_current_user, get_db
from backend.modules.convocatorias.schemas import (
    ConvocatoriaCreate,
    ConvocatoriaResponse,
    ConvocatoriaUpdate,
)
from backend.modules.convocatorias.service import ConvocatoriaService

router = APIRouter(prefix="/api/v1/convocatorias", tags=["convocatorias"])


@router.get("/", response_model=list[ConvocatoriaResponse])
async def list_convocatorias(
    skip: int = 0,
    limit: int = 100,
    activa: bool | None = Query(default=None),
    db: AsyncSession = Depends(get_db),
):
    service = ConvocatoriaService(db)
    return await service.list_convocatorias(skip=skip, limit=limit, activa=activa)


@router.get("/{convocatoria_id}", response_model=ConvocatoriaResponse)
async def get_convocatoria(
    convocatoria_id: int, db: AsyncSession = Depends(get_db)
):
    service = ConvocatoriaService(db)
    return await service.get_convocatoria(convocatoria_id)


@router.post("/", response_model=ConvocatoriaResponse, status_code=status.HTTP_201_CREATED)
async def create_convocatoria(
    data: ConvocatoriaCreate,
    db: AsyncSession = Depends(get_db),
    _: str = Depends(get_current_user),
):
    service = ConvocatoriaService(db)
    return await service.create_convocatoria(data)


@router.put("/{convocatoria_id}", response_model=ConvocatoriaResponse)
async def update_convocatoria(
    convocatoria_id: int,
    data: ConvocatoriaUpdate,
    db: AsyncSession = Depends(get_db),
    _: str = Depends(get_current_user),
):
    service = ConvocatoriaService(db)
    return await service.update_convocatoria(convocatoria_id, data)


@router.delete("/{convocatoria_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_convocatoria(
    convocatoria_id: int,
    db: AsyncSession = Depends(get_db),
    _: str = Depends(get_current_user),
):
    service = ConvocatoriaService(db)
    await service.delete_convocatoria(convocatoria_id)
