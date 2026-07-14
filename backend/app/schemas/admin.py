from pydantic import BaseModel


class AdminStats(BaseModel):
    total_users: int
    total_couples: int
    total_goals: int
    total_memories: int


class AdminUserRead(BaseModel):
    id: int
    full_name: str
    email: str
    is_admin: bool
    is_verified: bool
    couple_id: int | None

    class Config:
        from_attributes = True


class AdminUserUpdate(BaseModel):
    full_name: str | None = None
    email: str | None = None
    is_admin: bool | None = None
    is_verified: bool | None = None