# from pydantic_settings import BaseSettings, SettingsConfigDict


# class Settings(BaseSettings):
#     APP_NAME: str = "Dream Together API"
#     ENV: str = "development"

#     # Default to SQLite so the project runs with zero external setup.
#     # Swap to postgresql+psycopg2://user:pass@localhost:5432/dreamtogether for production.
#     DATABASE_URL: str = "sqlite:///./dev.db"

#     SECRET_KEY: str = "dev-secret-change-me-in-production"
#     ALGORITHM: str = "HS256"
#     ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24h for easy local dev

#     CORS_ORIGINS: list[str] = [
#         "http://localhost:5173",
#         "http://127.0.0.1:5173",
#     ]

#     FRONTEND_URL: str = "http://localhost:5173"

#     # SMTP — if left blank, emails are printed to the console instead (dev-friendly default).
#     SMTP_HOST: str = ""
#     SMTP_PORT: int = 587
#     SMTP_USER: str = ""
#     SMTP_PASSWORD: str = ""
#     SMTP_FROM: str = "no-reply@dreamtogether.app"

#     UPLOAD_DIR: str = "uploads"
#     MAX_UPLOAD_MB: int = 10

#     model_config = SettingsConfigDict(env_file=".env", extra="ignore")


# settings = Settings()

from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import field_validator
from typing import Any


class Settings(BaseSettings):
    APP_NAME: str = "Dream Together API"
    ENV: str = "development"

    # Default to SQLite so the project runs with zero external setup.
    # Swap to postgresql+psycopg2://user:pass@localhost:5432/dreamtogether for production.
    DATABASE_URL: str = "sqlite:///./dev.db"

    SECRET_KEY: str = "dev-secret-change-me-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24h for easy local dev

    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def parse_cors_origins(cls, v: Any) -> list[str]:
        if isinstance(v, str):
            # Kama thamani kutoka Render inaanza na [ (mfano: ["http://..."]), ifungue kama JSON
            if v.startswith("["):
                import json
                try:
                    return json.loads(v)
                except Exception:
                    pass
            # Kama ni string ya kawaida (mfano: http://localhost,https://vercel.com) igawanye kwa koma
            return [x.strip() for x in v.split(",") if x.strip()]
        return v

    FRONTEND_URL: str = "http://localhost:5173"

    # SMTP — if left blank, emails are printed to the console instead (dev-friendly default).
    SMTP_HOST: str = ""
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    SMTP_FROM: str = "no-reply@dreamtogether.app"

    UPLOAD_DIR: str = "uploads"
    MAX_UPLOAD_MB: int = 10

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()