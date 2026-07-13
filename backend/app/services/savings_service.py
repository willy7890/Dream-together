from sqlalchemy.orm import Session

from app.models.saving import Transaction
from app.schemas.saving import TransactionCreate


def list_transactions(db: Session, couple_id: int) -> list[Transaction]:
    return db.query(Transaction).filter(Transaction.couple_id == couple_id).order_by(Transaction.id.desc()).all()


def create_transaction(db: Session, couple_id: int, payload: TransactionCreate) -> Transaction:
    tx = Transaction(couple_id=couple_id, **payload.model_dump())
    db.add(tx)
    db.commit()
    db.refresh(tx)
    return tx


def summary(db: Session, couple_id: int) -> dict:
    txs = list_transactions(db, couple_id)
    income = sum(t.amount for t in txs if t.type == "income")
    expenses = sum(t.amount for t in txs if t.type == "expense")
    return {"income": income, "expenses": expenses, "balance": income - expenses}
