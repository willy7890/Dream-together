from sqlalchemy.orm import Session

from app.models.journal import JournalEntry
from app.schemas.journal import JournalCreate


def list_entries(db: Session, couple_id: int) -> list[JournalEntry]:
    return db.query(JournalEntry).filter(JournalEntry.couple_id == couple_id).order_by(JournalEntry.id.desc()).all()


def create_entry(db: Session, couple_id: int, author_id: int, payload: JournalCreate) -> JournalEntry:
    entry = JournalEntry(couple_id=couple_id, author_id=author_id, **payload.model_dump())
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry
