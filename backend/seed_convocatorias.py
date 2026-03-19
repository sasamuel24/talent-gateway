"""
Script de seed — inserta 5 convocatorias reales de Cafe Quindio con sus requisitos.
Uso: py seed_convocatorias.py
"""
import uuid
from datetime import date

from sqlalchemy import create_engine, text
from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)

# ---------------------------------------------------------------------------
# Datos de convocatorias
# ---------------------------------------------------------------------------

CONVOCATORIAS = [
    {
        "ref_id": "REQ-2026-001",
        "title": "Barista Lider - Tienda Parque del Cafe",
        "area": "Tiendas",
        "location": "Armenia, Quindio",
        "type": "Termino Indefinido",
        "status": "activa",
        "description": (
            "Buscamos un Barista Lider apasionado por el cafe colombiano para nuestra tienda "
            "insignia en el Parque del Cafe. Seras el embajador de la cultura cafetera de Cafe "
            "Quindio, liderando el equipo de baristas y garantizando la excelencia en cada taza."
        ),
        "ai_prompt": (
            "Prioriza candidatos con minimo 2 anos de experiencia en barismo o atencion al cliente "
            "en cafeterias de especialidad. El dominio de tecnicas de extraccion (espresso, V60, Chemex) "
            "es muy valorado. Descarta candidatos sin disponibilidad para turnos rotativos. Valora "
            "certificaciones en barismo y experiencia liderando equipos."
        ),
        "requirements": [
            {"type": "requisito", "content": "Minimo 2 anos de experiencia en barismo", "order": 1},
            {"type": "requisito", "content": "Conocimiento de tecnicas de extraccion (espresso, V60, Chemex)", "order": 2},
            {"type": "requisito", "content": "Disponibilidad para turnos rotativos", "order": 3},
            {"type": "requisito", "content": "Habilidades de liderazgo y trabajo en equipo", "order": 4},
            {"type": "requisito", "content": "Bachiller o tecnico en areas afines", "order": 5},
            {"type": "funcion", "content": "Preparar bebidas de cafe de especialidad siguiendo los estandares CQ", "order": 1},
            {"type": "funcion", "content": "Liderar y capacitar al equipo de baristas", "order": 2},
            {"type": "funcion", "content": "Garantizar la limpieza y mantenimiento del equipo", "order": 3},
            {"type": "funcion", "content": "Atender y fidelizar clientes", "order": 4},
        ],
    },
    {
        "ref_id": "REQ-2026-002",
        "title": "Supervisor de Produccion - Planta Montenegro",
        "area": "Produccion",
        "location": "Montenegro, Quindio",
        "type": "Termino Indefinido",
        "status": "activa",
        "description": (
            "Buscamos un Supervisor de Produccion para nuestra planta de procesamiento en Montenegro. "
            "Seras responsable de coordinar el proceso de tostion, empaque y control de calidad del cafe, "
            "asegurando el cumplimiento de las normas BPM y HACCP."
        ),
        "ai_prompt": (
            "Candidato ideal con formacion en ingenieria de alimentos, industrial o afines. Minimo 3 anos "
            "en plantas de produccion de alimentos con manejo de BPM y HACCP. Valorar certificaciones en "
            "calidad (ISO, HACCP). Descarta perfiles sin experiencia en industria alimentaria."
        ),
        "requirements": [
            {"type": "requisito", "content": "Ingeniero de Alimentos, Industrial o afines", "order": 1},
            {"type": "requisito", "content": "Minimo 3 anos en plantas de produccion", "order": 2},
            {"type": "requisito", "content": "Conocimiento de BPM y HACCP", "order": 3},
            {"type": "requisito", "content": "Manejo de indicadores de produccion", "order": 4},
            {"type": "requisito", "content": "Licencia de conduccion vigente (deseable)", "order": 5},
        ],
    },
    {
        "ref_id": "REQ-2026-003",
        "title": "Coordinador de Marketing Digital",
        "area": "Marketing",
        "location": "Bogota D.C.",
        "type": "Termino Fijo",
        "status": "activa",
        "description": (
            "Buscamos un Coordinador de Marketing Digital para gestionar la presencia digital de Cafe "
            "Quindio en Colombia e internacional. Crearas y ejecutaras estrategias de contenido que "
            "refuercen nuestra identidad como embajadores del cafe colombiano de origen."
        ),
        "ai_prompt": (
            "Busca comunicadores o publicistas con portafolio activo en redes sociales. Experiencia "
            "comprobable con Meta Business Suite y/o Google Analytics es excluyente. Valora conocimiento "
            "de tendencias en cafe y gastronomia."
        ),
        "requirements": [
            {"type": "requisito", "content": "Profesional en Comunicacion, Publicidad o Marketing", "order": 1},
            {"type": "requisito", "content": "Minimo 2 anos en marketing digital", "order": 2},
            {"type": "requisito", "content": "Dominio de Meta Business Suite y Google Analytics", "order": 3},
            {"type": "requisito", "content": "Portafolio digital demostrable", "order": 4},
            {"type": "requisito", "content": "Ingles intermedio (deseable)", "order": 5},
        ],
    },
    {
        "ref_id": "REQ-2026-004",
        "title": "Auxiliar de Logistica y Distribucion",
        "area": "Logistica",
        "location": "Cali, Valle del Cauca",
        "type": "Termino Fijo",
        "status": "activa",
        "description": (
            "Apoya la operacion logistica de distribucion de productos Cafe Quindio en la zona "
            "suroccidental del pais, coordinando rutas de entrega y gestion de inventarios en bodega."
        ),
        "ai_prompt": (
            "Perfil logistico con experiencia en coordinacion de rutas y distribucion urbana. Licencia "
            "de conduccion vigente es requisito excluyente. Valorar manejo de WMS o sistemas de gestion "
            "de inventario."
        ),
        "requirements": [
            {"type": "requisito", "content": "Tecnico o tecnologo en Logistica o afines", "order": 1},
            {"type": "requisito", "content": "Licencia de conduccion B1 vigente", "order": 2},
            {"type": "requisito", "content": "Experiencia minima 1 ano en distribucion", "order": 3},
            {"type": "requisito", "content": "Manejo de Excel basico", "order": 4},
            {"type": "requisito", "content": "Disponibilidad para viajes en la region", "order": 5},
        ],
    },
    {
        "ref_id": "REQ-2026-005",
        "title": "Practicante RRHH - Seleccion y Bienestar",
        "area": "Recursos Humanos",
        "location": "Armenia, Quindio",
        "type": "Practicante",
        "status": "borrador",
        "description": (
            "Practica profesional en el area de Talento Humano de Cafe Quindio. Apoyaras los procesos "
            "de seleccion, induccion y bienestar laboral, ganando experiencia real en una empresa lider "
            "del sector cafetero colombiano."
        ),
        "ai_prompt": (
            "Practicante de ultimo semestre en Psicologia, Administracion o RR.HH. Es obligatorio contar "
            "con aval universitario disponible. Valorar conocimiento basico de seleccion por competencias."
        ),
        "requirements": [
            {"type": "requisito", "content": "Estudiante de ultimo semestre en Psicologia, Administracion o RR.HH.", "order": 1},
            {"type": "requisito", "content": "Aval universitario para practica disponible", "order": 2},
            {"type": "requisito", "content": "Conocimiento basico en seleccion de personal", "order": 3},
            {"type": "requisito", "content": "Manejo de Office (Word, Excel)", "order": 4},
            {"type": "requisito", "content": "Disponibilidad inmediata", "order": 5},
        ],
    },
]


