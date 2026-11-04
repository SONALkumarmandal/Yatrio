from fastapi import APIRouter, Depends, File, Form, HTTPException, Query, Request, UploadFile, status
from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models import Doc, Project, User
from app.schemas.common import Page
from app.schemas.doc import DocOut
from app.services import cloudinary_service as cdn
from app.services.activity import log_activity

router = APIRouter(prefix="/docs", tags=["Docs"])


def _get_owned(db: Session, doc_id: int, user: User) -> Doc:
    doc = db.scalar(select(Doc).where(Doc.id == doc_id, Doc.owner_id == user.id))
    if not doc:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Document not found")
    return doc


@router.get("", response_model=Page[DocOut])
def list_docs(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    project_id: int | None = None,
    search: str | None = None,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    q = select(Doc).where(Doc.owner_id == user.id)
    if project_id is not None:
        q = q.where(Doc.project_id == project_id)
    if search:
        like = f"%{search}%"
        q = q.where(or_(Doc.title.ilike(like), Doc.description.ilike(like)))
    total = db.scalar(select(func.count()).select_from(q.subquery()))
    items = db.scalars(q.order_by(Doc.created_at.desc()).offset((page - 1) * page_size).limit(page_size)).all()
    return Page(items=items, total=total, page=page, page_size=page_size)


@router.post("", response_model=DocOut, status_code=status.HTTP_201_CREATED)
def create_doc(
    request: Request,
    title: str = Form(..., min_length=1, max_length=200),
    description: str | None = Form(None),
    content: str | None = Form(None),
    project_id: int | None = Form(None),
    file: UploadFile | None = File(None),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    has_file = bool(file and file.filename)
    if not content and not has_file:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, "Provide 'content' text and/or a 'file'")
    if project_id is not None and not db.scalar(
        select(Project.id).where(Project.id == project_id, Project.owner_id == user.id)
    ):
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Project not found")

    doc = Doc(owner_id=user.id, project_id=project_id, title=title, description=description, content=content)
    if has_file:
        res = cdn.upload_file(file, f"docs/{user.id}", cdn.DOC_TYPES)
        doc.file_url, doc.file_public_id = res["url"], res["public_id"]
        doc.file_resource_type, doc.file_name = res["resource_type"], res["original_filename"]
        doc.file_size, doc.mime_type = res["bytes"], res["content_type"]

    db.add(doc)
    db.commit()
    db.refresh(doc)
    log_activity(db, request, "doc.create", user.id, f"doc_id={doc.id}")
    return doc


@router.get("/{id}", response_model=DocOut)
def get_doc(id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return _get_owned(db, id, user)


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_doc(id: int, request: Request, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    doc = _get_owned(db, id, user)
    cdn.delete_asset(doc.file_public_id, doc.file_resource_type)
    db.delete(doc)
    db.commit()
    log_activity(db, request, "doc.delete", user.id, f"doc_id={id}")
