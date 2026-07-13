from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.permissions import require_couple
from app.database.session import get_db
from app.models.couple import Couple
from app.models.user import User
from app.services import analytics_service

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/dashboard")
def dashboard(current_user: User = Depends(require_couple), db: Session = Depends(get_db)):
    couple = db.get(Couple, current_user.couple_id)
    return analytics_service.dashboard_stats(db, current_user.couple_id, couple.anniversary_date if couple else None)
