from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class FamilyMember(Base):
    __tablename__ = "family_members"

    id: Mapped[int] = mapped_column(primary_key=True)
    couple_id: Mapped[int] = mapped_column(ForeignKey("couples.id"), index=True)
    full_name: Mapped[str] = mapped_column(String(120))
    relation: Mapped[str] = mapped_column(String(20), default="child")  # child | parent | other
    age: Mapped[int | None] = mapped_column(Integer, nullable=True)
    avatar_color: Mapped[str] = mapped_column(String(10), default="#8B7FD6")
