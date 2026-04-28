from __future__ import annotations

import logging

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from core.security import create_access_token, hash_password, verify_password
from modules.candidate_auth.repository import CandidateAuthRepository
from modules.candidate_auth.schemas import (
    CandidateLoginRequest,
    CandidateLoginResponse,
    CandidateMeResponse,
    CandidateRegisterRequest,
)

logger = logging.getLogger(__name__)


class CandidateAuthService:
    def __init__(self, db: AsyncSession):
        self.repo = CandidateAuthRepository(db)

    async def register(self, data: CandidateRegisterRequest) -> CandidateLoginResponse:
        existing = await self.repo.get_by_email(data.email)
        if existing is not None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Ya existe una cuenta con ese correo electrónico",
            )
        candidate = await self.repo.create(
            name=data.name,
            email=data.email,
            password_hash=hash_password(data.password),
            phone=data.phone,
        )
        token = create_access_token(subject=str(candidate.id), scope="candidate")
        logger.info("Candidato registrado: %s", candidate.id)
        return CandidateLoginResponse(
            access_token=token,
            candidate_id=str(candidate.id),
            name=candidate.name,
            email=candidate.email,
        )

    async def login(self, credentials: CandidateLoginRequest) -> CandidateLoginResponse:
        candidate = await self.repo.get_by_email(credentials.email)
        if candidate is None or candidate.password_hash is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Credenciales incorrectas",
                headers={"WWW-Authenticate": "Bearer"},
            )
        if not verify_password(credentials.password, candidate.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Credenciales incorrectas",
                headers={"WWW-Authenticate": "Bearer"},
            )
        token = create_access_token(subject=str(candidate.id), scope="candidate")
        logger.info("Login candidato: %s", candidate.id)
        return CandidateLoginResponse(
            access_token=token,
            candidate_id=str(candidate.id),
            name=candidate.name,
            email=candidate.email,
        )

    async def me(self, candidate_id: str) -> CandidateMeResponse:
        candidate = await self.repo.get_by_id(candidate_id)
        if candidate is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Candidato no encontrado",
            )
        return CandidateMeResponse(
            id=str(candidate.id),
            name=candidate.name,
            email=candidate.email,
            phone=candidate.phone,
            location=candidate.location,
        )
