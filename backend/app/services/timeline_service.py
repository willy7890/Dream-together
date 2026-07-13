from sqlalchemy.orm import Session

from app.models.timeline import TimelineEvent
from app.schemas.timeline import TimelineCreate


def list_events(db: Session, couple_id: int) -> list[TimelineEvent]:
    return db.query(TimelineEvent).filter(TimelineEvent.couple_id == couple_id).order_by(TimelineEvent.date).all()


def create_event(db: Session, couple_id: int, payload: TimelineCreate) -> TimelineEvent:
    event = TimelineEvent(couple_id=couple_id, **payload.model_dump())
    db.add(event)
    db.commit()
    db.refresh(event)
    return event
