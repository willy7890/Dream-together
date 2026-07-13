from sqlalchemy.orm import Session

from app.models.couple import Couple
from app.models.user import User


class CoupleError(Exception):
    pass


def send_invitation(db: Session, inviter: User, invitee_email: str) -> "Invitation":
    from datetime import datetime, timezone

    from app.models.invitation import Invitation

    inviter_couple = db.get(Couple, inviter.couple_id) if inviter.couple_id else None
    if inviter_couple and inviter_couple.user_two_id is not None:
        raise CoupleError("You are already connected with a partner.")
    if invitee_email == inviter.email:
        raise CoupleError("You can't invite yourself.")

    invitation = Invitation(
        inviter_id=inviter.id,
        invitee_email=invitee_email,
        status="pending",
        created_at=datetime.now(timezone.utc).isoformat(),
    )
    db.add(invitation)
    db.commit()
    db.refresh(invitation)
    return invitation


def accept_invitation(db: Session, invitation_id: int, accepting_user: User) -> Couple:
    from app.models.invitation import Invitation

    invitation = db.get(Invitation, invitation_id)
    if not invitation or invitation.status != "pending":
        raise CoupleError("Invitation not found or already handled.")
    if invitation.invitee_email != accepting_user.email:
        raise CoupleError("This invitation was not sent to you.")

    inviter = db.get(User, invitation.inviter_id)
    inviter_couple = db.get(Couple, inviter.couple_id) if inviter.couple_id else None
    if not inviter_couple:
        raise CoupleError("Inviter no longer has an active workspace.")
    if inviter_couple.user_two_id is not None:
        raise CoupleError("This person is already connected with a partner.")

    # Merge: accepting user joins the inviter's workspace instead of getting a new one.
    # Their old solo workspace is left in place (not deleted) so nothing they already
    # added while solo is at risk of being lost — it simply stops being their active one.
    inviter_couple.user_two_id = accepting_user.id
    inviter_couple.relationship_status = "dating"
    if inviter_couple.workspace_type != "family":
        inviter_couple.workspace_type = "couple"
    accepting_user.couple_id = inviter_couple.id
    invitation.status = "accepted"
    db.commit()
    db.refresh(inviter_couple)

    from app.services.notification_service import push_notification

    push_notification(db, user_id=inviter.id, title="💞 Mmeunganishwa!", body=f"{accepting_user.full_name} amekubali mwaliko wenu.")
    push_notification(db, user_id=accepting_user.id, title="💞 Mmeunganishwa!", body=f"Sasa mnashiriki workspace na {inviter.full_name}.")

    return inviter_couple


VALID_WORKSPACE_TYPES = {"solo", "couple", "family"}


def set_workspace_type(db: Session, couple: Couple, workspace_type: str) -> Couple:
    if workspace_type not in VALID_WORKSPACE_TYPES:
        raise CoupleError("Invalid workspace type.")
    couple.workspace_type = workspace_type
    db.commit()
    db.refresh(couple)
    return couple
