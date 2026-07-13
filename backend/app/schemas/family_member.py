from pydantic import BaseModel


class FamilyMemberCreate(BaseModel):
    full_name: str
    relation: str = "child"
    age: int | None = None
    avatar_color: str = "#8B7FD6"


class FamilyMemberRead(FamilyMemberCreate):
    id: int

    class Config:
        from_attributes = True
