from __future__ import annotations

import uuid
from datetime import date, datetime
from decimal import Decimal

from sqlalchemy import (
    Boolean,
    CheckConstraint,
    Column,
    Date,
    DateTime,
    ForeignKey,
    Integer,
    Numeric,
    String,
    Text,
    UniqueConstraint,
    func,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from db.base import Base


# ---------------------------------------------------------------------------
# users
# ---------------------------------------------------------------------------
class User(Base):
    __tablename__ = "users"
    __table_args__ = (
        CheckConstraint("role IN ('admin', 'recruiter', 'viewer')", name="ck_users_role"),
        CheckConstraint("status IN ('activo', 'inactivo')", name="ck_users_status"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(150), unique=True, nullable=False)
    role: Mapped[str] = mapped_column(String(20), nullable=False, default="viewer")
    status: Mapped[str] = mapped_column(String(10), nullable=False, default="activo")
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=False), server_default=func.now(), nullable=False
    )

    # relationships
    jobs: Mapped[list[Job]] = relationship("Job", back_populates="creator")
    training_reviews: Mapped[list[AITrainingCase]] = relationship(
        "AITrainingCase", back_populates="reviewer"
    )


# ---------------------------------------------------------------------------
# jobs
# ---------------------------------------------------------------------------
class Job(Base):
    __tablename__ = "jobs"
    __table_args__ = (
        CheckConstraint(
            "status IN ('activa', 'borrador', 'cerrada')", name="ck_jobs_status"
        ),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    location: Mapped[str | None] = mapped_column(String(100))
    department: Mapped[str | None] = mapped_column(String(100))
    area: Mapped[str | None] = mapped_column(String(100), index=True)
    type: Mapped[str | None] = mapped_column(String(50))
    date_posted: Mapped[date | None] = mapped_column(Date, server_default=func.current_date())
    ref_id: Mapped[str | None] = mapped_column(String(50), unique=True)
    description: Mapped[str | None] = mapped_column(Text)
    status: Mapped[str] = mapped_column(String(10), nullable=False, default="borrador", index=True)
    views: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    ai_prompt: Mapped[str | None] = mapped_column(Text)
    created_by: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="SET NULL"),
        index=True,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=False), server_default=func.now(), nullable=False
    )

    # relationships
    creator: Mapped[User | None] = relationship("User", back_populates="jobs")
    requirements: Mapped[list[JobRequirement]] = relationship(
        "JobRequirement", back_populates="job", cascade="all, delete-orphan"
    )
    applications: Mapped[list[Application]] = relationship(
        "Application", back_populates="job", cascade="all, delete-orphan"
    )
    training_cases: Mapped[list[AITrainingCase]] = relationship(
        "AITrainingCase", back_populates="job"
    )


# ---------------------------------------------------------------------------
# job_requirements
# ---------------------------------------------------------------------------
class JobRequirement(Base):
    __tablename__ = "job_requirements"
    __table_args__ = (
        CheckConstraint(
            "type IN ('funcion', 'requisito', 'perfil_ideal')",
            name="ck_job_requirements_type",
        ),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    job_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("jobs.id", ondelete="CASCADE"),
        nullable=False,
    )
    type: Mapped[str] = mapped_column(String(20), nullable=False)
    label: Mapped[str | None] = mapped_column(String(100))
    content: Mapped[str] = mapped_column(Text, nullable=False)
    order_col: Mapped[int] = mapped_column("order", Integer, nullable=False, default=0)

    # relationships
    job: Mapped[Job] = relationship("Job", back_populates="requirements")


# ---------------------------------------------------------------------------
# candidates
# ---------------------------------------------------------------------------
class Candidate(Base):
    __tablename__ = "candidates"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(150), unique=True, nullable=False)
    phone: Mapped[str | None] = mapped_column(String(20))
    location: Mapped[str | None] = mapped_column(String(100))
    cv_url: Mapped[str | None] = mapped_column(String(500))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=False), server_default=func.now(), nullable=False
    )

    # relationships
    applications: Mapped[list[Application]] = relationship(
        "Application", back_populates="candidate", cascade="all, delete-orphan"
    )
    experience: Mapped[list[CandidateExperience]] = relationship(
        "CandidateExperience", back_populates="candidate", cascade="all, delete-orphan"
    )
    education: Mapped[list[CandidateEducation]] = relationship(
        "CandidateEducation", back_populates="candidate", cascade="all, delete-orphan"
    )
    languages: Mapped[list[CandidateLanguage]] = relationship(
        "CandidateLanguage", back_populates="candidate", cascade="all, delete-orphan"
    )
    training_cases: Mapped[list[AITrainingCase]] = relationship(
        "AITrainingCase", back_populates="candidate"
    )


