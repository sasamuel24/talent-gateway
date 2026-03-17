from pydantic import BaseModel


class ScoringRequest(BaseModel):
    aplicacion_id: int
    convocatoria_id: int
    candidato_id: int


class ScoringResponse(BaseModel):
    aplicacion_id: int
    puntaje: float
    fortalezas: list[str]
    brechas: list[str]
    resumen: str


class RankingRequest(BaseModel):
    convocatoria_id: int


class CandidatoRanking(BaseModel):
    candidato_id: int
    nombre: str
    puntaje: float
    posicion: int


class RankingResponse(BaseModel):
    convocatoria_id: int
    total_candidatos: int
    ranking: list[CandidatoRanking]
