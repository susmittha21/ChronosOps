from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


# chronosops/backend/app/config.py
APP_DIR = Path(__file__).resolve().parent
BACKEND_DIR = APP_DIR.parent
PROJECT_DIR = BACKEND_DIR.parent

DATA_DIR = BACKEND_DIR / "data"
DATA_DIR.mkdir(parents=True, exist_ok=True)


class Settings(BaseSettings):
    app_name: str = "ChronosOps API"
    app_version: str = "1.0.0"
    api_prefix: str = "/api/v1"

    database_path: Path = DATA_DIR / "chronosops.db"

    # React with Vite normally runs on port 5173.
    frontend_origin: str = "http://localhost:5173"

    model_config = SettingsConfigDict(
        env_file=PROJECT_DIR / ".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()