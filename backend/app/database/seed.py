"""Optional dev-only seed script: python -m app.database.seed"""
from app.core.security import hash_password
from app.database.base import Base
from app.database.session import SessionLocal, engine
from app.models import (  # noqa: F401
    admin, couple, document, family_member, goal, invitation, journal,
    memory, message, mood, notification, report, saving, subscription, timeline, user,
)


def run():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    if db.query(user.User).count() == 0:
        u1 = user.User(full_name="Wilbard", email="wilbard@example.com", hashed_password=hash_password("password123"))
        u2 = user.User(full_name="Partner", email="partner@example.com", hashed_password=hash_password("password123"))
        db.add_all([u1, u2])
        db.commit()
        db.refresh(u1)
        db.refresh(u2)

        c = couple.Couple(user_one_id=u1.id, user_two_id=u2.id, anniversary_date="2024-02-14")
        db.add(c)
        db.commit()
        db.refresh(c)

        u1.couple_id = c.id
        u2.couple_id = c.id
        db.commit()
        print(f"Seeded couple #{c.id} with users {u1.email} / {u2.email} (password: password123)")
    db.close()


if __name__ == "__main__":
    run()