def main():
    with engine.connect() as conn:
        # Verificar si ya existen convocatorias
        existing = conn.execute(text("SELECT COUNT(*) FROM jobs")).scalar()
        if existing and existing > 0:
            print(f"[WARN] Ya existen {existing} convocatorias en la BD. No se insertaron duplicados.")
            return

        # Obtener el usuario admin
        admin = conn.execute(
            text("SELECT id FROM users WHERE email = :email"),
            {"email": "pruebas@cafequindio.com"}
        ).fetchone()

        if admin is None:
            print("[ERROR] No se encontro el usuario admin (pruebas@cafequindio.com).")
            print("        Ejecuta primero: py seed_admin.py")
            return

        admin_id = admin[0]
        today = date.today().isoformat()

        inserted_jobs = 0
        inserted_reqs = 0

        for conv in CONVOCATORIAS:
            job_id = str(uuid.uuid4())

            conn.execute(
                text("""
                    INSERT INTO jobs (id, title, area, location, type, status, ref_id,
                                     description, ai_prompt, date_posted, created_by, views)
                    VALUES (:id, :title, :area, :location, :type, :status, :ref_id,
                            :description, :ai_prompt, :date_posted, :created_by, 0)
                """),
                {
                    "id": job_id,
                    "title": conv["title"],
                    "area": conv["area"],
                    "location": conv["location"],
                    "type": conv["type"],
                    "status": conv["status"],
                    "ref_id": conv["ref_id"],
                    "description": conv["description"],
                    "ai_prompt": conv["ai_prompt"],
                    "date_posted": today,
                    "created_by": admin_id,
                }
            )
            inserted_jobs += 1

            for req in conv["requirements"]:
                conn.execute(
                    text("""
                        INSERT INTO job_requirements (job_id, type, content, "order")
                        VALUES (:job_id, :type, :content, :order)
                    """),
                    {
                        "job_id": job_id,
                        "type": req["type"],
                        "content": req["content"],
                        "order": req["order"],
                    }
                )
                inserted_reqs += 1

        conn.commit()
        print(f"[OK] Seed completado exitosamente.")
        print(f"     Convocatorias insertadas: {inserted_jobs}")
        print(f"     Requisitos insertados:    {inserted_reqs}")
        for conv in CONVOCATORIAS:
            status_icon = "[ACTIVA ]" if conv["status"] == "activa" else "[BORRADOR]"
            print(f"     {status_icon} {conv['ref_id']} — {conv['title']}")


if __name__ == "__main__":
    main()
