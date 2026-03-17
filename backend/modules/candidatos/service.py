from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from backend.core.security import hash_password
from backend.modules.candidatos.repository import CandidatoRepository
from backend.modules.candidatos.schemas import CandidatoCreate, CandidatoUpdate


class CandidatoService:
    def __init__(self, db: AsyncSession):
        self.repository = CandidatoRepository(db)

    async def list_candidatos(self, skip: int = 0, limit: int = 100) -> list:
        return await self.repository.get_all(skip=skip, limit=limit)

    async def get_candidato(self, candidato_id: int):
        candidato = await self.repository.get_by_id(candidato_id)
        if not candidato:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Candidato {candidato_id} no encontrado",
            )
        return candidato

    async def create_candidato(self, data: CandidatoCreate):
        existing = await self.repository.get_by_email(data.email)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Ya existe un candidato con ese email",
            )
        payload = data.model_dump(exclude={"password"})
        payload["hashed_password"] = hash_password(data.password)
        return await self.repository.create(payload)

    async def update_candidato(self, candidato_id: int, data: CandidatoUpdate):
        await self.get_candidato(candidato_id)
        return await self.repository.update(
            candidato_id, data.model_dump(exclude_none=True)
        )

    async def delete_candidato(self, candidato_id: int) -> bool:
        await self.get_candidato(candidato_id)
        return await self.repository.delete(candidato_id)
