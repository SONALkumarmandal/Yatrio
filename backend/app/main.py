from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import Base, SessionLocal, engine
from app.core.security import hash_password
from app.models import User
from app.routers import admin, auth, destinations, docs, projects, users
from app.routers.destinations import seed_destinations_if_empty


def seed_first_admin_if_missing(db: Session) -> None:
    if not settings.FIRST_ADMIN_EMAIL or not settings.FIRST_ADMIN_PASSWORD:
        return

    email = settings.FIRST_ADMIN_EMAIL.lower()
    existing_email_user = db.scalar(select(User).where(User.email == email))
    if existing_email_user:
        if existing_email_user.role != "admin":
            raise RuntimeError("FIRST_ADMIN_EMAIL belongs to an existing non-admin user")
        return

    existing_username_user = db.scalar(
        select(User).where(User.username == settings.FIRST_ADMIN_USERNAME)
    )
    if existing_username_user:
        if existing_username_user.role != "admin":
            raise RuntimeError("FIRST_ADMIN_USERNAME belongs to an existing non-admin user")
        return

    db.add(User(
        email=email,
        username=settings.FIRST_ADMIN_USERNAME,
        full_name="Administrator",
        hashed_password=hash_password(settings.FIRST_ADMIN_PASSWORD),
        role="admin",
    ))
    db.commit()


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)  # use Alembic migrations for production schema changes
    with SessionLocal() as db:
        seed_first_admin_if_missing(db)
        seed_destinations_if_empty(db)
    yield


app = FastAPI(title=settings.APP_NAME, version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=False,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)

API_PREFIX = "/api"
for r in (auth.router, users.router, destinations.router, projects.router, docs.router, admin.router):
    app.include_router(r, prefix=API_PREFIX)


@app.get("/health", tags=["Health"])
def health():
    return {"status": "ok"}
