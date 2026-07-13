from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class Transaction(Base):
    __tablename__ = "transactions"

    id: Mapped[int] = mapped_column(primary_key=True)
    couple_id: Mapped[int] = mapped_column(ForeignKey("couples.id"), index=True)
    type: Mapped[str] = mapped_column(String(10))  # income | expense
    amount: Mapped[float] = mapped_column()
    category: Mapped[str | None] = mapped_column(String(50), nullable=True)
    note: Mapped[str | None] = mapped_column(String(300), nullable=True)
    date: Mapped[str] = mapped_column(String(20))
