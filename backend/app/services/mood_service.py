from sqlalchemy.orm import Session

from app.models.mood import MoodEntry
from app.schemas.mood import MoodCreate


def log_mood(db: Session, user_id: int, couple_id: int, payload: MoodCreate) -> MoodEntry:
    entry = MoodEntry(user_id=user_id, couple_id=couple_id, **payload.model_dump())
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry


def history(db: Session, couple_id: int, limit: int = 14) -> list[MoodEntry]:
    return (
        db.query(MoodEntry)
        .filter(MoodEntry.couple_id == couple_id)
        .order_by(MoodEntry.id.desc())
        .limit(limit)
        .all()
    )
