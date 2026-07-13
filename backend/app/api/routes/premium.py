from fastapi import APIRouter

router = APIRouter(prefix="/premium", tags=["premium"])


@router.get("/status")
def status():
    return {"plan": "free", "status": "coming_soon"}
