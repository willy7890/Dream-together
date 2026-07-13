from fastapi import APIRouter

router = APIRouter(prefix="/documents", tags=["documents"])


@router.get("")
def not_implemented():
    return {"status": "coming_soon", "feature": "Secure document storage requires S3/object-storage wiring."}
