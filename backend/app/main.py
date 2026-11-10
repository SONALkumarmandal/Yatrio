from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select
from starlette.middleware.sessions import SessionMiddleware

from app.core.config import settings
from app.core.database import Base, SessionLocal, engine
from app.core.security import hash_password
from app.models import User
from app.routers import admin, auth, destinations, docs, projects, users
from app.routers.destinations import seed_destinations_if_empty


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)  # use Alembic migrations for production schema changes
    with SessionLocal() as db:
        if settings.FIRST_ADMIN_EMAIL and settings.FIRST_ADMIN_PASSWORD:
            if not db.scalar(select(User).where(User.email == settings.FIRST_ADMIN_EMAIL.lower())):
                db.add(User(
                    email=settings.FIRST_ADMIN_EMAIL.lower(),
                    username=settings.FIRST_ADMIN_USERNAME,
                    full_name="Administrator",
                    hashed_password=hash_password(settings.FIRST_ADMIN_PASSWORD),
                    role="admin",
                ))
                db.commit()
        seed_destinations_if_empty(db)
    yield


app = FastAPI(title=settings.APP_NAME, version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(
    SessionMiddleware,
    secret_key=settings.SESSION_SECRET_KEY,
    session_cookie="session",
    max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    same_site="none" if settings.is_production else "lax",
    https_only=settings.is_production,
)

API_PREFIX = "/api"
for r in (auth.router, users.router, destinations.router, projects.router, docs.router, admin.router):
    app.include_router(r, prefix=API_PREFIX)


@app.get("/health", tags=["Health"])
def health():
    return {"status": "ok"}
