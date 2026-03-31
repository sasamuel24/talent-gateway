"""
Prueba del servicio de email Microsoft Graph.
Ejecutar desde backend/:  py test_email.py
"""
import asyncio
import logging
import sys
import os

logging.basicConfig(level=logging.DEBUG, format="%(levelname)s  %(name)s: %(message)s")

# Asegura que el path del proyecto esté disponible
sys.path.insert(0, os.path.dirname(__file__))

from core.email import send_application_confirmation, _get_access_token


async def main():
    print("=" * 55)
    print("  TEST SERVICIO EMAIL — CQ Talent Portal")
    print("=" * 55)

    # 1. Verificar token Azure AD
    print("\n[1/2] Obteniendo token Azure AD...", end=" ", flush=True)
    try:
        token = _get_access_token()
        print(f"OK  (token: ...{token[-12:]})")
    except Exception as e:
        print(f"FALLO\n     {e}")
        sys.exit(1)

    # 2. Enviar email de prueba
    print("[2/2] Enviando correo de confirmación de prueba...", end=" ", flush=True)
    try:
        await send_application_confirmation(
            candidate_email="samuel.murillo.corte@gmail.com",           # ← destino de prueba
            candidate_name="Samuel Prueba",
            job_title="Software Engineer Backend — Credits Risk IT",
        )
        print("OK  (revisa la bandeja de entrada)")
    except Exception as e:
        print(f"FALLO\n     {e}")
        sys.exit(1)

    print("\n  Prueba completada exitosamente.")
    print("=" * 55)


if __name__ == "__main__":
    asyncio.run(main())
