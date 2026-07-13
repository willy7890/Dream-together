from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class Subscription(Base):
    __tablename__ = "subscriptions"

    id: Mapped[int] = mapped_column(primary_key=True)
    couple_id: Mapped[int] = mapped_column(ForeignKey("couples.id"), unique=True)
    plan: Mapped[str] = mapped_column(String(20), default="free")  # free | premium
    started_at: Mapped[str | None] = mapped_column(String(30), nullable=True)
    expires_at: Mapped[str | None] = mapped_column(String(30), nullable=True)
