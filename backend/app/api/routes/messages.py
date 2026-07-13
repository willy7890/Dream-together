from fastapi import APIRouter

router = APIRouter(prefix="/messages", tags=["messages"])


@router.get("")
def not_implemented():
    return {"status": "coming_soon", "feature": "Private messaging requires a WebSocket server (see docs/architecture)."}
