from pydantic import BaseModel, EmailStr


class CandidateRegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    phone: str | None = None


class CandidateLoginRequest(BaseModel):
    email: EmailStr
    password: str


class CandidateLoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    candidate_id: str
    name: str
    email: str


class CandidateMeResponse(BaseModel):
    id: str
    name: str
    email: str
    phone: str | None
    location: str | None
