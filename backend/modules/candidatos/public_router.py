"""Public endpoints for candidate submission — NO auth required."""
from __future__ import annotations

import uuid
from typing import Annotated

from fastapi import APIRouter, Depends
from fastapi import status as http_status
from sqlalchemy.ext.asyncio import AsyncSession

from db.session import get_session
from modules.candidatos.schemas import (
    CandidateCreate,
    CandidateResponse,
    EducationCreate,
    EducationResponse,
    ExperienceCreate,
    ExperienceResponse,
    LanguageCreate,
    LanguageResponse,
)
from modules.candidatos.service import CandidateService


async def get_db() -> AsyncSession:
    async for session in get_session():
        yield session


public_router = APIRouter(prefix="/api/v1/candidatos", tags=["candidatos-public"])


@public_router.post(
    "/",
    response_model=CandidateResponse,
    status_code=http_status.HTTP_201_CREATED,
)
async def create_candidate(
    data: CandidateCreate,
    db: Annotated[AsyncSession, Depends(get_db)] = None,
) -> CandidateResponse:
    service = CandidateService(db)
    return await service.create_candidate(data)


@public_router.post(
    "/{candidate_id}/experience",
    response_model=ExperienceResponse,
    status_code=http_status.HTTP_201_CREATED,
)
async def add_experience(
    candidate_id: uuid.UUID,
    data: ExperienceCreate,
    db: Annotated[AsyncSession, Depends(get_db)] = None,
) -> ExperienceResponse:
    service = CandidateService(db)
    return await service.add_experience(candidate_id, data)


@public_router.post(
    "/{candidate_id}/education",
    response_model=EducationResponse,
    status_code=http_status.HTTP_201_CREATED,
)
async def add_education(
    candidate_id: uuid.UUID,
    data: EducationCreate,
    db: Annotated[AsyncSession, Depends(get_db)] = None,
) -> EducationResponse:
    service = CandidateService(db)
    return await service.add_education(candidate_id, data)


@public_router.post(
    "/{candidate_id}/languages",
    response_model=LanguageResponse,
    status_code=http_status.HTTP_201_CREATED,
)
async def add_language(
    candidate_id: uuid.UUID,
    data: LanguageCreate,
    db: Annotated[AsyncSession, Depends(get_db)] = None,
) -> LanguageResponse:
    service = CandidateService(db)
    return await service.add_language(candidate_id, data)
