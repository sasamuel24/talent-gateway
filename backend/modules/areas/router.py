from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from backend.core.dependencies import get_current_user, get_db
from backend.modules.areas.schemas import AreaCreate, AreaResponse, AreaUpdate
from backend.modules.areas.service import AreaService

router = APIRouter(prefix="/api/v1/areas", tags=["areas"])


@router.get("/", response_model=list[AreaResponse])
async def list_areas(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
):
    service = AreaService(db)
    return await service.list_areas(skip=skip, limit=limit)


@router.get("/{area_id}", response_model=AreaResponse)
async def get_area(area_id: int, db: AsyncSession = Depends(get_db)):
    service = AreaService(db)
    return await service.get_area(area_id)


@router.post("/", response_model=AreaResponse, status_code=status.HTTP_201_CREATED)
async def create_area(
    data: AreaCreate,
    db: AsyncSession = Depends(get_db),
    _: str = Depends(get_current_user),
):
    service = AreaService(db)
    return await service.create_area(data)


@router.put("/{area_id}", response_model=AreaResponse)
async def update_area(
    area_id: int,
    data: AreaUpdate,
    db: AsyncSession = Depends(get_db),
    _: str = Depends(get_current_user),
):
    service = AreaService(db)
    return await service.update_area(area_id, data)


@router.delete("/{area_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_area(
    area_id: int,
    db: AsyncSession = Depends(get_db),
    _: str = Depends(get_current_user),
):
    service = AreaService(db)
    await service.delete_area(area_id)
