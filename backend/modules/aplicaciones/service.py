from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from backend.modules.aplicaciones.repository import AplicacionRepository
from backend.modules.aplicaciones.schemas import AplicacionCreate, AplicacionUpdate


class AplicacionService:
    def __init__(self, db: AsyncSession):
        self.repository = AplicacionRepository(db)

    async def list_aplicaciones(
        self,
        skip: int = 0,
        limit: int = 100,
        convocatoria_id: int | None = None,
        candidato_id: int | None = None,
    ) -> list:
        return await self.repository.get_all(
            skip=skip,
            limit=limit,
            convocatoria_id=convocatoria_id,
            candidato_id=candidato_id,
        )

    async def get_aplicacion(self, aplicacion_id: int):
        aplicacion = await self.repository.get_by_id(aplicacion_id)
        if not aplicacion:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Aplicacion {aplicacion_id} no encontrada",
            )
        return aplicacion

    async def create_aplicacion(self, data: AplicacionCreate):
        payload = data.model_dump()
        payload["estado"] = "recibida"
        return await self.repository.create(payload)

    async def update_aplicacion(self, aplicacion_id: int, data: AplicacionUpdate):
        await self.get_aplicacion(aplicacion_id)
        return await self.repository.update(
            aplicacion_id, data.model_dump(exclude_none=True)
        )

    async def delete_aplicacion(self, aplicacion_id: int) -> bool:
        await self.get_aplicacion(aplicacion_id)
        return await self.repository.delete(aplicacion_id)
