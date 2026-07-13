from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.permissions import require_couple
from app.database.session import get_db
from app.models.user import User
from app.schemas.mood import MoodCreate, MoodRead
from app.services import mood_service

router = APIRouter(prefix="/mood", tags=["mood"])


@router.get("/history", response_model=list[MoodRead])
def get_history(current_user: User = Depends(require_couple), db: Session = Depends(get_db)):
    return mood_service.history(db, current_user.couple_id)


@router.post("", response_model=MoodRead, status_code=201)
def log_mood(payload: MoodCreate, current_user: User = Depends(require_couple), db: Session = Depends(get_db)):
    return mood_service.log_mood(db, current_user.id, current_user.couple_id, payload)
