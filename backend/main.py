from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from modules.auth.router import router as auth_router
from modules.convocatorias.router import router as convocatorias_router
from modules.candidatos.router import router as candidatos_router
from modules.candidatos.public_router import public_router as candidatos_public_router
from modules.aplicaciones.router import router as aplicaciones_router
from modules.comentarios.router import router as comentarios_router
from modules.areas.router import router as areas_router
from modules.dashboard.router import router as dashboard_router
from modules.ia.router import router as ia_router
from modules.usuarios.router import router as usuarios_router
from modules.catalogs.router import (
    ciudades_router,
    tipos_cargo_router,
    areas_router as catalog_areas_router,
    tipos_contrato_router,
)

app = FastAPI(
    title="CQ Talent Gateway API",
    description="API backend para el portal de seleccion de Cafe Quindio",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(usuarios_router)
app.include_router(convocatorias_router)
app.include_router(candidatos_public_router)
app.include_router(candidatos_router)
app.include_router(aplicaciones_router)
app.include_router(comentarios_router)
app.include_router(areas_router)
app.include_router(dashboard_router)
app.include_router(ia_router)
app.include_router(ciudades_router)
app.include_router(tipos_cargo_router)
app.include_router(catalog_areas_router)
app.include_router(tipos_contrato_router)


@app.get("/", tags=["health"])
async def health_check():
    return {"status": "ok", "service": "CQ Talent Gateway API"}
