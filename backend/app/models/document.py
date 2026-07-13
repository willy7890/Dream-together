from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class Document(Base):
    __tablename__ = "documents"

    id: Mapped[int] = mapped_column(primary_key=True)
    couple_id: Mapped[int] = mapped_column(ForeignKey("couples.id"), index=True)
    title: Mapped[str] = mapped_column(String(150))
    file_url: Mapped[str] = mapped_column(String(500))
    category: Mapped[str | None] = mapped_column(String(50), nullable=True)
    uploaded_at: Mapped[str] = mapped_column(String(30))
