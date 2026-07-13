from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.permissions import get_current_user
from app.database.session import get_db
from app.models.couple import Couple
from app.models.goal import Goal
from app.models.memory import Memory
from app.models.user import User
from app.schemas.admin import AdminStats

router = APIRouter(prefix="/admin", tags=["admin"])


def require_admin(current_user: User = Depends(get_current_user)) -> User:
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required.")
    return current_user


@router.get("/stats", response_model=AdminStats)
def stats(_: User = Depends(require_admin), db: Session = Depends(get_db)):
    return AdminStats(
        total_users=db.query(User).count(),
        total_couples=db.query(Couple).count(),
        total_goals=db.query(Goal).count(),
        total_memories=db.query(Memory).count(),
    )
