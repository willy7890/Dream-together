from pydantic import BaseModel


class ReportCreate(BaseModel):
    target_type: str  # "memory" | "journal" | "message" | "user"
    target_id: int
    reason: str


class ReportRead(BaseModel):
    id: int
    reporter_id: int
    target_type: str
    target_id: int
    reason: str
    status: str
    created_at: str

    class Config:
        from_attributes = True