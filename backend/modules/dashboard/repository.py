from sqlalchemy.ext.asyncio import AsyncSession


class DashboardRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_stats(self) -> dict:
        # Se implementara con queries reales cuando los modelos existan
        return {
            "total_convocatorias_activas": 0,
            "total_candidatos": 0,
            "total_aplicaciones": 0,
            "aplicaciones_hoy": 0,
            "aplicaciones_por_estado": {},
            "convocatorias_por_area": {},
        }
