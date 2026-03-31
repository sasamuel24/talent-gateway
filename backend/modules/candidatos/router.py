from __future__ import annotations

import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, UploadFile, File
from fastapi import status as http_status
from sqlalchemy.ext.asyncio import AsyncSession

from core.dependencies import get_current_user, get_db
from core.s3 import upload_candidate_pdf
from modules.candidatos.schemas import (
    CandidateCreate,
    CandidateResponse,
    CandidateUpdate,
    EducationCreate,
    EducationResponse,
    ExperienceCreate,
    ExperienceResponse,
    LanguageCreate,
    LanguageResponse,
)
from modules.candidatos.service import CandidateService

router = APIRouter(prefix="/api/v1/candidatos", tags=["candidatos"])


# ── Public endpoints (no auth required) ────────────────────────────────────

@router.post("", response_model=CandidateResponse, status_code=http_status.HTTP_201_CREATED)
async def create_candidate(
    data: CandidateCreate,
    db: Annotated[AsyncSession, Depends(get_db)] = None,
) -> CandidateResponse:
    service = CandidateService(db)
    return await service.create_candidate(data)


@router.post("/{candidate_id}/cv", status_code=http_status.HTTP_200_OK)
async def upload_cv(
    candidate_id: uuid.UUID,
    file: Annotated[UploadFile, File(description="CV del candidato en formato PDF")],
    db: Annotated[AsyncSession, Depends(get_db)] = None,
) -> dict:
    """Sube el CV (PDF) a S3 y guarda la URL pública en el candidato."""
    url = await upload_candidate_pdf(candidate_id, file)
    service = CandidateService(db)
    await service.update_candidate(candidate_id, CandidateUpdate(cv_url=url))
    return {"cv_url": url}


@router.post("/{candidate_id}/experience", response_model=ExperienceResponse, status_code=http_status.HTTP_201_CREATED)
async def add_experience(
    candidate_id: uuid.UUID,
    data: ExperienceCreate,
    db: Annotated[AsyncSession, Depends(get_db)] = None,
) -> ExperienceResponse:
    service = CandidateService(db)
    return await service.add_experience(candidate_id, data)


@router.post("/{candidate_id}/education", response_model=EducationResponse, status_code=http_status.HTTP_201_CREATED)
async def add_education(
    candidate_id: uuid.UUID,
    data: EducationCreate,
    db: Annotated[AsyncSession, Depends(get_db)] = None,
) -> EducationResponse:
    service = CandidateService(db)
    return await service.add_education(candidate_id, data)


@router.post("/{candidate_id}/languages", response_model=LanguageResponse, status_code=http_status.HTTP_201_CREATED)
async def add_language(
    candidate_id: uuid.UUID,
    data: LanguageCreate,
    db: Annotated[AsyncSession, Depends(get_db)] = None,
) -> LanguageResponse:
    service = CandidateService(db)
    return await service.add_language(candidate_id, data)


# ── Protected endpoints (admin only) ───────────────────────────────────────

@router.get("", response_model=list[CandidateResponse])
async def list_candidates(
    skip: int = 0,
    limit: int = 100,
    search: str | None = None,
    db: Annotated[AsyncSession, Depends(get_db)] = None,
    _: Annotated[str, Depends(get_current_user)] = None,
) -> list[CandidateResponse]:
    service = CandidateService(db)
    return await service.list_candidates(skip=skip, limit=limit, search=search)


@router.get("/{candidate_id}", response_model=CandidateResponse)
async def get_candidate(
    candidate_id: uuid.UUID,
    db: Annotated[AsyncSession, Depends(get_db)] = None,
    _: Annotated[str, Depends(get_current_user)] = None,
) -> CandidateResponse:
    service = CandidateService(db)
    return await service.get_candidate(candidate_id)


@router.put("/{candidate_id}", response_model=CandidateResponse)
async def update_candidate(
    candidate_id: uuid.UUID,
    data: CandidateUpdate,
    db: Annotated[AsyncSession, Depends(get_db)] = None,
    _: Annotated[str, Depends(get_current_user)] = None,
) -> CandidateResponse:
    service = CandidateService(db)
    return await service.update_candidate(candidate_id, data)
