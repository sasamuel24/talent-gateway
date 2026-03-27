import uuid

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from modules.comentarios.repository import CommentRepository
from modules.comentarios.schemas import CommentCreate, CommentResponse
from modules.usuarios.repository import UserRepository


class CommentService:
    def __init__(self, db: AsyncSession):
        self.repo = CommentRepository(db)
        self.users = UserRepository(db)

    async def list_comments(self, application_id: uuid.UUID) -> list[CommentResponse]:
        comments = await self.repo.get_by_application(application_id)
        return [CommentResponse.model_validate(c) for c in comments]

    async def add_comment(
        self,
        application_id: uuid.UUID,
        data: CommentCreate,
        current_user_id: str,
    ) -> CommentResponse:
        user = await self.users.get_by_id(uuid.UUID(current_user_id))
        user_name = user.name if user else "Reclutador"
        comment = await self.repo.create({
            "application_id": application_id,
            "user_id": uuid.UUID(current_user_id) if current_user_id else None,
            "user_name": user_name,
            "body": data.body,
        })
        return CommentResponse.model_validate(comment)

    async def delete_comment(self, comment_id: int) -> None:
        deleted = await self.repo.delete(comment_id)
        if not deleted:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Comentario no encontrado")
