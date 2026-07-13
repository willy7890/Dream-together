from sqlalchemy.orm import Session

from app.models.goal import Goal
from app.models.journal import JournalEntry
from app.models.memory import Memory
from app.services import savings_service


def dashboard_stats(db: Session, couple_id: int, anniversary_date: str | None) -> dict:
    goals = db.query(Goal).filter(Goal.couple_id == couple_id).all()
    memories_count = db.query(Memory).filter(Memory.couple_id == couple_id).count()
    journal_count = db.query(JournalEntry).filter(JournalEntry.couple_id == couple_id).count()
    money = savings_service.summary(db, couple_id)

    return {
        "active_goals": len([g for g in goals if g.status == "active"]),
        "completed_goals": len([g for g in goals if g.status == "completed"]),
        "memories_count": memories_count,
        "journal_count": journal_count,
        "total_saved": money["balance"],
    }
