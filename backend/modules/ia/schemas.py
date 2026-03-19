from __future__ import annotations

import uuid
from datetime import datetime
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
# Training Cases
# ---------------------------------------------------------------------------
class TrainingCaseBase(BaseModel):
    candidate_id: uuid.UUID
    job_id: uuid.UUID
    ai_decision: str | None = Field(
        default=None, pattern="^(aprobado|rechazado|pendiente)$"
    )
    ai_score: Decimal | None = Field(default=None, ge=0, le=100)
    human_decision: str | None = Field(
        default=None, pattern="^(aprobado|rechazado)$"
    )
    is_correct: bool | None = None


class TrainingCaseCreate(TrainingCaseBase):
    reviewed_by: uuid.UUID | None = None


class TrainingCaseResponse(TrainingCaseBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    reviewed_by: uuid.UUID | None
    reviewed_date: datetime | None


# ---------------------------------------------------------------------------
# Metrics History
# ---------------------------------------------------------------------------
class MetricsHistoryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    recorded_at: datetime
    precision: Decimal | None
    recall: Decimal | None
    f1_score: Decimal | None
    total_decisions: int | None
    correct_decisions: int | None
    training_cases: int | None


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
