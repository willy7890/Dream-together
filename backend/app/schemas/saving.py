from pydantic import BaseModel


class TransactionCreate(BaseModel):
    type: str
    amount: float
    category: str | None = None
    note: str | None = None
    date: str


class TransactionRead(TransactionCreate):
    id: int

    class Config:
        from_attributes = True
