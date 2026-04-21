import logging
import uuid

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from modules.aplicaciones.repository import ApplicationRepository
from modules.aplicaciones.schemas import (
    ApplicationCreate,
    ApplicationDecisionUpdate,
    ApplicationFullResponse,
    ApplicationNotesUpdate,
    ApplicationSubmit,
)
from modules.candidatos.repository import CandidateRepository
from db.models import CandidateExperience, CandidateEducation, CandidateLanguage

logger = logging.getLogger(__name__)


class ApplicationService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repository = ApplicationRepository(db)

    # ── Serialización explícita ──────────────────────────────────────────────
    # model_validate() de Pydantic v2 no resuelve relaciones SQLAlchemy anidadas
    # de forma fiable; construimos el dict manualmente para garantizar que
    # candidate y job siempre lleguen al frontend.

    @staticmethod
    def _serialize(app) -> ApplicationFullResponse:
        candidate = app.candidate
        job = app.job
        return ApplicationFullResponse.model_validate({
            "id": app.id,
            "candidate_id": app.candidate_id,
            "job_id": app.job_id,
            "applied_date": app.applied_date,
            "ai_score": app.ai_score,
            "ai_decision": app.ai_decision,
            "human_decision": app.human_decision,
            "notes": app.notes,
            "ai_justificacion": app.ai_justificacion,
            "candidate": {
                "id": candidate.id,
                "name": candidate.name,
                "email": candidate.email,
                "phone": candidate.phone,
                "location": candidate.location,
                "cv_url": candidate.cv_url,
                "experience": [
                    {
                        "id": e.id,
                        "candidate_id": e.candidate_id,
                        "position": e.position,
                        "company": e.company,
                        "start_date": e.start_date,
                        "end_date": e.end_date,
                        "details": e.details,
                    }
                    for e in candidate.experience
                ],
                "education": [
                    {
                        "id": e.id,
                        "candidate_id": e.candidate_id,
                        "degree": e.degree,
                        "institution": e.institution,
                        "field_of_study": e.field_of_study,
                        "graduation_date": e.graduation_date,
                    }
                    for e in candidate.education
                ],
                "languages": [
                    {
                        "id": lang.id,
                        "candidate_id": lang.candidate_id,
                        "language": lang.language,
                        "level": lang.level,
                    }
                    for lang in candidate.languages
                ],
            },
            "job": {
                "id": job.id,
                "title": job.title,
                "area": job.area,
                "location": job.location,
                "ref_id": job.ref_id,
            },
        })

    # ── Métodos públicos ─────────────────────────────────────────────────────

    async def submit_application(self, data: ApplicationSubmit) -> ApplicationFullResponse:
        """
        Crea candidato + perfil + aplicación en una única transacción.
        Si el candidato ya existe (por email), limpia el perfil anterior.
        Si la aplicación ya existe (mismo candidato + job), la retorna sin duplicar.
        """
        candidate_repo = CandidateRepository(self.db)

        # 1. Candidato (idempotente por email)
        candidate = await candidate_repo.get_by_email(data.email)
        if candidate is not None:
            await candidate_repo.clear_profile_data(candidate.id)
            for key, value in {"name": data.name, "phone": data.phone, "location": data.location}.items():
                if value is not None:
                    setattr(candidate, key, value)
            await self.db.flush()
        else:
            candidate = await candidate_repo.create({
                "name": data.name,
                "email": data.email,
                "phone": data.phone,
                "location": data.location,
            })

        # 2. Experiencia
        for exp in data.experience:
            self.db.add(CandidateExperience(candidate_id=candidate.id, **exp.model_dump()))

        # 3. Educación
        for edu in data.education:
            self.db.add(CandidateEducation(candidate_id=candidate.id, **edu.model_dump()))

        # 4. Idiomas
        for lang in data.languages:
            self.db.add(CandidateLanguage(candidate_id=candidate.id, **lang.model_dump()))

        await self.db.flush()

        # 5. Aplicación (idempotente por candidate + job)
        existing = await self.repository.get_by_candidate_and_job(candidate.id, data.job_id)
        if existing is not None:
            logger.info(
                "Aplicacion ya existente para candidato=%s job=%s, retornando existente",
                candidate.id, data.job_id,
            )
            return self._serialize(existing)

        app = await self.repository.create({"candidate_id": candidate.id, "job_id": data.job_id})
        logger.info("Aplicacion atomica creada: candidato=%s job=%s", candidate.id, data.job_id)
        return self._serialize(app)

    async def list_applications(
        self,
        skip: int = 0,
        limit: int = 100,
        job_id: uuid.UUID | None = None,
        ai_decision: str | None = None,
        human_decision: str | None = None,
    ) -> list[ApplicationFullResponse]:
        apps = await self.repository.get_all(
            skip=skip,
            limit=limit,
            job_id=job_id,
            ai_decision=ai_decision,
            human_decision=human_decision,
        )
        return [self._serialize(a) for a in apps]

    async def get_application(self, application_id: uuid.UUID) -> ApplicationFullResponse:
        app = await self.repository.get_by_id(application_id)
        if app is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Aplicacion {application_id} no encontrada",
            )
        return self._serialize(app)

    async def create_application(self, data: ApplicationCreate) -> ApplicationFullResponse:
        """Crea una aplicacion. Si ya existe (mismo candidato + job), retorna la existente sin error."""
        existing = await self.repository.get_by_candidate_and_job(
            data.candidate_id, data.job_id
        )
        if existing is not None:
            logger.info(
                "Aplicacion duplicada para candidato=%s job=%s, retornando existente",
                data.candidate_id,
                data.job_id,
            )
            return self._serialize(existing)

        app = await self.repository.create({"candidate_id": data.candidate_id, "job_id": data.job_id})
        logger.info(
            "Aplicacion creada: candidato=%s job=%s", data.candidate_id, data.job_id
        )
        return self._serialize(app)

    async def update_decision(
        self, application_id: uuid.UUID, data: ApplicationDecisionUpdate
    ) -> ApplicationFullResponse:
        await self.get_application(application_id)
        app = await self.repository.update(
            application_id, {"human_decision": data.human_decision}
        )
        return self._serialize(app)

    async def update_notes(
        self, application_id: uuid.UUID, data: ApplicationNotesUpdate
    ) -> ApplicationFullResponse:
        await self.get_application(application_id)
        app = await self.repository.update(
            application_id, {"notes": data.notes}
        )
        return self._serialize(app)


# Alias de compatibilidad
AplicacionService = ApplicationService
