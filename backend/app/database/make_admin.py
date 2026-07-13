"""
Usage: python -m app.database.make_admin someone@example.com

Admin status is intentionally NOT selectable during signup or from any public API
endpoint — if it were, anyone could register themselves as an admin. Promoting a
user to admin is an operational action, done here from the server/CLI directly
(or via direct DB access in production), same as most real systems.
"""
import sys

from app.database.session import SessionLocal
from app.models import (  # noqa: F401
    admin, couple, document, family_member, goal, invitation, journal,
    memory, message, mood, notification, report, saving, subscription, timeline, user,
)
from app.models.user import User


def make_admin(email: str) -> None:
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == email).first()
        if not user:
            print(f"No user found with email: {email}")
            return
        user.is_admin = True
        db.commit()
        print(f"{user.full_name} ({user.email}) is now an admin.")
    finally:
        db.close()


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python -m app.database.make_admin someone@example.com")
        sys.exit(1)
    make_admin(sys.argv[1])
