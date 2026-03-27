from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from modules.catalogs.repository import CatalogRepository
from modules.catalogs.schemas import CatalogItemCreate, CatalogItemResponse, CatalogItemUpdate


class CatalogService:
    def __init__(self, db: AsyncSession, model):
        self.repo = CatalogRepository(db, model)

    async def list_items(self, active_only: bool = False) -> list[CatalogItemResponse]:
        items = await self.repo.get_all(active_only=active_only)
        return [CatalogItemResponse.model_validate(i) for i in items]

    async def create_item(self, data: CatalogItemCreate) -> CatalogItemResponse:
        existing = await self.repo.get_by_name(data.name)
        if existing is not None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"'{data.name}' ya existe en el catalogo.",
            )
        item = await self.repo.create(data.name)
        return CatalogItemResponse.model_validate(item)

    async def update_item(self, item_id: int, data: CatalogItemUpdate) -> CatalogItemResponse:
        payload = data.model_dump(exclude_none=True)
        if not payload:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Nada que actualizar.",
            )
        if "name" in payload:
            existing = await self.repo.get_by_name(payload["name"])
            if existing is not None and existing.id != item_id:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail=f"'{payload['name']}' ya existe.",
                )
        item = await self.repo.update(item_id, payload)
        if item is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Elemento no encontrado.",
            )
        return CatalogItemResponse.model_validate(item)

    async def delete_item(self, item_id: int) -> None:
        count = await self.repo.count_jobs(item_id)
        if count > 0:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"No se puede eliminar: {count} convocatoria(s) lo usan. Desactivalo en su lugar.",
            )
        deleted = await self.repo.delete(item_id)
        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Elemento no encontrado.",
            )
