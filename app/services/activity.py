from fastapi import Request
from sqlalchemy.orm import Session

from app.models import ActivityLog


def client_ip(request: Request) -> str | None:
    fwd = request.headers.get("x-forwarded-for")
    if fwd:
        return fwd.split(",")[0].strip()
    return request.client.host if request.client else None


def log_activity(db: Session, request: Request | None, action: str, user_id: int | None = None, detail: str | None = None) -> None:
    db.add(ActivityLog(user_id=user_id, action=action, detail=detail, ip_address=client_ip(request) if request else None))
    db.commit()
