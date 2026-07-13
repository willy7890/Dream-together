from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class TimelineEvent(Base):
    __tablename__ = "timeline_events"

    id: Mapped[int] = mapped_column(primary_key=True)
    couple_id: Mapped[int] = mapped_column(ForeignKey("couples.id"), index=True)
    label: Mapped[str] = mapped_column(String(150))
    description: Mapped[str | None] = mapped_column(String(1000), nullable=True)
    date: Mapped[str] = mapped_column(String(20))
