from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, Query
from sqlalchemy import func, select, text
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models import ActivityLog, Destination, Doc, Project, User, UserSession

router = APIRouter(prefix="/analytics", tags=["Admin · Analytics"])


@router.get("")
def analytics(
    days: int = Query(30, ge=1, le=365),
    log_limit: int = Query(50, ge=0, le=500),
    db: Session = Depends(get_db),
):
    now = datetime.now(timezone.utc)
    since = now - timedelta(days=days)
    count = lambda model, *where: db.scalar(select(func.count()).select_from(model).where(*where)) or 0  # noqa: E731

    try:
        db.execute(text("SELECT 1"))
        db_ok = True
    except Exception:
        db_ok = False

    signups = db.execute(
        select(func.date(User.created_at), func.count())
        .where(User.created_at >= since)
        .group_by(func.date(User.created_at))
        .order_by(func.date(User.created_at))
    ).all()

    top_actions = db.execute(
        select(ActivityLog.action, func.count().label("n"))
        .where(ActivityLog.created_at >= since)
        .group_by(ActivityLog.action)
        .order_by(func.count().desc())
        .limit(10)
    ).all()

    logs = db.scalars(select(ActivityLog).order_by(ActivityLog.created_at.desc()).limit(log_limit)).all()

    return {
        "health": {"database": "ok" if db_ok else "down", "checked_at": now},
        "totals": {
            "users": count(User),
            "admins": count(User, User.role == "admin"),
            "suspended_users": count(User, User.status == "suspended"),
            "projects": count(Project),
            "docs": count(Doc),
            "destinations": count(Destination),
            "published_destinations": count(Destination, Destination.is_published.is_(True)),
            "active_sessions": count(UserSession, UserSession.revoked.is_(False), UserSession.expires_at > now),
        },
        "period": {
            "days": days,
            "new_users": count(User, User.created_at >= since),
            "new_projects": count(Project, Project.created_at >= since),
            "new_docs": count(Doc, Doc.created_at >= since),
            "logins": count(ActivityLog, ActivityLog.action == "auth.login", ActivityLog.created_at >= since),
            "failed_logins": count(ActivityLog, ActivityLog.action == "auth.login_failed", ActivityLog.created_at >= since),
        },
        "signups_by_day": [{"date": str(d), "count": c} for d, c in signups],
        "top_actions": [{"action": a, "count": n} for a, n in top_actions],
        "logs": [
            {"id": l.id, "user_id": l.user_id, "action": l.action, "detail": l.detail,
             "ip_address": l.ip_address, "created_at": l.created_at}
            for l in logs
        ],
    }
