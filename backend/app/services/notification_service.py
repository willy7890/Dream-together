from datetime import datetime, timezone

from sqlalchemy.orm import Session

from app.models.notification import Notification


def list_notifications(db: Session, user_id: int) -> list[Notification]:
    return db.query(Notification).filter(Notification.user_id == user_id).order_by(Notification.id.desc()).all()


def push_notification(db: Session, user_id: int, title: str, body: str = "") -> Notification:
    n = Notification(user_id=user_id, title=title, body=body, created_at=datetime.now(timezone.utc).isoformat())
    db.add(n)
    db.commit()
    db.refresh(n)
    return n


def mark_read(db: Session, notification: Notification) -> Notification:
    notification.read = True
    db.commit()
    db.refresh(notification)
    return notification
