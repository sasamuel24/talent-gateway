from __future__ import annotations

import logging
import uuid

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from modules.convocatorias.repository import JobRepository
from modules.convocatorias.schemas import (
    JobCreate,
    JobListResponse,
    JobRequirementCreate,
    JobRequirementResponse,
    JobResponse,
    JobUpdate,
)

logger = logging.getLogger(__name__)


class JobService:
    def __init__(self, db: AsyncSession):
        self.repository = JobRepository(db)

    async def list_jobs(
        self,
        skip: int = 0,
        limit: int = 100,
        status: str | None = None,
        area: str | None = None,
        location: str | None = None,
        search: str | None = None,
    ) -> list[JobListResponse]:
        jobs = await self.repository.get_all(
            skip=skip, limit=limit, status=status, area=area,
            location=location, search=search,
        )
        return [JobListResponse.model_validate(j) for j in jobs]

    async def get_job(self, job_id: uuid.UUID) -> JobResponse:
        job = await self.repository.get_by_id(job_id)
        if job is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Convocatoria {job_id} no encontrada",
            )
        return JobResponse.model_validate(job)

    async def create_job(self, data: JobCreate) -> JobResponse:
        if data.ref_id:
            existing = await self.repository.get_by_ref_id(data.ref_id)
            if existing is not None:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail=f"ref_id '{data.ref_id}' ya existe",
                )
        else:
            seq = await self.repository.get_next_ref_sequence()
            data = data.model_copy(update={"ref_id": f"CQ-{seq:03d}"})
        job = await self.repository.create(data.model_dump())
        logger.info("Convocatoria creada: %s — ref_id: %s", job.id, job.ref_id)
        return JobResponse.model_validate(job)

    async def update_job(self, job_id: uuid.UUID, data: JobUpdate) -> JobResponse:
        await self.get_job(job_id)
        job = await self.repository.update(job_id, data.model_dump(exclude_none=True))
        return JobResponse.model_validate(job)

    async def delete_job(self, job_id: uuid.UUID) -> None:
        await self.get_job(job_id)
        await self.repository.delete(job_id)
        logger.info("Convocatoria eliminada: %s", job_id)

    async def delete_all_requirements(self, job_id: uuid.UUID) -> None:
        await self.get_job(job_id)
        await self.repository.delete_all_requirements(job_id)
        logger.info("Requisitos eliminados para convocatoria: %s", job_id)

    async def add_requirement(
        self, job_id: uuid.UUID, data: JobRequirementCreate
    ) -> JobRequirementResponse:
        await self.get_job(job_id)
        req_data = {
            "type": data.type,
            "label": data.label,
            "content": data.content,
            "order_col": data.order,
        }
        req = await self.repository.add_requirement(job_id, req_data)
        return JobRequirementResponse.model_validate(req)

    async def increment_views(self, job_id: uuid.UUID) -> JobResponse:
        job = await self.repository.increment_views(job_id)
        if job is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Convocatoria {job_id} no encontrada",
            )
        return JobResponse.model_validate(job)


# Alias de compatibilidad con router antiguo
ConvocatoriaService = JobService
