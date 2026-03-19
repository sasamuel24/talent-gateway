from __future__ import annotations

import uuid
from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field


# ---------------------------------------------------------------------------
# Job Requirements
# ---------------------------------------------------------------------------
class JobRequirementBase(BaseModel):
    type: str = Field(..., pattern="^(funcion|requisito|perfil_ideal)$")
    label: str | None = Field(default=None, max_length=100)
    content: str
    order: int = Field(default=0, alias="order_col")

    model_config = ConfigDict(populate_by_name=True)


class JobRequirementCreate(BaseModel):
    type: str = Field(..., pattern="^(funcion|requisito|perfil_ideal)$")
    label: str | None = Field(default=None, max_length=100)
    content: str
    order: int = 0


class JobRequirementResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    id: int
    job_id: uuid.UUID
    type: str
    label: str | None
    content: str
    order: int = Field(alias="order_col")


# ---------------------------------------------------------------------------
# Jobs
# ---------------------------------------------------------------------------
class JobBase(BaseModel):
    title: str = Field(..., max_length=200)
    location: str | None = Field(default=None, max_length=100)
    department: str | None = Field(default=None, max_length=100)
    area: str | None = Field(default=None, max_length=100)
    type: str | None = Field(default=None, max_length=50)
    date_posted: date | None = None
    ref_id: str | None = Field(default=None, max_length=50)
    description: str | None = None
    status: str = Field(default="borrador", pattern="^(activa|borrador|cerrada)$")
    ai_prompt: str | None = None


class JobCreate(JobBase):
    created_by: uuid.UUID | None = None


class JobUpdate(BaseModel):
    title: str | None = Field(default=None, max_length=200)
    location: str | None = None
    department: str | None = None
    area: str | None = None
    type: str | None = None
    date_posted: date | None = None
    ref_id: str | None = None
    description: str | None = None
    status: str | None = Field(default=None, pattern="^(activa|borrador|cerrada)$")
    ai_prompt: str | None = None


class JobListResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    title: str
    location: str | None
    department: str | None
    area: str | None
    type: str | None
    date_posted: date | None
    ref_id: str | None
    status: str
    views: int
    created_at: datetime
    candidates_count: int = 0


class JobResponse(JobBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    views: int
    created_by: uuid.UUID | None
    created_at: datetime
    requirements: list[JobRequirementResponse] = []
