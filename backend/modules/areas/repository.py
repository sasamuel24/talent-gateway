from __future__ import annotations

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from db.models import Application, Job


class AreaRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all_areas(self) -> list[str]:
        result = await self.db.execute(
            select(Job.area)
            .where(Job.area.isnot(None))
            .distinct()
            .order_by(Job.area)
        )
        return [row[0] for row in result.all()]

    async def get_area_stats(self) -> list[dict]:
        # Total jobs por area
        jobs_query = (
            select(Job.area, func.count(Job.id).label("total_jobs"))
            .where(Job.area.isnot(None))
            .group_by(Job.area)
        )
        jobs_result = await self.db.execute(jobs_query)
        jobs_by_area: dict[str, int] = {row.area: row.total_jobs for row in jobs_result.all()}

        # Total aplicaciones por area (via job)
        apps_query = (
            select(Job.area, func.count(Application.id).label("total_aplicaciones"))
            .join(Application, Application.job_id == Job.id, isouter=True)
            .where(Job.area.isnot(None))
            .group_by(Job.area)
        )
        apps_result = await self.db.execute(apps_query)
        apps_by_area: dict[str, int] = {
            row.area: row.total_aplicaciones for row in apps_result.all()
        }

        stats = []
        for area in sorted(jobs_by_area.keys()):
            stats.append(
                {
                    "area": area,
                    "total_jobs": jobs_by_area.get(area, 0),
                    "total_aplicaciones": apps_by_area.get(area, 0),
                }
            )
        return stats
