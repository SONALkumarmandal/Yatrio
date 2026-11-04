from decimal import Decimal

from fastapi import APIRouter, Depends, File, Form, HTTPException, Query, Request, UploadFile, status
from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import require_admin
from app.models import Destination, User
from app.schemas.common import Page
from app.schemas.destination import DestinationOut
from app.services import cloudinary_service as cdn
from app.services.activity import log_activity

router = APIRouter(prefix="/destinations", tags=["Admin · Destinations"])


def _get(db: Session, dest_id: int) -> Destination:
    dest = db.get(Destination, dest_id)
    if not dest:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Destination not found")
    return dest


def _upload_all(files: list[UploadFile]) -> list[dict]:
    uploaded: list[dict] = []
    try:
        for f in files:
            if not f.filename:
                continue
            res = cdn.upload_file(f, "destinations", cdn.MEDIA_TYPES)
            uploaded.append({k: res[k] for k in ("url", "public_id", "resource_type", "format", "bytes")})
    except HTTPException:
        for m in uploaded:  # roll back partial uploads
            cdn.delete_asset(m["public_id"], m["resource_type"])
        raise
    return uploaded


@router.get("", response_model=Page[DestinationOut])
def list_destinations(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    search: str | None = None,
    country: str | None = None,
    is_published: bool | None = None,
    db: Session = Depends(get_db),
):
    q = select(Destination)
    if search:
        like = f"%{search}%"
        q = q.where(or_(Destination.title.ilike(like), Destination.city.ilike(like), Destination.description.ilike(like)))
    if country:
        q = q.where(Destination.country.ilike(country))
    if is_published is not None:
        q = q.where(Destination.is_published == is_published)
    total = db.scalar(select(func.count()).select_from(q.subquery()))
    items = db.scalars(q.order_by(Destination.created_at.desc()).offset((page - 1) * page_size).limit(page_size)).all()
    return Page(items=items, total=total, page=page, page_size=page_size)


@router.post("", response_model=DestinationOut, status_code=status.HTTP_201_CREATED)
def create_destination(
    request: Request,
    title: str = Form(..., min_length=1, max_length=200),
    description: str | None = Form(None),
    country: str | None = Form(None),
    city: str | None = Form(None),
    price: Decimal | None = Form(None, ge=0),
    duration_days: int | None = Form(None, ge=1),
    is_published: bool = Form(True),
    media: list[UploadFile] = File(default=[]),
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    dest = Destination(
        title=title, description=description, country=country, city=city, price=price,
        duration_days=duration_days, is_published=is_published, created_by=admin.id,
        media=_upload_all(media),
    )
    db.add(dest)
    db.commit()
    db.refresh(dest)
    log_activity(db, request, "admin.destination.create", admin.id, f"destination_id={dest.id}")
    return dest


@router.get("/{id}", response_model=DestinationOut)
def get_destination(id: int, db: Session = Depends(get_db)):
    return _get(db, id)


@router.put("/{id}", response_model=DestinationOut)
def update_destination(
    id: int,
    request: Request,
    title: str | None = Form(None, min_length=1, max_length=200),
    description: str | None = Form(None),
    country: str | None = Form(None),
    city: str | None = Form(None),
    price: Decimal | None = Form(None, ge=0),
    duration_days: int | None = Form(None, ge=1),
    is_published: bool | None = Form(None),
    remove_media: list[str] = Form(default=[], description="public_ids of media to delete"),
    media: list[UploadFile] = File(default=[], description="new media to append"),
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    dest = _get(db, id)
    for field, value in {
        "title": title, "description": description, "country": country, "city": city,
        "price": price, "duration_days": duration_days, "is_published": is_published,
    }.items():
        if value is not None:
            setattr(dest, field, value)

    current = list(dest.media or [])
    to_remove = [m for m in current if m["public_id"] in set(remove_media)]
    new_items = _upload_all(media)
    for m in to_remove:
        cdn.delete_asset(m["public_id"], m["resource_type"])
    dest.media = [m for m in current if m not in to_remove] + new_items  # reassign so the JSON change is detected

    db.commit()
    db.refresh(dest)
    log_activity(db, request, "admin.destination.update", admin.id, f"destination_id={id}")
    return dest


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_destination(id: int, request: Request, admin: User = Depends(require_admin), db: Session = Depends(get_db)):
    dest = _get(db, id)
    for m in dest.media or []:
        cdn.delete_asset(m["public_id"], m["resource_type"])
    db.delete(dest)
    db.commit()
    log_activity(db, request, "admin.destination.delete", admin.id, f"destination_id={id}")
