from __future__ import annotations

from pydantic import BaseModel


class AreaStats(BaseModel):
    area: str
    total_jobs: int
    total_aplicaciones: int
