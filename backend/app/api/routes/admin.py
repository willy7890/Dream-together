from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.permissions import get_current_user
from app.database.session import get_db
from app.models.couple import Couple
from app.models.goal import Goal
from app.models.memory import Memory
from app.models.user import User
from app.schemas.admin import AdminStats, AdminUserRead, AdminUserUpdate
from app.services import admin_service

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