from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.permissions import get_current_user
from app.database.session import get_db
from app.models.user import User
from app.schemas.report import ReportCreate, ReportRead
from app.services import report_service

router = APIRouter(prefix="/reports", tags=["reports"])


@router.post("", response_model=ReportRead, status_code=201)
def report_content(payload: ReportCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return report_service.create_report(db, current_user.id, payload)