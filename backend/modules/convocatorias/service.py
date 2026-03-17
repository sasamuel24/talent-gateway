from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from backend.modules.convocatorias.repository import ConvocatoriaRepository
from backend.modules.convocatorias.schemas import ConvocatoriaCreate, ConvocatoriaUpdate


class ConvocatoriaService:
    def __init__(self, db: AsyncSession):
        self.repository = ConvocatoriaRepository(db)

    async def list_convocatorias(
        self, skip: int = 0, limit: int = 100, activa: bool | None = None
    ) -> list:
        return await self.repository.get_all(skip=skip, limit=limit, activa=activa)

    async def get_convocatoria(self, convocatoria_id: int):
        convocatoria = await self.repository.get_by_id(convocatoria_id)
        if not convocatoria:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Convocatoria {convocatoria_id} no encontrada",
            )
        return convocatoria

    async def create_convocatoria(self, data: ConvocatoriaCreate):
        return await self.repository.create(data.model_dump())

    async def update_convocatoria(self, convocatoria_id: int, data: ConvocatoriaUpdate):
        await self.get_convocatoria(convocatoria_id)
        return await self.repository.update(
            convocatoria_id, data.model_dump(exclude_none=True)
        )

    async def delete_convocatoria(self, convocatoria_id: int) -> bool:
        await self.get_convocatoria(convocatoria_id)
        return await self.repository.delete(convocatoria_id)
