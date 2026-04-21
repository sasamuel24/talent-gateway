import uuid
from datetime import date, datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, EmailStr, Field


# ---------------------------------------------------------------------------
# Sub-schemas de candidato (importados desde candidatos para consistencia)
# ---------------------------------------------------------------------------
class ExperienceResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    candidate_id: uuid.UUID
    position: str
    company: str
    start_date: date | None
    end_date: date | None
    details: str | None


class EducationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    candidate_id: uuid.UUID
    degree: str | None
    institution: str | None
    field_of_study: str | None
    graduation_date: date | None


class LanguageResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    candidate_id: uuid.UUID
    language: str | None
    level: str | None


# ---------------------------------------------------------------------------
# CandidateBasic — embebido dentro de ApplicationFullResponse
# ---------------------------------------------------------------------------
class CandidateBasic(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    name: str
    email: str
    phone: str | None
    location: str | None
    cv_url: str | None
    experience: list[ExperienceResponse] = []
    education: list[EducationResponse] = []
    languages: list[LanguageResponse] = []


# ---------------------------------------------------------------------------
# JobBasic — embebido dentro de ApplicationFullResponse
# ---------------------------------------------------------------------------
class JobBasic(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    title: str
    area: str | None
    location: str | None
    ref_id: str | None


# ---------------------------------------------------------------------------
# Application schemas
# ---------------------------------------------------------------------------
class ApplicationCreate(BaseModel):
    candidate_id: uuid.UUID
    job_id: uuid.UUID


# ---------------------------------------------------------------------------
# Atomic submit — crea candidato + perfil + aplicación en una sola llamada
# ---------------------------------------------------------------------------
class ExperienceSubmit(BaseModel):
    position: str = Field(..., max_length=150)
    company: str = Field(..., max_length=150)
    start_date: date | None = None
    end_date: date | None = None
    details: str | None = None


class EducationSubmit(BaseModel):
    degree: str | None = Field(default=None, max_length=100)
    institution: str | None = Field(default=None, max_length=200)
    field_of_study: str | None = Field(default=None, max_length=200)
    graduation_date: date | None = None


class LanguageSubmit(BaseModel):
    language: str | None = Field(default=None, max_length=50)
    level: str | None = Field(default=None, max_length=50)


class ApplicationSubmit(BaseModel):
    """Payload único para registrar candidato + perfil + aplicación en una sola transacción."""
    job_id: uuid.UUID
    name: str = Field(..., max_length=100)
    email: EmailStr
    phone: str | None = Field(default=None, max_length=20)
    location: str | None = Field(default=None, max_length=100)
    experience: list[ExperienceSubmit] = []
    education: list[EducationSubmit] = []
    languages: list[LanguageSubmit] = []


class ApplicationDecisionUpdate(BaseModel):
    human_decision: str = Field(
        ..., pattern="^(nuevo|revisado|entrevista|aprobado|rechazado)$"
    )


class ApplicationNotesUpdate(BaseModel):
    notes: str


# Schema enriquecido para la vista admin
class ApplicationFullResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    candidate_id: uuid.UUID
    job_id: uuid.UUID
    applied_date: datetime
    ai_score: Decimal | None
    ai_decision: str
    human_decision: str
    notes: str | None
    ai_justificacion: str | None = None
    candidate: CandidateBasic
    job: JobBasic


# Forzar resolución de forward references para Pydantic v2
ApplicationFullResponse.model_rebuild()


# ---------------------------------------------------------------------------
# Schemas legacy (mantener compatibilidad con endpoints existentes)
# ---------------------------------------------------------------------------
class ApplicationUpdate(BaseModel):
    ai_score: Decimal | None = Field(default=None, ge=0, le=100)
    ai_decision: str | None = Field(
        default=None, pattern="^(aprobado|rechazado|pendiente)$"
    )
    human_decision: str | None = Field(
        default=None,
        pattern="^(nuevo|revisado|entrevista|aprobado|rechazado)$",
    )
    notes: str | None = None


class ApplicationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    candidate_id: uuid.UUID
    job_id: uuid.UUID
    applied_date: datetime
    ai_score: Decimal | None
    ai_decision: str
    human_decision: str
    notes: str | None
