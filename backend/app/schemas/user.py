from pydantic import BaseModel


class UserRead(BaseModel):
    id: int
    full_name: str
    email: str
    language: str
    theme: str
    avatar_color: str
    couple_id: int | None
    is_verified: bool
    is_admin: bool

    class Config:
        from_attributes = True


class UserUpdate(BaseModel):
    full_name: str | None = None
    language: str | None = None
    theme: str | None = None
