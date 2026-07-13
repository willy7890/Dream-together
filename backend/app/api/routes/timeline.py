from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.permissions import require_couple
from app.database.session import get_db
from app.models.user import User
from app.schemas.timeline import TimelineCreate, TimelineRead
from app.services import timeline_service

router = APIRouter(prefix="/timeline", tags=["timeline"])


@router.get("", response_model=list[TimelineRead])
def list_events(current_user: User = Depends(require_couple), db: Session = Depends(get_db)):
    return timeline_service.list_events(db, current_user.couple_id)


@router.post("", response_model=TimelineRead, status_code=201)
def create_event(payload: TimelineCreate, current_user: User = Depends(require_couple), db: Session = Depends(get_db)):
    return timeline_service.create_event(db, current_user.couple_id, payload)
