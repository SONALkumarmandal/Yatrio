from fastapi import APIRouter, Depends, HTTPException, Query, Request, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models import Project, User
from app.schemas.common import Page
from app.schemas.project import ProjectCreate, ProjectOut, ProjectUpdate
from app.services.activity import log_activity

router = APIRouter(prefix="/projects", tags=["Projects"])


def _get_owned(db: Session, project_id: int, user: User) -> Project:
    project = db.scalar(select(Project).where(Project.id == project_id, Project.owner_id == user.id))
    if not project:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Project not found")
    return project


@router.get("", response_model=Page[ProjectOut])
def list_projects(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    search: str | None = None,
    status_filter: str | None = Query(None, alias="status"),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    q = select(Project).where(Project.owner_id == user.id)
    if search:
        q = q.where(Project.name.ilike(f"%{search}%"))
    if status_filter:
        q = q.where(Project.status == status_filter)
    total = db.scalar(select(func.count()).select_from(q.subquery()))
    items = db.scalars(q.order_by(Project.updated_at.desc()).offset((page - 1) * page_size).limit(page_size)).all()
    return Page(items=items, total=total, page=page, page_size=page_size)


@router.post("", response_model=ProjectOut, status_code=status.HTTP_201_CREATED)
def create_project(payload: ProjectCreate, request: Request, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    project = Project(owner_id=user.id, **payload.model_dump())
    db.add(project)
    db.commit()
    db.refresh(project)
    log_activity(db, request, "project.create", user.id, f"project_id={project.id}")
    return project


@router.get("/{id}", response_model=ProjectOut)
def get_project(id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return _get_owned(db, id, user)


@router.put("/{id}", response_model=ProjectOut)
def update_project(id: int, payload: ProjectUpdate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    project = _get_owned(db, id, user)
    for k, v in payload.model_dump(exclude_unset=True).items():
        setattr(project, k, v)
    db.commit()
    db.refresh(project)
    return project


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(id: int, request: Request, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    project = _get_owned(db, id, user)
    db.delete(project)
    db.commit()
    log_activity(db, request, "project.delete", user.id, f"project_id={id}")
