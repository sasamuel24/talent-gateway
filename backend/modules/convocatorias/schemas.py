from pydantic import BaseModel
from datetime import datetime
from typing import Literal


class ConvocatoriaBase(BaseModel):
    titulo: str
    descripcion: str
    area_id: int
    ubicacion_pais: str = "Colombia"
    ubicacion_estado: str | None = None
    ubicacion_ciudad: str | None = None
    tipo_contrato: str | None = None
    modalidad: Literal["presencial", "hibrido", "remoto"] = "presencial"
    salario_min: float | None = None
    salario_max: float | None = None
    requisitos: str | None = None
    funciones: str | None = None
    perfil_ideal: str | None = None
    activa: bool = True
    fecha_cierre: datetime | None = None


class ConvocatoriaCreate(ConvocatoriaBase):
    pass


class ConvocatoriaUpdate(BaseModel):
    titulo: str | None = None
    descripcion: str | None = None
    area_id: int | None = None
    ubicacion_ciudad: str | None = None
    tipo_contrato: str | None = None
    modalidad: str | None = None
    salario_min: float | None = None
    salario_max: float | None = None
    requisitos: str | None = None
    funciones: str | None = None
    perfil_ideal: str | None = None
    activa: bool | None = None
    fecha_cierre: datetime | None = None


class ConvocatoriaResponse(ConvocatoriaBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
