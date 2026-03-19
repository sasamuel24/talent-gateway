from __future__ import annotations

from datetime import date

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from db.models import Application, Candidate, Job


class DashboardRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_total_jobs_activas(self) -> int:
        result = await self.db.execute(
            select(func.count(Job.id)).where(Job.status == "activa")
        )
        return result.scalar_one() or 0

    async def get_total_candidatos(self) -> int:
        result = await self.db.execute(select(func.count(Candidate.id)))
        return result.scalar_one() or 0

    async def get_total_aplicaciones(self) -> int:
        result = await self.db.execute(select(func.count(Application.id)))
        return result.scalar_one() or 0

    async def get_aplicaciones_hoy(self) -> int:
        today = date.today()
        result = await self.db.execute(
            select(func.count(Application.id)).where(
                func.date(Application.applied_date) == today
            )
        )
        return result.scalar_one() or 0

    async def get_candidatos_por_estado(self) -> dict[str, int]:
        result = await self.db.execute(
            select(Application.human_decision, func.count(Application.id))
            .group_by(Application.human_decision)
        )
        return {row[0]: row[1] for row in result.all()}

    async def get_tasa_aprobacion(self) -> float:
        total_result = await self.db.execute(select(func.count(Application.id)))
        total = total_result.scalar_one() or 0
        if total == 0:
            return 0.0
        aprobados_result = await self.db.execute(
            select(func.count(Application.id)).where(
                Application.human_decision == "aprobado"
            )
        )
        aprobados = aprobados_result.scalar_one() or 0
        return round((aprobados / total) * 100, 2)
