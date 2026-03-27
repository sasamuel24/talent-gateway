from typing import Annotated

from fastapi import APIRouter, Depends
from fastapi import status as http_status
from sqlalchemy.ext.asyncio import AsyncSession

from core.dependencies import get_current_user, get_db
from db.models import CatalogCity, CatalogJobType, CatalogArea, CatalogContractType
from modules.catalogs.schemas import CatalogItemCreate, CatalogItemResponse, CatalogItemUpdate
from modules.catalogs.service import CatalogService


def make_catalog_router(prefix: str, model, tag: str) -> APIRouter:
    router = APIRouter(prefix=f"/api/v1/catalogs/{prefix}", tags=[tag])

    @router.get("/", response_model=list[CatalogItemResponse])
    async def list_items(
        active_only: bool = False,
        db: Annotated[AsyncSession, Depends(get_db)] = None,
    ) -> list[CatalogItemResponse]:
        return await CatalogService(db, model).list_items(active_only=active_only)

    @router.post("/", response_model=CatalogItemResponse, status_code=http_status.HTTP_201_CREATED)
    async def create_item(
        data: CatalogItemCreate,
        db: Annotated[AsyncSession, Depends(get_db)] = None,
        _: Annotated[str, Depends(get_current_user)] = None,
    ) -> CatalogItemResponse:
        return await CatalogService(db, model).create_item(data)

    @router.put("/{item_id}", response_model=CatalogItemResponse)
    async def update_item(
        item_id: int,
        data: CatalogItemUpdate,
        db: Annotated[AsyncSession, Depends(get_db)] = None,
        _: Annotated[str, Depends(get_current_user)] = None,
    ) -> CatalogItemResponse:
        return await CatalogService(db, model).update_item(item_id, data)

    @router.delete("/{item_id}", status_code=http_status.HTTP_204_NO_CONTENT)
    async def delete_item(
        item_id: int,
        db: Annotated[AsyncSession, Depends(get_db)] = None,
        _: Annotated[str, Depends(get_current_user)] = None,
    ) -> None:
        await CatalogService(db, model).delete_item(item_id)

    return router


ciudades_router = make_catalog_router("ciudades", CatalogCity, "catalogs-ciudades")
tipos_cargo_router = make_catalog_router("tipos-cargo", CatalogJobType, "catalogs-tipos-cargo")
areas_router = make_catalog_router("areas", CatalogArea, "catalogs-areas")
tipos_contrato_router = make_catalog_router("tipos-contrato", CatalogContractType, "catalogs-tipos-contrato")
