from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class MoodEntry(Base):
    __tablename__ = "mood_entries"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    couple_id: Mapped[int] = mapped_column(ForeignKey("couples.id"), index=True)
    mood: Mapped[str] = mapped_column(String(20))
    date: Mapped[str] = mapped_column(String(20))
