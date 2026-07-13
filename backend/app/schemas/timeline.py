from pydantic import BaseModel


class TimelineCreate(BaseModel):
    label: str
    description: str | None = None
    date: str


class TimelineRead(TimelineCreate):
    id: int

    class Config:
        from_attributes = True
