from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from db.models import CatalogCity, CatalogJobType, CatalogArea, CatalogContractType, Job


class CatalogRepository:
    def __init__(self, db: AsyncSession, model):
        self.db = db
        self.model = model

    async def get_all(self, active_only: bool = False):
        q = select(self.model)
        if active_only:
            q = q.where(self.model.is_active == True)
        q = q.order_by(self.model.name)
        result = await self.db.execute(q)
        return list(result.scalars().all())

    async def get_by_id(self, item_id: int):
        result = await self.db.execute(select(self.model).where(self.model.id == item_id))
        return result.scalar_one_or_none()

    async def get_by_name(self, name: str):
        result = await self.db.execute(select(self.model).where(self.model.name == name))
        return result.scalar_one_or_none()

    async def create(self, name: str):
        item = self.model(name=name)
        self.db.add(item)
        await self.db.flush()
        await self.db.refresh(item)
        return item

    async def update(self, item_id: int, data: dict):
        item = await self.get_by_id(item_id)
        if item is None:
            return None
        for k, v in data.items():
            setattr(item, k, v)
        await self.db.flush()
        await self.db.refresh(item)
        return item

    async def delete(self, item_id: int) -> bool:
        item = await self.get_by_id(item_id)
        if item is None:
            return False
        await self.db.delete(item)
        await self.db.flush()
        return True

    async def count_jobs(self, item_id: int) -> int:
        """Cuenta cuantos jobs usan este catalogo (para bloquear borrado)."""
        fk_col_map = {
            "catalog_cities": Job.city_id,
            "catalog_job_types": Job.job_type_id,
            "catalog_areas": Job.area_id,
            "catalog_contract_types": Job.contract_type_id,
        }
        fk_col = fk_col_map.get(self.model.__tablename__)
        if fk_col is None:
            return 0
        result = await self.db.execute(select(func.count()).where(fk_col == item_id))
        return result.scalar_one()
