from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.permissions import require_couple
from app.database.session import get_db
from app.models.family_member import FamilyMember
from app.models.user import User
from app.schemas.family_member import FamilyMemberCreate, FamilyMemberRead
from app.services import family_service

router = APIRouter(prefix="/family", tags=["family"])


@router.get("/members", response_model=list[FamilyMemberRead])
def list_members(current_user: User = Depends(require_couple), db: Session = Depends(get_db)):
    return family_service.list_members(db, current_user.couple_id)


@router.post("/members", response_model=FamilyMemberRead, status_code=201)
def add_member(payload: FamilyMemberCreate, current_user: User = Depends(require_couple), db: Session = Depends(get_db)):
    return family_service.add_member(db, current_user.couple_id, payload)


@router.delete("/members/{member_id}", status_code=204)
def delete_member(member_id: int, current_user: User = Depends(require_couple), db: Session = Depends(get_db)):
    member = db.get(FamilyMember, member_id)
    if not member or member.couple_id != current_user.couple_id:
        raise HTTPException(status_code=404, detail="Family member not found")
    family_service.delete_member(db, member)
