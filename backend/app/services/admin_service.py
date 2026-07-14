from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.admin import AdminUserUpdate


class AdminError(Exception):
    pass


def list_users(db: Session, search: str | None = None) -> list[User]:
    query = db.query(User)
    if search:
        like = f"%{search}%"
        query = query.filter((User.full_name.ilike(like)) | (User.email.ilike(like)))
    return query.order_by(User.id.desc()).all()


def update_user(db: Session, target: User, payload: AdminUserUpdate, acting_admin: User) -> User:
    data = payload.model_dump(exclude_unset=True)

    if "email" in data and data["email"] != target.email:
        existing = db.query(User).filter(User.email == data["email"]).first()
        if existing:
            raise AdminError("Another account already uses this email.")

    if "is_admin" in data and data["is_admin"] is False and target.id == acting_admin.id:
        raise AdminError("You can't remove your own admin access.")

    for field, value in data.items():
        setattr(target, field, value)
    db.commit()
    db.refresh(target)
    return target


def delete_user(db: Session, target: User, acting_admin: User) -> None:
    if target.id == acting_admin.id:
        raise AdminError("You can't delete your own account while logged in as it.")
    db.delete(target)
    db.commit()