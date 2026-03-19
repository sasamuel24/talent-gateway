from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from core.dependencies import get_db
from modules.areas.schemas import AreaStats
from modules.areas.service import AreaService

router = APIRouter(prefix="/api/v1/areas", tags=["areas"])


@router.get("/", response_model=list[str])
async def list_areas(
    db: Annotated[AsyncSession, Depends(get_db)] = None,
) -> list[str]:
    """Retorna lista de areas unicas registradas en convocatorias."""
    service = AreaService(db)
    return await service.list_areas()


@router.get("/stats", response_model=list[AreaStats])
async def get_area_stats(
    db: Annotated[AsyncSession, Depends(get_db)] = None,
) -> list[AreaStats]:
    """Retorna estadisticas de jobs y aplicaciones por area."""
    service = AreaService(db)
    return await service.get_area_stats()
