from fastapi import APIRouter

from app.services.ai_service import weekly_summary

router = APIRouter(prefix="/ai", tags=["ai"])


@router.get("/weekly-summary")
def get_weekly_summary():
    return {"summary": weekly_summary(couple_id=0)}
