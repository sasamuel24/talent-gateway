from pydantic import BaseModel


class DashboardStats(BaseModel):
    total_convocatorias_activas: int
    total_candidatos: int
    total_aplicaciones: int
    aplicaciones_hoy: int
    aplicaciones_por_estado: dict[str, int]
    convocatorias_por_area: dict[str, int]
