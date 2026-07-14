from fastapi import APIRouter

from app.api.routes import (
    admin, ai, analytics, auth, couples, documents, family, goals,
    journals, memories, messages, mood, notifications, premium, reports, savings, timeline, users,
)

api_router = APIRouter(prefix="/api/v1")
api_router.include_router(auth.router)
api_router.include_router(users.router)
api_router.include_router(couples.router)
api_router.include_router(family.router)
api_router.include_router(goals.router)
api_router.include_router(savings.router)
api_router.include_router(memories.router)
api_router.include_router(journals.router)
api_router.include_router(timeline.router)
api_router.include_router(mood.router)
api_router.include_router(notifications.router)
api_router.include_router(analytics.router)
api_router.include_router(messages.router)
api_router.include_router(documents.router)
api_router.include_router(ai.router)
api_router.include_router(premium.router)
api_router.include_router(reports.router)
api_router.include_router(admin.router)