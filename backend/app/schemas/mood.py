from pydantic import BaseModel


class MoodCreate(BaseModel):
    mood: str
    date: str


class MoodRead(MoodCreate):
    id: int
    user_id: int

    class Config:
        from_attributes = True
