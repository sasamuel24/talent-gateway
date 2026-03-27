from pydantic import BaseModel, ConfigDict, Field


class CatalogItemCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100, strip_whitespace=True)


class CatalogItemUpdate(BaseModel):
    name: str | None = Field(default=None, max_length=100, strip_whitespace=True)
    is_active: bool | None = None


class CatalogItemResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    is_active: bool
