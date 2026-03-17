from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


# Importar todos los modelos aqui para que Alembic los detecte en autogenerate
# from backend.modules.usuarios.models import Usuario
# from backend.modules.areas.models import Area
# from backend.modules.convocatorias.models import Convocatoria
# from backend.modules.candidatos.models import Candidato
# from backend.modules.aplicaciones.models import Aplicacion
