from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from app.core.config import settings


def _normalize(url: str) -> str:
    # Neon gives postgresql:// or postgres:// -> use the psycopg2 driver explicitly
    if url.startswith("postgres://"):
        url = url.replace("postgres://", "postgresql+psycopg2://", 1)
    elif url.startswith("postgresql://"):
        url = url.replace("postgresql://", "postgresql+psycopg2://", 1)
    return url


is_sqlite = "sqlite" in settings.DATABASE_URL
connect_args = {"check_same_thread": False} if is_sqlite else {}
pool_kwargs = {"pool_pre_ping": True}
if not is_sqlite:
    pool_kwargs.update({"pool_recycle": 300, "pool_size": 5, "max_overflow": 10})

engine = create_engine(
    _normalize(settings.DATABASE_URL),
    connect_args=connect_args,
    **pool_kwargs,
)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


class Base(DeclarativeBase):
    pass


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
