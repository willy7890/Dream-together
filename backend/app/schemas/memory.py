from pydantic import BaseModel


class MemoryCreate(BaseModel):
    title: str
    description: str | None = None
    media_url: str | None = None
    media_type: str = "photo"
    date: str
    location: str | None = None
    tags: str | None = None


class MemoryRead(MemoryCreate):
    id: int

    class Config:
        from_attributes = True
