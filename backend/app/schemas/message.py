from pydantic import BaseModel


class MessageCreate(BaseModel):
    text: str | None = None
    image_url: str | None = None


class MessageRead(BaseModel):
    id: int
    sender_id: int
    text: str | None
    image_url: str | None
    created_at: str
    read: bool

    class Config:
        from_attributes = True
