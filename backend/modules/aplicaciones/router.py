from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from backend.core.dependencies import get_current_user, get_db
from backend.modules.aplicaciones.schemas import (
    AplicacionCreate,
    AplicacionResponse,
    AplicacionUpdate,
)
from backend.modules.aplicaciones.service import AplicacionService

router = APIRouter(prefix="/api/v1/aplicaciones", tags=["aplicaciones"])


@router.get("/", response_model=list[AplicacionResponse])
async def list_aplicaciones(
    skip: int = 0,
    limit: int = 100,
    convocatoria_id: int | None = Query(default=None),
    candidato_id: int | None = Query(default=None),
    db: AsyncSession = Depends(get_db),
    _: str = Depends(get_current_user),
):
    service = AplicacionService(db)
    return await service.list_aplicaciones(
        skip=skip,
        limit=limit,
        convocatoria_id=convocatoria_id,
        candidato_id=candidato_id,
    )


@router.get("/{aplicacion_id}", response_model=AplicacionResponse)
async def get_aplicacion(
    aplicacion_id: int,
    db: AsyncSession = Depends(get_db),
    _: str = Depends(get_current_user),
):
    service = AplicacionService(db)
    return await service.get_aplicacion(aplicacion_id)


@router.post("/", response_model=AplicacionResponse, status_code=status.HTTP_201_CREATED)
async def create_aplicacion(
    data: AplicacionCreate,
    db: AsyncSession = Depends(get_db),
):
    service = AplicacionService(db)
    return await service.create_aplicacion(data)


@router.put("/{aplicacion_id}", response_model=AplicacionResponse)
async def update_aplicacion(
    aplicacion_id: int,
    data: AplicacionUpdate,
    db: AsyncSession = Depends(get_db),
    _: str = Depends(get_current_user),
):
    service = AplicacionService(db)
    return await service.update_aplicacion(aplicacion_id, data)


@router.delete("/{aplicacion_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_aplicacion(
    aplicacion_id: int,
    db: AsyncSession = Depends(get_db),
    _: str = Depends(get_current_user),
):
    service = AplicacionService(db)
    await service.delete_aplicacion(aplicacion_id)
