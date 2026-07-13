from sqlalchemy.orm import Session

from app.models.couple import Couple
from app.models.goal import Goal
from app.schemas.goal import GoalCreate, GoalUpdate
from app.services.notification_service import push_notification


def list_goals(db: Session, couple_id: int) -> list[Goal]:
    return db.query(Goal).filter(Goal.couple_id == couple_id).order_by(Goal.id.desc()).all()


def create_goal(db: Session, couple_id: int, payload: GoalCreate) -> Goal:
    goal = Goal(couple_id=couple_id, **payload.model_dump())
    db.add(goal)
    db.commit()
    db.refresh(goal)
    return goal


def update_goal(db: Session, goal: Goal, payload: GoalUpdate) -> Goal:
    data = payload.model_dump(exclude_unset=True)
    was_active = goal.status != "completed"
    for field, value in data.items():
        setattr(goal, field, value)

    just_completed = False
    if goal.current_amount >= goal.target_amount and goal.target_amount > 0 and was_active:
        goal.status = "completed"
        just_completed = True

    db.commit()
    db.refresh(goal)

    if just_completed:
        couple = db.get(Couple, goal.couple_id)
        if couple:
            for user_id in (couple.user_one_id, couple.user_two_id):
                if user_id:
                    push_notification(
                        db,
                        user_id=user_id,
                        title=f"🎉 Lengo limekamilika: {goal.title}",
                        body="Hongera! Mmefikia lengo lenu pamoja.",
                    )

    return goal


def delete_goal(db: Session, goal: Goal) -> None:
    db.delete(goal)
    db.commit()
