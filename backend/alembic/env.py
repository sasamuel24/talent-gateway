import os
import sys
from logging.config import fileConfig

from alembic import context
from dotenv import load_dotenv
from sqlalchemy import engine_from_config, pool

# ---------------------------------------------------------------------------
# Asegurar que el directorio backend esté en sys.path
# ---------------------------------------------------------------------------
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Cargar variables de entorno desde .env
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env"))

# ---------------------------------------------------------------------------
# Importar Base y todos los modelos
# ---------------------------------------------------------------------------
from db.base import Base  # noqa: E402
import db.models  # noqa: F401 — registra todos los modelos en Base.metadata

# ---------------------------------------------------------------------------
# Alembic Config
# ---------------------------------------------------------------------------
config = context.config

# Leer DATABASE_URL desde el entorno y sobreescribir sqlalchemy.url
database_url = os.getenv(
    "DATABASE_URL",
    "postgresql://user:password@localhost:5432/talent_gateway",
)
# Alembic necesita driver síncrono; reemplazar asyncpg si está presente
database_url = database_url.replace("postgresql+asyncpg://", "postgresql://")
database_url = database_url.replace("postgresql+psycopg2://", "postgresql://")
config.set_main_option("sqlalchemy.url", database_url)

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata


# ---------------------------------------------------------------------------
# Funciones de migración
# ---------------------------------------------------------------------------

def run_migrations_offline() -> None:
    """Ejecutar migraciones en modo 'offline' (sin conexión real a DB)."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        compare_type=True,
    )
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Ejecutar migraciones en modo 'online' (con conexión real a DB)."""
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )
    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True,
        )
        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
