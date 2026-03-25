from pydantic import BaseModel, ConfigDict, EmailStr

from modules.usuarios.schemas import UserResponse


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


# Alias de compatibilidad usado en el router existente
TokenResponse = LoginResponse


class TokenPayload(BaseModel):
    sub: str
