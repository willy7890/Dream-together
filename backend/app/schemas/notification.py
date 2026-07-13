from pydantic import BaseModel


class NotificationRead(BaseModel):
    id: int
    title: str
    body: str | None
    read: bool
    created_at: str

    class Config:
        from_attributes = True
