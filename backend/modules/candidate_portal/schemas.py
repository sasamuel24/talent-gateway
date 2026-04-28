from datetime import datetime

from pydantic import BaseModel

STATUS_LABELS: dict[str, str] = {
    "nuevo": "En revisión",
    "revisado": "En evaluación",
    "entrevista": "Citado a entrevista",
    "aprobado": "Seleccionado",
    "rechazado": "Proceso cerrado",
}


class PortalApplicationItem(BaseModel):
    id: str
    job_id: str
    job_title: str
    job_location: str | None
    applied_date: datetime
    status_key: str
    status_label: str


class PortalApplicationDetail(BaseModel):
    id: str
    job_id: str
    job_title: str
    job_location: str | None
    job_department: str | None
    applied_date: datetime
    status_key: str
    status_label: str
