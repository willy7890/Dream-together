from pydantic_settings import BaseSettings, SettingsConfigDict


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
