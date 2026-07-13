from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    full_name: Mapped[str] = mapped_column(String(120))
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String(255))
    language: Mapped[str] = mapped_column(String(5), default="sw")
    theme: Mapped[str] = mapped_column(String(10), default="dark")
    avatar_color: Mapped[str] = mapped_column(String(10), default="#E8A33D")
    is_admin: Mapped[bool] = mapped_column(default=False)
    is_verified: Mapped[bool] = mapped_column(default=False)

    couple_id: Mapped[int | None] = mapped_column(ForeignKey("couples.id"), nullable=True)
    couple = relationship("Couple", back_populates="members", foreign_keys=[couple_id])
