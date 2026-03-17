from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.modules.auth.router import router as auth_router
from backend.modules.convocatorias.router import router as convocatorias_router
from backend.modules.candidatos.router import router as candidatos_router
from backend.modules.aplicaciones.router import router as aplicaciones_router
from backend.modules.areas.router import router as areas_router
from backend.modules.dashboard.router import router as dashboard_router
from backend.modules.ia.router import router as ia_router
from backend.modules.usuarios.router import router as usuarios_router

app = FastAPI(
    title="CQ Talent Gateway API",
    description="API backend para el portal de seleccion de Cafe Quindio",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(convocatorias_router)
app.include_router(candidatos_router)
app.include_router(aplicaciones_router)
app.include_router(areas_router)
app.include_router(dashboard_router)
app.include_router(ia_router)
app.include_router(usuarios_router)


@app.get("/", tags=["health"])
async def health_check():
    return {"status": "ok", "service": "CQ Talent Gateway API"}
