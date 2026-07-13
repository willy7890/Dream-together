from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.permissions import require_couple
from app.database.session import get_db
from app.models.user import User
from app.schemas.saving import TransactionCreate, TransactionRead
from app.services import savings_service

router = APIRouter(prefix="/savings", tags=["savings"])


@router.get("/transactions", response_model=list[TransactionRead])
def list_transactions(current_user: User = Depends(require_couple), db: Session = Depends(get_db)):
    return savings_service.list_transactions(db, current_user.couple_id)


@router.post("/transactions", response_model=TransactionRead, status_code=201)
def create_transaction(payload: TransactionCreate, current_user: User = Depends(require_couple), db: Session = Depends(get_db)):
    return savings_service.create_transaction(db, current_user.couple_id, payload)


@router.get("/summary")
def get_summary(current_user: User = Depends(require_couple), db: Session = Depends(get_db)):
    return savings_service.summary(db, current_user.couple_id)
