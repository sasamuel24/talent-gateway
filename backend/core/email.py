import logging

import httpx
import msal

from core.config import settings

logger = logging.getLogger(__name__)

_GRAPH_SCOPE = ["https://graph.microsoft.com/.default"]


def _send_mail_url() -> str:
    return f"https://graph.microsoft.com/v1.0/users/{settings.EMAIL_FROM}/sendMail"


def _get_access_token() -> str:
    app = msal.ConfidentialClientApplication(
        client_id=settings.AZURE_CLIENT_ID,
        client_credential=settings.AZURE_CLIENT_SECRET,
        authority=f"https://login.microsoftonline.com/{settings.AZURE_TENANT_ID}",
    )
    result = app.acquire_token_for_client(scopes=_GRAPH_SCOPE)
    if "access_token" not in result:
        raise RuntimeError(
            f"No se pudo obtener token Azure AD: {result.get('error_description')}"
        )
    return result["access_token"]


def _build_text(candidate_name: str, job_title: str) -> str:
    first_name = candidate_name.strip().split()[0].capitalize()
    return (
        f"Hola {first_name},\n\n"
        f"Hemos recibido tu solicitud para el puesto de {job_title}. "
        f"Actualmente la estamos revisando y nos pondremos en contacto contigo "
        f"nuevamente tan pronto haya una actualización.\n\n"
        f"Si tienes alguna pregunta, puedes responder a este correo y con gusto te orientaremos.\n\n"
        f"Cordialmente,\n"
        f"Equipo de Gestión Humana\n"
        f"Café Quindío"
    )


async def send_application_confirmation(
    candidate_email: str,
    candidate_name: str,
    job_title: str,
) -> None:
    """Envía un correo de confirmación al candidato vía Microsoft Graph."""
    try:
        token = _get_access_token()
    except Exception as exc:
        logger.error("Error obteniendo token Azure AD: %s", exc)
        return

    subject = f"Recibimos tu postulación — {job_title} | Café Quindío"
    text_body = _build_text(candidate_name, job_title)

    payload = {
        "message": {
            "subject": subject,
            "body": {"contentType": "Text", "content": text_body},
            "toRecipients": [{"emailAddress": {"address": candidate_email}}],
            "from": {"emailAddress": {"address": settings.EMAIL_FROM}},
        },
        "saveToSentItems": "false",
    }

    try:
        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.post(
                _send_mail_url(),
                json=payload,
                headers={
                    "Authorization": f"Bearer {token}",
                    "Content-Type": "application/json",
                },
            )
        if resp.status_code == 202:
            logger.info("Correo de confirmación enviado a %s", candidate_email)
        else:
            logger.error(
                "Fallo al enviar correo a %s — status %s: %s",
                candidate_email,
                resp.status_code,
                resp.text,
            )
    except Exception as exc:
        logger.error("Excepción enviando correo a %s: %r", candidate_email, exc)
