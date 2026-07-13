from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.permissions import get_current_user
from app.database.session import get_db
from app.models.user import User
from app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse
from app.schemas.user import UserRead
from app.services import auth_service

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserRead, status_code=201)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    try:
        return auth_service.register_user(db, payload)
    except auth_service.AuthError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    try:
        token = auth_service.authenticate_user(db, payload)
        return TokenResponse(access_token=token)
    except auth_service.AuthError as e:
        raise HTTPException(status_code=401, detail=str(e))


@router.get("/verify-email/{token}", response_model=UserRead)
def verify_email(token: str, db: Session = Depends(get_db)):
    try:
        return auth_service.verify_email(db, token)
    except auth_service.AuthError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/resend-verification")
def resend_verification(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        auth_service.resend_verification(db, current_user)
        return {"status": "sent"}
    except auth_service.AuthError as e:
        raise HTTPException(status_code=400, detail=str(e))
