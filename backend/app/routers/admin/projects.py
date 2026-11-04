from fastapi import APIRouter, Depends, HTTPException, Query, Request, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import require_admin
from app.models import Project, User
from app.schemas.common import Page
from app.schemas.project import ProjectOut
from app.services.activity import log_activity

router = APIRouter(prefix="/projects", tags=["Admin · Projects"])


@router.get("", response_model=Page[ProjectOut])
def list_all_projects(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    owner_id: int | None = None,
    search: str | None = None,
    db: Session = Depends(get_db),
):
    q = select(Project)
    if owner_id:
        q = q.where(Project.owner_id == owner_id)
    if search:
        q = q.where(Project.name.ilike(f"%{search}%"))
    total = db.scalar(select(func.count()).select_from(q.subquery()))
    items = db.scalars(q.order_by(Project.created_at.desc()).offset((page - 1) * page_size).limit(page_size)).all()
    return Page(items=items, total=total, page=page, page_size=page_size)


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_any_project(id: int, request: Request, admin: User = Depends(require_admin), db: Session = Depends(get_db)):
    project = db.get(Project, id)
    if not project:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Project not found")
    db.delete(project)
    db.commit()
    log_activity(db, request, "admin.project.delete", admin.id, f"project_id={id}")
