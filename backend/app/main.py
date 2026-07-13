from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from app.api.middleware.cors import add_cors
from app.api.router import api_router
from app.core.config import settings
from app.core.logging import setup_logging
from app.database.base import Base
from app.database.session import engine
from app.tasks.scheduler import start_scheduler

# Import all models so Base.metadata knows about every table before create_all runs.
from app.models import (  # noqa: F401
    admin, couple, document, family_member, goal, invitation, journal,
    memory, message, mood, notification, report, saving, subscription, timeline, user,
)

setup_logging()

Path(settings.UPLOAD_DIR).mkdir(parents=True, exist_ok=True)


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    start_scheduler()
    yield


app = FastAPI(title=settings.APP_NAME, lifespan=lifespan)
add_cors(app)
app.include_router(api_router)
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")


@app.get("/")
def root():
    return {"app": settings.APP_NAME, "status": "running", "docs": "/docs"}


@app.get("/health")
def health():
    return {"status": "ok"}