# ---------------------------------------------------------------------------
# applications
# ---------------------------------------------------------------------------
class Application(Base):
    __tablename__ = "applications"
    __table_args__ = (
        UniqueConstraint("candidate_id", "job_id", name="uq_applications_candidate_job"),
        CheckConstraint(
            "ai_score >= 0 AND ai_score <= 100", name="ck_applications_ai_score"
        ),
        CheckConstraint(
            "ai_decision IN ('aprobado', 'rechazado', 'pendiente')",
            name="ck_applications_ai_decision",
        ),
        CheckConstraint(
            "human_decision IN ('nuevo', 'revisado', 'entrevista', 'aprobado', 'rechazado')",
            name="ck_applications_human_decision",
        ),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    candidate_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("candidates.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    job_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("jobs.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    applied_date: Mapped[datetime] = mapped_column(
        DateTime(timezone=False), server_default=func.now(), nullable=False
    )
    ai_score: Mapped[Decimal | None] = mapped_column(Numeric(5, 2), index=True)
    ai_decision: Mapped[str] = mapped_column(
        String(10), nullable=False, default="pendiente"
    )
    human_decision: Mapped[str] = mapped_column(
        String(15), nullable=False, default="nuevo"
    )
    notes: Mapped[str | None] = mapped_column(Text)
    ai_justificacion: Mapped[str | None] = mapped_column(Text)

    # relationships
    candidate: Mapped[Candidate] = relationship("Candidate", back_populates="applications")
    job: Mapped[Job] = relationship("Job", back_populates="applications")


# ---------------------------------------------------------------------------
# candidate_experience
# ---------------------------------------------------------------------------
class CandidateExperience(Base):
    __tablename__ = "candidate_experience"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    candidate_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("candidates.id", ondelete="CASCADE"),
        nullable=False,
    )
    position: Mapped[str] = mapped_column(String(150), nullable=False)
    company: Mapped[str] = mapped_column(String(150), nullable=False)
    start_date: Mapped[date | None] = mapped_column(Date)
    end_date: Mapped[date | None] = mapped_column(Date)
    details: Mapped[str | None] = mapped_column(Text)

    # relationships
    candidate: Mapped[Candidate] = relationship("Candidate", back_populates="experience")


# ---------------------------------------------------------------------------
# candidate_education
# ---------------------------------------------------------------------------
class CandidateEducation(Base):
    __tablename__ = "candidate_education"
    __table_args__ = (
        CheckConstraint(
            "degree IN ('Bachiller','Tecnico','Tecnólogo','Pregrado','Especialización','Maestría','Doctorado')",
            name="ck_candidate_education_degree",
        ),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    candidate_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("candidates.id", ondelete="CASCADE"),
        nullable=False,
    )
    degree: Mapped[str | None] = mapped_column(String(30))
    institution: Mapped[str | None] = mapped_column(String(200))
    field_of_study: Mapped[str | None] = mapped_column(String(200))
    graduation_date: Mapped[date | None] = mapped_column(Date)

    # relationships
    candidate: Mapped[Candidate] = relationship("Candidate", back_populates="education")


# ---------------------------------------------------------------------------
# candidate_languages
# ---------------------------------------------------------------------------
class CandidateLanguage(Base):
    __tablename__ = "candidate_languages"
    __table_args__ = (
        CheckConstraint(
            "level IN ('Básico', 'Intermedio', 'Avanzado', 'Nativo/Bilingüe')",
            name="ck_candidate_languages_level",
        ),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    candidate_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("candidates.id", ondelete="CASCADE"),
        nullable=False,
    )
    language: Mapped[str | None] = mapped_column(String(50))
    level: Mapped[str | None] = mapped_column(String(20))

    # relationships
    candidate: Mapped[Candidate] = relationship("Candidate", back_populates="languages")


# ---------------------------------------------------------------------------
# ai_weights
# ---------------------------------------------------------------------------
class AIWeight(Base):
    __tablename__ = "ai_weights"
    __table_args__ = (
        CheckConstraint("weight >= 0 AND weight <= 100", name="ck_ai_weights_weight"),
        CheckConstraint(
            "category IN ('tecnico', 'cultural', 'experiencia')",
            name="ck_ai_weights_category",
        ),
    )

    id: Mapped[str] = mapped_column(String(50), primary_key=True)
    label: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    weight: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    category: Mapped[str] = mapped_column(String(20), nullable=False)


# ---------------------------------------------------------------------------
# ai_training_cases
# ---------------------------------------------------------------------------
class AITrainingCase(Base):
    __tablename__ = "ai_training_cases"
    __table_args__ = (
        CheckConstraint(
            "ai_decision IN ('aprobado', 'rechazado', 'pendiente')",
            name="ck_training_ai_decision",
        ),
        CheckConstraint(
            "human_decision IN ('aprobado', 'rechazado')",
            name="ck_training_human_decision",
        ),
        CheckConstraint("ai_score >= 0 AND ai_score <= 100", name="ck_training_ai_score"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    candidate_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("candidates.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    job_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("jobs.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    ai_decision: Mapped[str | None] = mapped_column(String(10))
    ai_score: Mapped[Decimal | None] = mapped_column(Numeric(5, 2))
    human_decision: Mapped[str | None] = mapped_column(String(10))
    is_correct: Mapped[bool | None] = mapped_column(Boolean)
    reviewed_by: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="SET NULL"),
    )
    reviewed_date: Mapped[datetime | None] = mapped_column(DateTime(timezone=False))

    # relationships
    candidate: Mapped[Candidate] = relationship("Candidate", back_populates="training_cases")
    job: Mapped[Job] = relationship("Job", back_populates="training_cases")
    reviewer: Mapped[User | None] = relationship("User", back_populates="training_reviews")


# ---------------------------------------------------------------------------
# ai_metrics_history
# ---------------------------------------------------------------------------
class AIMetricsHistory(Base):
    __tablename__ = "ai_metrics_history"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    recorded_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=False), server_default=func.now(), nullable=False
    )
    precision: Mapped[Decimal | None] = mapped_column(Numeric(5, 2))
    recall: Mapped[Decimal | None] = mapped_column(Numeric(5, 2))
    f1_score: Mapped[Decimal | None] = mapped_column(Numeric(5, 2))
    total_decisions: Mapped[int | None] = mapped_column(Integer)
    correct_decisions: Mapped[int | None] = mapped_column(Integer)
    training_cases: Mapped[int | None] = mapped_column(Integer)
