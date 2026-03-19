from __future__ import annotations

import logging

from sqlalchemy.ext.asyncio import AsyncSession

from modules.dashboard.repository import DashboardRepository
from modules.dashboard.schemas import DashboardStats

logger = logging.getLogger(__name__)


class DashboardService:
    def __init__(self, db: AsyncSession):
        self.repository = DashboardRepository(db)

    async def get_stats(self) -> DashboardStats:
        total_jobs_activas = await self.repository.get_total_jobs_activas()
        total_candidatos = await self.repository.get_total_candidatos()
        total_aplicaciones = await self.repository.get_total_aplicaciones()
        aplicaciones_hoy = await self.repository.get_aplicaciones_hoy()
        tasa_aprobacion = await self.repository.get_tasa_aprobacion()
        candidatos_por_estado = await self.repository.get_candidatos_por_estado()
        return DashboardStats(
            total_jobs_activas=total_jobs_activas,
            total_candidatos=total_candidatos,
            total_aplicaciones=total_aplicaciones,
            aplicaciones_hoy=aplicaciones_hoy,
            tasa_aprobacion=tasa_aprobacion,
            candidatos_por_estado=candidatos_por_estado,
        )
