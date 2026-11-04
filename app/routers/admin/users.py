from typing import Literal

from fastapi import APIRouter, Depends, HTTPException, Query, Request, status
from sqlalchemy import func, or_, select, update
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import require_admin
from app.models import User, UserSession
from app.routers.users import delete_user_and_assets
from app.schemas.common import Page
from app.schemas.user import AdminUserUpdate, UserOut
from app.services.activity import log_activity

router = APIRouter(prefix="/users", tags=["Admin · Users"])


def _get(db: Session, user_id: int) -> User:
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "User not found")
    return user


@router.get("", response_model=Page[UserOut])
def list_users(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    search: str | None = None,
    role: Literal["user", "admin"] | None = None,
    status_filter: Literal["active", "suspended"] | None = Query(None, alias="status"),
    sort: Literal["created_at", "email", "last_login_at"] = "created_at",
    order: Literal["asc", "desc"] = "desc",
    db: Session = Depends(get_db),
):
    q = select(User)
    if search:
        like = f"%{search}%"
        q = q.where(or_(User.email.ilike(like), User.username.ilike(like), User.full_name.ilike(like)))
    if role:
        q = q.where(User.role == role)
    if status_filter:
        q = q.where(User.status == status_filter)
    total = db.scalar(select(func.count()).select_from(q.subquery()))
    col = getattr(User, sort)
    q = q.order_by(col.asc() if order == "asc" else col.desc()).offset((page - 1) * page_size).limit(page_size)
    return Page(items=db.scalars(q).all(), total=total, page=page, page_size=page_size)


@router.get("/{id}", response_model=UserOut)
def get_user(id: int, db: Session = Depends(get_db)):
    return _get(db, id)


@router.put("/{id}", response_model=UserOut)
def update_user(
    id: int,
    payload: AdminUserUpdate,
    request: Request,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    user = _get(db, id)
    data = payload.model_dump(exclude_unset=True)
    if user.id == admin.id and (data.get("role") == "user" or data.get("status") == "suspended"):
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "You cannot demote or suspend yourself")
    for k, v in data.items():
        setattr(user, k, v)
    if data.get("status") == "suspended":
        db.execute(update(UserSession).where(UserSession.user_id == user.id).values(revoked=True))
    db.commit()
    db.refresh(user)
    log_activity(db, request, "admin.user.update", admin.id, f"user_id={id} {data}")
    return user


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(
    id: int,
    request: Request,
    hard: bool = Query(False, description="true = permanently delete; false = deactivate (suspend)"),
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    user = _get(db, id)
    if user.id == admin.id:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "You cannot delete your own account here")
    if hard:
        delete_user_and_assets(db, user)
    else:
        user.status = "suspended"
        db.execute(update(UserSession).where(UserSession.user_id == user.id).values(revoked=True))
        db.commit()
    log_activity(db, request, "admin.user.delete" if hard else "admin.user.deactivate", admin.id, f"user_id={id}")
