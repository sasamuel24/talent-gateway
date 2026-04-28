from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from core.dependencies import get_current_candidate, get_db
from modules.candidate_auth.schemas import (
    CandidateLoginRequest,
    CandidateLoginResponse,
    CandidateMeResponse,
    CandidateRegisterRequest,
)
from modules.candidate_auth.service import CandidateAuthService

router = APIRouter(prefix="/api/v1/candidate-auth", tags=["candidate-auth"])


@router.post("/register", response_model=CandidateLoginResponse, status_code=201)
async def register(
    data: CandidateRegisterRequest,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> CandidateLoginResponse:
    """Registrar nuevo candidato y obtener token JWT."""
    return await CandidateAuthService(db).register(data)


@router.post("/login", response_model=CandidateLoginResponse)
async def login(
    credentials: CandidateLoginRequest,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> CandidateLoginResponse:
    """Autenticar candidato y obtener token JWT."""
    return await CandidateAuthService(db).login(credentials)


@router.get("/me", response_model=CandidateMeResponse)
async def me(
    candidate_id: Annotated[str, Depends(get_current_candidate)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> CandidateMeResponse:
    """Perfil del candidato autenticado."""
    return await CandidateAuthService(db).me(candidate_id)
