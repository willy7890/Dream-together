from pydantic import BaseModel


class JournalCreate(BaseModel):
    title: str | None = None
    mood: str | None = None
    text: str
    date: str


class JournalRead(JournalCreate):
    id: int
    author_id: int

    class Config:
        from_attributes = True
