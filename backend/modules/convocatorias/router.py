from __future__ import annotations

import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, Query
from fastapi import status as http_status
from sqlalchemy.ext.asyncio import AsyncSession

from core.dependencies import get_current_user, get_db
from modules.convocatorias.schemas import (
    JobCreate,
    JobListResponse,
    JobRequirementCreate,
    JobRequirementResponse,
    JobResponse,
    JobUpdate,
)
from modules.convocatorias.service import JobService

router = APIRouter(prefix="/api/v1/convocatorias", tags=["convocatorias"])


@router.get("/", response_model=list[JobListResponse])
async def list_jobs(
    skip: int = 0,
    limit: int = 100,
    status: str | None = Query(default=None),
    area: str | None = Query(default=None),
    location: str | None = Query(default=None),
    search: str | None = Query(default=None),
    db: Annotated[AsyncSession, Depends(get_db)] = None,
) -> list[JobListResponse]:
    service = JobService(db)
    return await service.list_jobs(
        skip=skip, limit=limit, status=status, area=area,
        location=location, search=search,
    )


@router.post("/", response_model=JobResponse, status_code=http_status.HTTP_201_CREATED)
async def create_job(
    data: JobCreate,
    db: Annotated[AsyncSession, Depends(get_db)] = None,
    _: Annotated[str, Depends(get_current_user)] = None,
) -> JobResponse:
    service = JobService(db)
    return await service.create_job(data)


@router.get("/{job_id}", response_model=JobResponse)
async def get_job(
    job_id: uuid.UUID,
    db: Annotated[AsyncSession, Depends(get_db)] = None,
) -> JobResponse:
    service = JobService(db)
    return await service.get_job(job_id)


@router.put("/{job_id}", response_model=JobResponse)
async def update_job(
    job_id: uuid.UUID,
    data: JobUpdate,
    db: Annotated[AsyncSession, Depends(get_db)] = None,
    _: Annotated[str, Depends(get_current_user)] = None,
) -> JobResponse:
    service = JobService(db)
    return await service.update_job(job_id, data)


@router.delete("/{job_id}", status_code=http_status.HTTP_204_NO_CONTENT)
async def delete_job(
    job_id: uuid.UUID,
    db: Annotated[AsyncSession, Depends(get_db)] = None,
    _: Annotated[str, Depends(get_current_user)] = None,
) -> None:
    service = JobService(db)
    await service.delete_job(job_id)


@router.post(
    "/{job_id}/requirements",
    response_model=JobRequirementResponse,
    status_code=http_status.HTTP_201_CREATED,
)
async def add_requirement(
    job_id: uuid.UUID,
    data: JobRequirementCreate,
    db: Annotated[AsyncSession, Depends(get_db)] = None,
    _: Annotated[str, Depends(get_current_user)] = None,
) -> JobRequirementResponse:
    service = JobService(db)
    return await service.add_requirement(job_id, data)


@router.patch("/{job_id}/views", response_model=JobResponse)
async def increment_views(
    job_id: uuid.UUID,
    db: Annotated[AsyncSession, Depends(get_db)] = None,
) -> JobResponse:
    service = JobService(db)
    return await service.increment_views(job_id)
