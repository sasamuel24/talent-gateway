import uuid
from typing import Annotated

from fastapi import APIRouter, Depends
from fastapi import status as http_status
from sqlalchemy.ext.asyncio import AsyncSession

from core.dependencies import get_current_user, get_db
from modules.comentarios.schemas import CommentCreate, CommentResponse
from modules.comentarios.service import CommentService

router = APIRouter(prefix="/api/v1/aplicaciones", tags=["comentarios"])


@router.get("/{application_id}/comentarios", response_model=list[CommentResponse])
async def list_comments(
    application_id: uuid.UUID,
    db: Annotated[AsyncSession, Depends(get_db)] = None,
    _: Annotated[str, Depends(get_current_user)] = None,
) -> list[CommentResponse]:
    service = CommentService(db)
    return await service.list_comments(application_id)


@router.post(
    "/{application_id}/comentarios",
    response_model=CommentResponse,
    status_code=http_status.HTTP_201_CREATED,
)
async def add_comment(
    application_id: uuid.UUID,
    data: CommentCreate,
    db: Annotated[AsyncSession, Depends(get_db)] = None,
    current_user: Annotated[str, Depends(get_current_user)] = None,
) -> CommentResponse:
    service = CommentService(db)
    return await service.add_comment(application_id, data, current_user)


@router.delete("/{application_id}/comentarios/{comment_id}", status_code=http_status.HTTP_204_NO_CONTENT)
async def delete_comment(
    application_id: uuid.UUID,
    comment_id: int,
    db: Annotated[AsyncSession, Depends(get_db)] = None,
    _: Annotated[str, Depends(get_current_user)] = None,
) -> None:
    service = CommentService(db)
    await service.delete_comment(comment_id)
