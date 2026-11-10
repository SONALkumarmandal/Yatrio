from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models import Destination
from app.schemas.common import Page
from app.schemas.destination import DestinationOut

router = APIRouter(prefix="/destinations", tags=["Destinations"])

# Default curated seed destinations aligned with Yatrio catalog
INITIAL_DESTINATIONS = [
    {
        "slug": "kerala",
        "title": "Kerala",
        "state": "God's Own Country",
        "country": "India",
        "city": "Alleppey",
        "region": "South",
        "label": "Slow mornings",
        "price": 18500,
        "duration_days": 6,
        "season": "October – March",
        "description": "Drift through quiet backwaters, wake to the scent of cardamom, and let the green of the Western Ghats slow everything down.",
        "highlights": ["Alleppey houseboat", "Munnar tea gardens", "Fort Kochi cafés"],
        "best_for": "A little bit of everything",
        "rating": "4.9",
        "is_published": True,
        "media": [
            {
                "url": "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1400&q=85",
                "public_id": "seed_kerala",
                "resource_type": "image",
                "format": "jpg",
                "bytes": 0,
            }
        ],
    },
    {
        "slug": "ladakh",
        "title": "Ladakh",
        "state": "Land of high passes",
        "country": "India",
        "city": "Leh",
        "region": "North",
        "label": "Big adventures",
        "price": 32000,
        "duration_days": 7,
        "season": "June – September",
        "description": "Follow the long road over high mountain passes, between blue lakes and quiet monasteries, at a pace that lets the landscape sink in.",
        "highlights": ["Pangong Tso", "Nubra Valley", "Thiksey Monastery"],
        "best_for": "Mountain lovers",
        "rating": "4.9",
        "is_published": True,
        "media": [
            {
                "url": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1400&q=85",
                "public_id": "seed_ladakh",
                "resource_type": "image",
                "format": "jpg",
                "bytes": 0,
            }
        ],
    },
    {
        "slug": "rajasthan",
        "title": "Rajasthan",
        "state": "A land of stories",
        "country": "India",
        "city": "Jaipur",
        "region": "West",
        "label": "Heritage trails",
        "price": 24500,
        "duration_days": 6,
        "season": "October – March",
        "description": "Wander through pink city streets, centuries-old havelis, and desert sunsets that stay with you long after the journey home.",
        "highlights": ["Jaipur old city", "Udaipur lakes", "Jodhpur blue lanes"],
        "best_for": "Culture & history",
        "rating": "4.8",
        "is_published": True,
        "media": [
            {
                "url": "https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=1400&q=85",
                "public_id": "seed_rajasthan",
                "resource_type": "image",
                "format": "jpg",
                "bytes": 0,
            }
        ],
    },
    {
        "slug": "goa",
        "title": "Goa",
        "state": "Find your own shore",
        "country": "India",
        "city": "Panaji",
        "region": "West",
        "label": "Coastal escapes",
        "price": 14000,
        "duration_days": 5,
        "season": "November – February",
        "description": "Skip the rush for red-clay paths, morning swim spots, fresh fish thalis, and long afternoons spent under coconut palms.",
        "highlights": ["South Goa beaches", "Portuguese quarters", "Spice plantation lunch"],
        "best_for": "Easy getaways",
        "rating": "4.7",
        "is_published": True,
        "media": [
            {
                "url": "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1400&q=85",
                "public_id": "seed_goa",
                "resource_type": "image",
                "format": "jpg",
                "bytes": 0,
            }
        ],
    },
    {
        "slug": "himachal",
        "title": "Himachal Pradesh",
        "state": "Valley of the gods",
        "country": "India",
        "city": "Manali",
        "region": "North",
        "label": "Mountain retreats",
        "price": 21000,
        "duration_days": 6,
        "season": "March – June & September – November",
        "description": "Cedar forests, winding roads, wooden balconies, and clean Himalayan air. A slower pace among apple orchards and high peaks.",
        "highlights": ["Jibhi valley walks", "Old Manali lanes", "Spiti border drive"],
        "best_for": "Cool air & quiet walks",
        "rating": "4.8",
        "is_published": True,
        "media": [
            {
                "url": "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1400&q=85",
                "public_id": "seed_himachal",
                "resource_type": "image",
                "format": "jpg",
                "bytes": 0,
            }
        ],
    },
    {
        "slug": "bali",
        "title": "Bali",
        "state": "A little further away",
        "country": "Indonesia",
        "city": "Ubud",
        "region": "Beyond",
        "label": "Beyond India",
        "price": 48000,
        "duration_days": 7,
        "season": "April – October",
        "description": "Find your way from green Ubud mornings to the soft glow of the coast, with time left over to do absolutely nothing.",
        "highlights": ["Ubud rice terraces", "Temple at sunset", "Island day trip"],
        "best_for": "A change of scenery",
        "rating": "4.9",
        "is_published": True,
        "media": [
            {
                "url": "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1400&q=85",
                "public_id": "seed_bali",
                "resource_type": "image",
                "format": "jpg",
                "bytes": 0,
            }
        ],
    },
]


def seed_destinations_if_empty(db: Session):
    existing_count = db.scalar(select(func.count(Destination.id)))
    if existing_count == 0:
        for item in INITIAL_DESTINATIONS:
            db.add(Destination(**item))
        db.commit()


@router.get("", response_model=Page[DestinationOut])
def list_public_destinations(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    search: str | None = None,
    region: str | None = None,
    country: str | None = None,
    db: Session = Depends(get_db),
):
    seed_destinations_if_empty(db)
    q = select(Destination).where(Destination.is_published.is_(True))

    if search:
        like = f"%{search}%"
        q = q.where(
            or_(
                Destination.title.ilike(like),
                Destination.city.ilike(like),
                Destination.state.ilike(like),
                Destination.country.ilike(like),
                Destination.description.ilike(like),
                Destination.label.ilike(like),
                Destination.best_for.ilike(like),
            )
        )
    if region and region != "All regions":
        q = q.where(Destination.region.ilike(region))
    if country:
        q = q.where(Destination.country.ilike(country))

    total = db.scalar(select(func.count()).select_from(q.subquery()))
    items = db.scalars(
        q.order_by(Destination.created_at.asc()).offset((page - 1) * page_size).limit(page_size)
    ).all()

    return Page(items=items, total=total, page=page, page_size=page_size)


@router.get("/regions", response_model=list[str])
def get_regions(db: Session = Depends(get_db)):
    seed_destinations_if_empty(db)
    regions = db.scalars(
        select(Destination.region)
        .where(Destination.is_published.is_(True), Destination.region.is_not(None))
        .distinct()
    ).all()
    ordered = ["All regions"] + [r for r in regions if r]
    return ordered


@router.get("/{slug_or_id}", response_model=DestinationOut)
def get_destination_detail(slug_or_id: str, db: Session = Depends(get_db)):
    seed_destinations_if_empty(db)
    dest = None
    if slug_or_id.isdigit():
        dest = db.get(Destination, int(slug_or_id))
    if not dest:
        dest = db.scalar(
            select(Destination).where(
                Destination.slug == slug_or_id,
                Destination.is_published.is_(True),
            )
        )
    if not dest:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Destination not found")
    return dest
