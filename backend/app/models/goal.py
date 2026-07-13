from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class Goal(Base):
    __tablename__ = "goals"

    id: Mapped[int] = mapped_column(primary_key=True)
    couple_id: Mapped[int] = mapped_column(ForeignKey("couples.id"), index=True)
    title: Mapped[str] = mapped_column(String(150))
    description: Mapped[str | None] = mapped_column(String(1000), nullable=True)
    category: Mapped[str] = mapped_column(String(30), default="other")
    priority: Mapped[str] = mapped_column(String(10), default="medium")
    target_amount: Mapped[float] = mapped_column(default=0)
    current_amount: Mapped[float] = mapped_column(default=0)
    deadline: Mapped[str | None] = mapped_column(String(20), nullable=True)
    status: Mapped[str] = mapped_column(String(20), default="active")
    deadline_reminder_sent: Mapped[bool] = mapped_column(default=False)
    assigned_member_id: Mapped[int | None] = mapped_column(ForeignKey("family_members.id"), nullable=True)

    @property
    def progress_pct(self) -> int:
        if not self.target_amount:
            return 0
        return min(100, round((self.current_amount / self.target_amount) * 100))
