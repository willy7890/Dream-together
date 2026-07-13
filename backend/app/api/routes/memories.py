import shutil
import uuid
from pathlib import Path

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.permissions import require_couple
from app.database.session import get_db
from app.models.memory import Memory
from app.models.user import User
from app.schemas.memory import MemoryCreate, MemoryRead
from app.services import memory_service

router = APIRouter(prefix="/memories", tags=["memories"])

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp", ".mp4", ".mov", ".mp3", ".wav", ".pdf"}


@router.post("/upload")
def upload_memory_file(
    file: UploadFile = File(...),
    current_user: User = Depends(require_couple),
):
    ext = Path(file.filename or "").suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"File type {ext or 'unknown'} is not allowed.")

    file.file.seek(0, 2)
    size_mb = file.file.tell() / (1024 * 1024)
    file.file.seek(0)
    if size_mb > settings.MAX_UPLOAD_MB:
        raise HTTPException(status_code=400, detail=f"File too large. Max {settings.MAX_UPLOAD_MB}MB.")

    couple_dir = Path(settings.UPLOAD_DIR) / str(current_user.couple_id)
    couple_dir.mkdir(parents=True, exist_ok=True)

    filename = f"{uuid.uuid4().hex}{ext}"
    dest = couple_dir / filename
    with dest.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    url = f"/uploads/{current_user.couple_id}/{filename}"
    return {"url": url, "filename": filename}


@router.get("", response_model=list[MemoryRead])
def list_memories(current_user: User = Depends(require_couple), db: Session = Depends(get_db)):
    return memory_service.list_memories(db, current_user.couple_id)


@router.post("", response_model=MemoryRead, status_code=201)
def create_memory(payload: MemoryCreate, current_user: User = Depends(require_couple), db: Session = Depends(get_db)):
    return memory_service.create_memory(db, current_user.couple_id, payload)


@router.delete("/{memory_id}", status_code=204)
def delete_memory(memory_id: int, current_user: User = Depends(require_couple), db: Session = Depends(get_db)):
    memory = db.get(Memory, memory_id)
    if not memory or memory.couple_id != current_user.couple_id:
        raise HTTPException(status_code=404, detail="Memory not found")
    memory_service.delete_memory(db, memory)
