from sqlalchemy.orm import Session

from app.models.memory import Memory
from app.schemas.memory import MemoryCreate


def list_memories(db: Session, couple_id: int) -> list[Memory]:
    return db.query(Memory).filter(Memory.couple_id == couple_id).order_by(Memory.id.desc()).all()


def create_memory(db: Session, couple_id: int, payload: MemoryCreate) -> Memory:
    memory = Memory(couple_id=couple_id, **payload.model_dump())
    db.add(memory)
    db.commit()
    db.refresh(memory)
    return memory


def delete_memory(db: Session, memory: Memory) -> None:
    db.delete(memory)
    db.commit()
