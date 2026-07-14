from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.permissions import get_current_user
from app.database.session import get_db
from app.models.couple import Couple
from app.models.goal import Goal
from app.models.memory import Memory
from app.models.report import ContentReport
from app.models.user import User
from app.schemas.admin import AdminStats, AdminUserRead, AdminUserUpdate
from app.schemas.report import ReportRead
from app.services import admin_service, report_service

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


@router.get("/users", response_model=list[AdminUserRead])
def list_users(search: str | None = None, admin: User = Depends(require_admin), db: Session = Depends(get_db)):
    return admin_service.list_users(db, search)


@router.patch("/users/{user_id}", response_model=AdminUserRead)
def update_user(
    user_id: int, payload: AdminUserUpdate, admin: User = Depends(require_admin), db: Session = Depends(get_db)
):
    target = db.get(User, user_id)
    if not target:
        raise HTTPException(status_code=404, detail="User not found")
    try:
        return admin_service.update_user(db, target, payload, admin)
    except admin_service.AdminError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/users/{user_id}", status_code=204)
def delete_user(user_id: int, admin: User = Depends(require_admin), db: Session = Depends(get_db)):
    target = db.get(User, user_id)
    if not target:
        raise HTTPException(status_code=404, detail="User not found")
    try:
        admin_service.delete_user(db, target, admin)
    except admin_service.AdminError as e:
        raise HTTPException(status_code=400, detail=str(e))


# ---------------- Content moderation ----------------

@router.get("/reports", response_model=list[ReportRead])
def list_reports(status: str | None = None, admin: User = Depends(require_admin), db: Session = Depends(get_db)):
    return report_service.list_reports(db, status)


@router.post("/reports/{report_id}/resolve", response_model=ReportRead)
def resolve_report(report_id: int, admin: User = Depends(require_admin), db: Session = Depends(get_db)):
    report = db.get(ContentReport, report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return report_service.resolve_report(db, report, "resolved")


@router.post("/reports/{report_id}/dismiss", response_model=ReportRead)
def dismiss_report(report_id: int, admin: User = Depends(require_admin), db: Session = Depends(get_db)):
    report = db.get(ContentReport, report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return report_service.resolve_report(db, report, "dismissed")


@router.get("/memories")
def list_all_memories(admin: User = Depends(require_admin), db: Session = Depends(get_db)):
    """Admin-only: list every memory across all workspaces, for moderation."""
    memories = db.query(Memory).order_by(Memory.id.desc()).limit(200).all()
    return [
        {
            "id": m.id, "title": m.title, "media_url": m.media_url,
            "media_type": m.media_type, "date": m.date, "couple_id": m.couple_id,
        }
        for m in memories
    ]


@router.delete("/memories/{memory_id}", status_code=204)
def admin_delete_memory(memory_id: int, admin: User = Depends(require_admin), db: Session = Depends(get_db)):
    """Admin override: delete ANY memory regardless of which workspace owns it."""
    memory = db.get(Memory, memory_id)
    if not memory:
        raise HTTPException(status_code=404, detail="Memory not found")
    db.delete(memory)
    db.commit()