from __future__ import annotations

from pydantic import BaseModel


class DashboardStats(BaseModel):
    total_jobs_activas: int
    total_candidatos: int
    total_aplicaciones: int
    aplicaciones_hoy: int
    tasa_aprobacion: float
    candidatos_por_estado: dict[str, int] = {}


class JobStatsResponse(BaseModel):
    job_id: str
    title: str
    total_aplicaciones: int
    aprobados: int
    rechazados: int
    pendientes: int


class ApplicationTrendResponse(BaseModel):
    date: str
    total: int
