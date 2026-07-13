from pydantic import BaseModel, EmailStr


class InviteRequest(BaseModel):
    invitee_email: EmailStr


class CoupleRead(BaseModel):
    id: int
    user_one_id: int
    user_two_id: int | None
    anniversary_date: str | None
    relationship_status: str
    workspace_type: str | None

    class Config:
        from_attributes = True


class WorkspaceTypeUpdate(BaseModel):
    workspace_type: str  # "solo" | "couple" | "family"
