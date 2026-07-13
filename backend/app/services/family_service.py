from sqlalchemy.orm import Session

from app.models.family_member import FamilyMember
from app.schemas.family_member import FamilyMemberCreate


def list_members(db: Session, couple_id: int) -> list[FamilyMember]:
    return db.query(FamilyMember).filter(FamilyMember.couple_id == couple_id).order_by(FamilyMember.id).all()


def add_member(db: Session, couple_id: int, payload: FamilyMemberCreate) -> FamilyMember:
    member = FamilyMember(couple_id=couple_id, **payload.model_dump())
    db.add(member)
    db.commit()
    db.refresh(member)
    return member


def delete_member(db: Session, member: FamilyMember) -> None:
    db.delete(member)
    db.commit()
