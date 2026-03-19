from __future__ import annotations

import uuid
from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


# ---------------------------------------------------------------------------
# Experience
# ---------------------------------------------------------------------------
class ExperienceBase(BaseModel):
    position: str = Field(..., max_length=150)
    company: str = Field(..., max_length=150)
    start_date: date | None = None
    end_date: date | None = None
    details: str | None = None


class ExperienceCreate(ExperienceBase):
    pass


class ExperienceResponse(ExperienceBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    candidate_id: uuid.UUID


# ---------------------------------------------------------------------------
# Education
# ---------------------------------------------------------------------------
class EducationBase(BaseModel):
    degree: str | None = Field(
        default=None,
        pattern="^(Bachiller|Tecnico|Tecnólogo|Pregrado|Especialización|Maestría|Doctorado)$",
    )
    institution: str | None = Field(default=None, max_length=200)
    field_of_study: str | None = Field(default=None, max_length=200)
    graduation_date: date | None = None


class EducationCreate(EducationBase):
    pass


class EducationResponse(EducationBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    candidate_id: uuid.UUID


# ---------------------------------------------------------------------------
# Language
# ---------------------------------------------------------------------------
class LanguageBase(BaseModel):
    language: str | None = Field(default=None, max_length=50)
    level: str | None = Field(
        default=None,
        pattern="^(Básico|Intermedio|Avanzado|Nativo/Bilingüe)$",
    )


class LanguageCreate(LanguageBase):
    pass


class LanguageResponse(LanguageBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    candidate_id: uuid.UUID


# ---------------------------------------------------------------------------
# Candidate
# ---------------------------------------------------------------------------
class CandidateBase(BaseModel):
    name: str = Field(..., max_length=100)
    email: EmailStr
    phone: str | None = Field(default=None, max_length=20)
    location: str | None = Field(default=None, max_length=100)
    cv_url: str | None = Field(default=None, max_length=500)


class CandidateCreate(CandidateBase):
    pass


class CandidateUpdate(BaseModel):
    name: str | None = Field(default=None, max_length=100)
    email: EmailStr | None = None
    phone: str | None = None
    location: str | None = None
    cv_url: str | None = None


class CandidateResponse(CandidateBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    created_at: datetime
    experience: list[ExperienceResponse] = []
    education: list[EducationResponse] = []
    languages: list[LanguageResponse] = []
