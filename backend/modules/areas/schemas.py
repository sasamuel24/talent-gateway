from pydantic import BaseModel
from datetime import datetime


class AreaBase(BaseModel):
    nombre: str
    descripcion: str | None = None
    activa: bool = True


class AreaCreate(AreaBase):
    pass


class AreaUpdate(BaseModel):
    nombre: str | None = None
    descripcion: str | None = None
    activa: bool | None = None


class AreaResponse(AreaBase):
    id: int
    created_at: datetime

    model_config = {"from_attributes": True}
