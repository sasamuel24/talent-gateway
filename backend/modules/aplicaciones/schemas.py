from pydantic import BaseModel
from datetime import datetime
from typing import Literal


EstadoAplicacion = Literal[
    "recibida",
    "en_revision",
    "preseleccionada",
    "entrevista",
    "descartada",
    "contratada",
]


class AplicacionBase(BaseModel):
    convocatoria_id: int
    candidato_id: int
    carta_presentacion: str | None = None
    cv_url: str | None = None


class AplicacionCreate(AplicacionBase):
    pass


class AplicacionUpdate(BaseModel):
    estado: EstadoAplicacion | None = None
    puntaje_ia: float | None = None
    notas_reclutador: str | None = None


class AplicacionResponse(AplicacionBase):
    id: int
    estado: str
    puntaje_ia: float | None
    notas_reclutador: str | None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
