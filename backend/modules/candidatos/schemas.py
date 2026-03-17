from pydantic import BaseModel, EmailStr
from datetime import datetime


class CandidatoBase(BaseModel):
    nombre: str
    apellido: str
    email: EmailStr
    telefono: str | None = None
    pais: str = "Colombia"
    estado: str | None = None
    ciudad: str | None = None
    linkedin_url: str | None = None
    resumen: str | None = None
    experiencia_anos: int | None = None


class CandidatoCreate(CandidatoBase):
    password: str


class CandidatoUpdate(BaseModel):
    nombre: str | None = None
    apellido: str | None = None
    telefono: str | None = None
    ciudad: str | None = None
    linkedin_url: str | None = None
    resumen: str | None = None
    experiencia_anos: int | None = None


class CandidatoResponse(CandidatoBase):
    id: int
    created_at: datetime

    model_config = {"from_attributes": True}
