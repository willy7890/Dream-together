from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.permissions import require_couple
from app.database.session import get_db
from app.models.user import User
from app.schemas.journal import JournalCreate, JournalRead
from app.services import journal_service

router = APIRouter(prefix="/journals", tags=["journal"])


@router.get("", response_model=list[JournalRead])
def list_entries(current_user: User = Depends(require_couple), db: Session = Depends(get_db)):
    return journal_service.list_entries(db, current_user.couple_id)


@router.post("", response_model=JournalRead, status_code=201)
def create_entry(payload: JournalCreate, current_user: User = Depends(require_couple), db: Session = Depends(get_db)):
    return journal_service.create_entry(db, current_user.couple_id, current_user.id, payload)
