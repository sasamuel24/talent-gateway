import uuid

import boto3
from botocore.exceptions import BotoCoreError, ClientError
from fastapi import HTTPException, UploadFile, status

from core.config import settings

_s3_client = None


def get_s3_client():
    global _s3_client
    if _s3_client is None:
        _s3_client = boto3.client(
            "s3",
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_REGION,
        )
    return _s3_client


def get_bucket_name() -> str:
    if not settings.AWS_BUCKET_NAME:
        raise RuntimeError("AWS_BUCKET_NAME no está configurado")
    return settings.AWS_BUCKET_NAME


async def upload_candidate_pdf(candidate_id: uuid.UUID, file: UploadFile) -> str:
    """Sube el PDF del candidato a S3 y retorna la URL pública."""
    if file.content_type not in ("application/pdf",):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Solo se permiten archivos PDF",
        )

    key = f"candidatos/{candidate_id}/cv_{uuid.uuid4().hex}.pdf"
    bucket = get_bucket_name()

    try:
        content = await file.read()
        get_s3_client().put_object(
            Bucket=bucket,
            Key=key,
            Body=content,
            ContentType="application/pdf",
        )
    except (BotoCoreError, ClientError) as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Error al subir el archivo a S3: {exc}",
        ) from exc

    url = f"https://{bucket}.s3.{settings.AWS_REGION}.amazonaws.com/{key}"
    return url
