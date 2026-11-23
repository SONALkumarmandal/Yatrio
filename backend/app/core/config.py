from functools import lru_cache

from pydantic import field_validator, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    APP_NAME: str = "Yatrio"
    ENVIRONMENT: str = "development"

    DATABASE_URL: str = "sqlite:///./yatrio.db"

    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    CLOUDINARY_CLOUD_NAME: str = ""
    CLOUDINARY_API_KEY: str = ""
    CLOUDINARY_API_SECRET: str = ""
    CLOUDINARY_FOLDER: str = "yatrio"
    MAX_UPLOAD_MB: int = 10

    CORS_ORIGINS: str = (
        "http://localhost:3000,http://localhost:5173,http://127.0.0.1:5173,"
        "http://localhost:4173,https://yatrio.vercel.app"
    )

    FIRST_ADMIN_EMAIL: str | None = None
    FIRST_ADMIN_USERNAME: str = "admin"
    FIRST_ADMIN_PASSWORD: str | None = None

    @field_validator("FIRST_ADMIN_EMAIL", "FIRST_ADMIN_PASSWORD", mode="before")
    @classmethod
    def empty_admin_settings_are_unset(cls, value: str | None) -> str | None:
        if isinstance(value, str) and not value.strip():
            return None
        return value

    @field_validator("JWT_SECRET_KEY")
    @classmethod
    def validate_jwt_secret(cls, value: str) -> str:
        if len(value) < 48 or len(set(value)) < 16 or value != value.strip():
            raise ValueError("JWT_SECRET_KEY must be a high-entropy secret of at least 48 characters")
        return value

    @field_validator("FIRST_ADMIN_PASSWORD")
    @classmethod
    def validate_first_admin_password(cls, value: str | None) -> str | None:
        if value is not None and (
            len(value) < 16
            or value.casefold() in {"admin12345!", "changeme123!", "password123!"}
        ):
            raise ValueError("FIRST_ADMIN_PASSWORD must be unique and at least 16 characters")
        return value

    @model_validator(mode="after")
    def validate_settings(self) -> "Settings":
        if bool(self.FIRST_ADMIN_EMAIL) != bool(self.FIRST_ADMIN_PASSWORD):
            raise ValueError("Set both FIRST_ADMIN_EMAIL and FIRST_ADMIN_PASSWORD, or neither")
        if self.is_production and any(
            not origin.startswith("https://") for origin in self.cors_origins_list
        ):
            raise ValueError("Production CORS_ORIGINS must contain only HTTPS origins")
        return self

    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip().rstrip("/") for o in self.CORS_ORIGINS.split(",") if o.strip()]

    @property
    def is_production(self) -> bool:
        return self.ENVIRONMENT.lower() == "production"


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()