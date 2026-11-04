from fastapi import APIRouter, Depends, File, Form, HTTPException, Request, UploadFile, status
from pydantic import EmailStr
from sqlalchemy import select, update
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user
from app.core.security import hash_password, verify_password
from app.models import Doc, User, UserSession
from app.schemas.user import UserOut, _check_password
from app.services import cloudinary_service as cdn
from app.services.activity import log_activity

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me", response_model=UserOut)
def get_me(user: User = Depends(get_current_user)):
    return user


@router.put("/me", response_model=UserOut)
def update_me(
    full_name: str | None = Form(None, max_length=120),
    username: str | None = Form(None, min_length=3, max_length=50),
    email: EmailStr | None = Form(None),
    current_password: str | None = Form(None),
    new_password: str | None = Form(None, min_length=8),
    avatar: UploadFile | None = File(None),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if username and username != user.username:
        if db.scalar(select(User).where(User.username == username, User.id != user.id)):
            raise HTTPException(status.HTTP_409_CONFLICT, "Username already taken")
        user.username = username
    if email and email.lower() != user.email:
        if db.scalar(select(User).where(User.email == email.lower(), User.id != user.id)):
            raise HTTPException(status.HTTP_409_CONFLICT, "Email already registered")
        user.email = email.lower()
    if full_name is not None:
        user.full_name = full_name

    if new_password:
        if not current_password or not verify_password(current_password, user.hashed_password):
            raise HTTPException(status.HTTP_400_BAD_REQUEST, "Current password is incorrect")
        try:
            _check_password(new_password)
        except ValueError as e:
            raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, str(e))
        user.hashed_password = hash_password(new_password)
        # password change signs out every other session
        db.execute(update(UserSession).where(UserSession.user_id == user.id).values(revoked=True))

    if avatar and avatar.filename:
        res = cdn.upload_file(avatar, "avatars", cdn.IMAGE_TYPES)
        cdn.delete_asset(user.avatar_public_id, "image")
        user.avatar_url, user.avatar_public_id = res["url"], res["public_id"]

    db.commit()
    db.refresh(user)
    return user


@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
def delete_me(request: Request, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    delete_user_and_assets(db, user)
    request.session.clear()
    log_activity(db, request, "user.self_delete", None, f"user_id={user.id}")


def delete_user_and_assets(db: Session, user: User) -> None:
    """Shared with the admin router: remove Cloudinary files, then the user (cascades to rows)."""
    for doc in db.scalars(select(Doc).where(Doc.owner_id == user.id, Doc.file_public_id.is_not(None))):
        cdn.delete_asset(doc.file_public_id, doc.file_resource_type)
    cdn.delete_asset(user.avatar_public_id, "image")
    db.delete(user)
    db.commit()
