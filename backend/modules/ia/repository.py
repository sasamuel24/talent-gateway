from sqlalchemy.ext.asyncio import AsyncSession


class IARepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_aplicacion_data(self, aplicacion_id: int) -> dict | None:
        # Obtener datos de candidato + convocatoria para el scoring
        return None

    async def update_puntaje(self, aplicacion_id: int, puntaje: float) -> bool:
        return False

    async def get_aplicaciones_por_convocatoria(self, convocatoria_id: int) -> list:
        return []
