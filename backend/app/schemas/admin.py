from pydantic import BaseModel


class AdminStats(BaseModel):
    total_users: int
    total_couples: int
    total_goals: int
    total_memories: int
