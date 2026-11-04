from datetime import datetime, timezone

import jwt
from fastapi import Depends, HTTPException, Request, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import decode_token
from app.models import User, UserSession

bearer_scheme = HTTPBearer(auto_error=False)


def _unauthorized(detail: str = "Not authenticated") -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail=detail,
        headers={"WWW-Authenticate": "Bearer"},
    )


def get_current_user(
    request: Request,
    creds: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> User:
    """JWT from the Authorization header, falling back to the server-side session cookie.
    The JWT's jti must also match a live, non-revoked row in user_sessions."""
    token = creds.credentials if creds else request.session.get("access_token")
    if not token:
        raise _unauthorized()
    try:
        payload = decode_token(token)
        user_id = int(payload["sub"])
        jti = payload["jti"]
    except (jwt.PyJWTError, KeyError, ValueError):
        raise _unauthorized("Invalid or expired token")

    session = db.scalar(
        select(UserSession).where(UserSession.jti == jti, UserSession.user_id == user_id)
    )
    if not session or session.revoked or session.expires_at < datetime.now(timezone.utc):
        raise _unauthorized("Session expired or revoked")

    user = db.get(User, user_id)
    if not user:
        raise _unauthorized("User not found")
    if user.status != "active":
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Account is suspended")

    request.state.jti = jti
    return user


def require_admin(user: User = Depends(get_current_user)) -> User:
    if user.role != "admin":
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Admin access required")
    return user
