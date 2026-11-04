from fastapi import APIRouter, Depends

from app.core.deps import require_admin
from app.routers.admin import analytics, destinations, projects, users

# every /admin/* route requires an authenticated admin
router = APIRouter(prefix="/admin", dependencies=[Depends(require_admin)])
router.include_router(users.router)
router.include_router(projects.router)
router.include_router(destinations.router)
router.include_router(analytics.router)
