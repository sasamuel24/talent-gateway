from __future__ import annotations

import uuid
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field


# ---------------------------------------------------------------------------
# AI Weights
# ---------------------------------------------------------------------------
class AIWeightBase(BaseModel):
    label: str = Field(..., max_length=100)
    description: str | None = None
    weight: int = Field(..., ge=0, le=100)
    category: str = Field(..., pattern="^(tecnico|cultural|experiencia)$")


class AIWeightUpdate(BaseModel):
    label: str | None = Field(default=None, max_length=100)
    description: str | None = None
    weight: int | None = Field(default=None, ge=0, le=100)
    category: str | None = Field(default=None, pattern="^(tecnico|cultural|experiencia)$")


class AIWeightResponse(AIWeightBase):
    model_config = ConfigDict(from_attributes=True)

    id: str


# ---------------------------------------------------------------------------
# AI Score (scoring endpoint)
# ---------------------------------------------------------------------------
class ScoreBreakdown(BaseModel):
    criterion: str
    weight: int
    raw_score: float
    weighted_score: float


class AIScoreRequest(BaseModel):
    candidate_id: uuid.UUID
    job_id: uuid.UUID


class AIScoreResponse(BaseModel):
    candidate_id: uuid.UUID
    job_id: uuid.UUID
    score: Decimal
    decision: str
    breakdown: list[ScoreBreakdown] = []
