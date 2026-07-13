import logging
from datetime import date, datetime, timedelta

from apscheduler.schedulers.background import BackgroundScheduler

from app.database.session import SessionLocal
from app.models.couple import Couple
from app.models.goal import Goal
from app.models.user import User
from app.services.notification_service import push_notification

logger = logging.getLogger("dreamtogether.scheduler")


def check_goal_deadlines() -> None:
    """Runs daily: notifies both partners when a goal's deadline is within 3 days."""
    db = SessionLocal()
    try:
        soon = (date.today() + timedelta(days=3)).isoformat()
        today = date.today().isoformat()

        goals = (
            db.query(Goal)
            .filter(
                Goal.status == "active",
                Goal.deadline_reminder_sent.is_(False),
                Goal.deadline.isnot(None),
                Goal.deadline <= soon,
                Goal.deadline >= today,
            )
            .all()
        )

        for goal in goals:
            couple = db.get(Couple, goal.couple_id)
            if not couple:
                continue
            member_ids = [uid for uid in (couple.user_one_id, couple.user_two_id) if uid]
            for user_id in member_ids:
                push_notification(
                    db,
                    user_id=user_id,
                    title=f"Deadline inakaribia: {goal.title}",
                    body=f"Lengo '{goal.title}' lina siku chache zilizobaki hadi {goal.deadline}.",
                )
            goal.deadline_reminder_sent = True
            db.commit()

        if goals:
            logger.info(f"Sent deadline reminders for {len(goals)} goal(s).")
    finally:
        db.close()


scheduler = BackgroundScheduler()


def start_scheduler() -> None:
    # Runs once a day. For faster local testing, change hour/minute or use
    # scheduler.add_job(check_goal_deadlines, "interval", minutes=1)
    scheduler.add_job(check_goal_deadlines, "cron", hour=8, minute=0, id="goal_deadline_check", replace_existing=True)
    if not scheduler.running:
        scheduler.start()
    logger.info("Background scheduler started (daily goal-deadline check at 08:00).")
