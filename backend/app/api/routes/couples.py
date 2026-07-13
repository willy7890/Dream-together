from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.permissions import get_current_user
from app.database.session import get_db
from app.models.invitation import Invitation
from app.models.user import User
from app.schemas.couple import CoupleRead, InviteRequest, WorkspaceTypeUpdate
from app.services import couple_service

router = APIRouter(prefix="/couples", tags=["couples"])


@router.get("/me")
def my_couple(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    from app.models.couple import Couple

    couple = db.get(Couple, current_user.couple_id) if current_user.couple_id else None
    if not couple:
        return {"partnered": False, "workspace_type": None}
    return {
        "id": couple.id,
        "partnered": couple.user_two_id is not None,
        "relationship_status": couple.relationship_status,
        "anniversary_date": couple.anniversary_date,
        "workspace_type": couple.workspace_type,
    }


@router.patch("/workspace-type", response_model=CoupleRead)
def update_workspace_type(
    payload: WorkspaceTypeUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    from app.models.couple import Couple

    couple = db.get(Couple, current_user.couple_id) if current_user.couple_id else None
    if not couple:
        raise HTTPException(status_code=400, detail="No workspace found for this user.")
    try:
        return couple_service.set_workspace_type(db, couple, payload.workspace_type)
    except couple_service.CoupleError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/pending")
def pending_invitations(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    invites = (
        db.query(Invitation)
        .filter(Invitation.invitee_email == current_user.email, Invitation.status == "pending")
        .all()
    )
    result = []
    for i in invites:
        inviter = db.get(User, i.inviter_id)
        result.append({"id": i.id, "inviter_name": inviter.full_name if inviter else "Unknown", "invitee_email": i.invitee_email})
    return result


@router.post("/invite", status_code=201)
def invite(payload: InviteRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        invitation = couple_service.send_invitation(db, current_user, payload.invitee_email)
        return {"id": invitation.id, "status": invitation.status, "invitee_email": invitation.invitee_email}
    except couple_service.CoupleError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/accept/{invitation_id}", response_model=CoupleRead)
def accept(invitation_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        return couple_service.accept_invitation(db, invitation_id, current_user)
    except couple_service.CoupleError as e:
        raise HTTPException(status_code=400, detail=str(e))
