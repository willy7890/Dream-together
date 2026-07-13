from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.email import send_email
from app.core.security import (
    create_access_token,
    create_verification_token,
    decode_verification_token,
    hash_password,
    verify_password,
)
from app.models.couple import Couple
from app.models.user import User
from app.schemas.auth import LoginRequest, RegisterRequest


class AuthError(Exception):
    pass


def _send_verification_email(user: User) -> None:
    token = create_verification_token(user.id)
    link = f"{settings.FRONTEND_URL}/verify-email/{token}"
    send_email(
        to=user.email,
        subject="Thibitisha akaunti yako — Dream Together",
        body=(
            f"Habari {user.full_name},\n\n"
            f"Bofya kiungo hiki kuthibitisha barua pepe yako (kinaisha muda baada ya saa 24):\n{link}\n\n"
            "Kama hukuomba akaunti hii, puuza ujumbe huu."
        ),
    )


def register_user(db: Session, payload: RegisterRequest) -> User:
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise AuthError("An account with this email already exists.")
    user = User(
        full_name=payload.full_name,
        email=payload.email,
        hashed_password=hash_password(payload.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Every user gets their own workspace immediately — no need to wait for a partner.
    # Inviting/accepting a partner later upgrades this solo couple into a shared one.
    solo_couple = Couple(user_one_id=user.id, user_two_id=None, relationship_status="solo")
    db.add(solo_couple)
    db.commit()
    db.refresh(solo_couple)

    user.couple_id = solo_couple.id
    db.commit()
    db.refresh(user)

    _send_verification_email(user)
    return user


def authenticate_user(db: Session, payload: LoginRequest) -> str:
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise AuthError("Incorrect email or password.")
    return create_access_token(subject=str(user.id))


def verify_email(db: Session, token: str) -> User:
    user_id = decode_verification_token(token)
    if user_id is None:
        raise AuthError("This verification link is invalid or has expired.")
    user = db.get(User, user_id)
    if not user:
        raise AuthError("Account not found.")
    user.is_verified = True
    db.commit()
    db.refresh(user)
    return user


def resend_verification(db: Session, user: User) -> None:
    if user.is_verified:
        raise AuthError("This account is already verified.")
    _send_verification_email(user)
