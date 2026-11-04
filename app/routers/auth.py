from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import bearer_scheme, get_current_user
from app.core.security import create_access_token, hash_password, verify_password
from app.models import User, UserSession
from app.schemas.common import Message
from app.schemas.user import LoginRequest, RegisterRequest, TokenOut, UserOut
from app.services.activity import client_ip, log_activity

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def register(payload: RegisterRequest, request: Request, db: Session = Depends(get_db)):
    exists = db.scalar(
        select(User).where(or_(User.email == payload.email.lower(), User.username == payload.username))
    )
    if exists:
        raise HTTPException(status.HTTP_409_CONFLICT, "Email or username already registered")

    user = User(
        email=payload.email.lower(),
        username=payload.username,
        full_name=payload.full_name,
        hashed_password=hash_password(payload.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    log_activity(db, request, "auth.register", user.id)
    return user


@router.post("/login", response_model=TokenOut)
def login(payload: LoginRequest, request: Request, db: Session = Depends(get_db)):
    user = db.scalar(select(User).where(User.email == payload.email.lower()))
    if not user or not verify_password(payload.password, user.hashed_password):
        log_activity(db, request, "auth.login_failed", user.id if user else None, payload.email)
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Incorrect email or password")
    if user.status != "active":
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Account is suspended")

    token, jti, expires_at = create_access_token(user.id, user.role)
    db.add(
        UserSession(
            jti=jti,
            user_id=user.id,
            ip_address=client_ip(request),
            user_agent=(request.headers.get("user-agent") or "")[:300],
            expires_at=expires_at,
        )
    )
    user.last_login_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(user)

    # server-side session cookie (signed by SessionMiddleware) so browsers don't need to handle the token
    request.session["access_token"] = token
    request.session["user_id"] = user.id

    log_activity(db, request, "auth.login", user.id)
    return TokenOut(access_token=token, expires_at=expires_at, user=user)


@router.post("/logout", response_model=Message)
def logout(request: Request, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    jti = getattr(request.state, "jti", None)
    sess = db.scalar(select(UserSession).where(UserSession.jti == jti))
    if sess:
        sess.revoked = True
        db.commit()
    request.session.clear()
    log_activity(db, request, "auth.logout", user.id)
    return Message(message="Logged out")
