from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.permissions import require_couple
from app.database.session import get_db
from app.models.goal import Goal
from app.models.user import User
from app.schemas.goal import GoalCreate, GoalRead, GoalUpdate
from app.services import goal_service

router = APIRouter(prefix="/goals", tags=["goals"])


@router.get("", response_model=list[GoalRead])
def list_goals(current_user: User = Depends(require_couple), db: Session = Depends(get_db)):
    return goal_service.list_goals(db, current_user.couple_id)


@router.post("", response_model=GoalRead, status_code=201)
def create_goal(payload: GoalCreate, current_user: User = Depends(require_couple), db: Session = Depends(get_db)):
    return goal_service.create_goal(db, current_user.couple_id, payload)


@router.patch("/{goal_id}", response_model=GoalRead)
def update_goal(goal_id: int, payload: GoalUpdate, current_user: User = Depends(require_couple), db: Session = Depends(get_db)):
    goal = db.get(Goal, goal_id)
    if not goal or goal.couple_id != current_user.couple_id:
        raise HTTPException(status_code=404, detail="Goal not found")
    return goal_service.update_goal(db, goal, payload)


@router.delete("/{goal_id}", status_code=204)
def delete_goal(goal_id: int, current_user: User = Depends(require_couple), db: Session = Depends(get_db)):
    goal = db.get(Goal, goal_id)
    if not goal or goal.couple_id != current_user.couple_id:
        raise HTTPException(status_code=404, detail="Goal not found")
    goal_service.delete_goal(db, goal)
