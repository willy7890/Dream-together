from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base


class Couple(Base):
    __tablename__ = "couples"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_one_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    user_two_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"), nullable=True)
    anniversary_date: Mapped[str | None] = mapped_column(String(20), nullable=True)
    relationship_status: Mapped[str] = mapped_column(String(30), default="dating")
    profile_photo_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    workspace_type: Mapped[str | None] = mapped_column(String(20), nullable=True)  # None=not chosen yet, then: solo | couple | family

    members = relationship("User", back_populates="couple", foreign_keys="User.couple_id")
