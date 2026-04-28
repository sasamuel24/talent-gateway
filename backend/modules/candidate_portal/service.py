from __future__ import annotations

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from modules.candidate_portal.repository import CandidatePortalRepository
from modules.candidate_portal.schemas import (
    STATUS_LABELS,
    PortalApplicationDetail,
    PortalApplicationItem,
)


class CandidatePortalService:
    def __init__(self, db: AsyncSession):
        self.repo = CandidatePortalRepository(db)

    async def list_applications(self, candidate_id: str) -> list[PortalApplicationItem]:
        apps = await self.repo.list_applications(candidate_id)
        return [
            PortalApplicationItem(
                id=str(app.id),
                job_id=str(app.job_id),
                job_title=app.job.title if app.job else "—",
                job_location=app.job.location if app.job else None,
                applied_date=app.applied_date,
                status_key=app.human_decision,
                status_label=STATUS_LABELS.get(app.human_decision, app.human_decision),
            )
            for app in apps
        ]

    async def get_application(
        self, candidate_id: str, application_id: str
    ) -> PortalApplicationDetail:
        app = await self.repo.get_application(candidate_id, application_id)
        if app is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Postulación no encontrada",
            )
        return PortalApplicationDetail(
            id=str(app.id),
            job_id=str(app.job_id),
            job_title=app.job.title if app.job else "—",
            job_location=app.job.location if app.job else None,
            job_department=app.job.department if app.job else None,
            applied_date=app.applied_date,
            status_key=app.human_decision,
            status_label=STATUS_LABELS.get(app.human_decision, app.human_decision),
        )
