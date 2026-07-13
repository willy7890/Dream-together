from pydantic import BaseModel


class GoalCreate(BaseModel):
    title: str
    description: str | None = None
    category: str = "other"
    priority: str = "medium"
    target_amount: float = 0
    deadline: str | None = None
    assigned_member_id: int | None = None


class GoalUpdate(BaseModel):
    title: str | None = None
    current_amount: float | None = None
    status: str | None = None
    assigned_member_id: int | None = None


class GoalRead(BaseModel):
    id: int
    title: str
    description: str | None
    category: str
    priority: str
    target_amount: float
    current_amount: float
    deadline: str | None
    status: str
    progress_pct: int
    assigned_member_id: int | None

    class Config:
        from_attributes = True
