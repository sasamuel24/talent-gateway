from pydantic import BaseModel, EmailStr
from datetime import datetime


class UsuarioBase(BaseModel):
    email: EmailStr
    nombre: str
    apellido: str
    rol: str = "reclutador"
    activo: bool = True


class UsuarioCreate(UsuarioBase):
    password: str


class UsuarioUpdate(BaseModel):
    nombre: str | None = None
    apellido: str | None = None
    rol: str | None = None
    activo: bool | None = None


class UsuarioResponse(UsuarioBase):
    id: int
    created_at: datetime

    model_config = {"from_attributes": True}
