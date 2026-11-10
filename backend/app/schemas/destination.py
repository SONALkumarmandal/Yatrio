from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict


class DestinationBase(BaseModel):
    title: str
    slug: str | None = None
    description: str | None = None
    country: str | None = None
    city: str | None = None
    state: str | None = None
    region: str | None = None
    label: str | None = None
    season: str | None = None
    price: Decimal | None = None
    duration_days: int | None = None
    highlights: list[str] = []
    best_for: str | None = None
    rating: str | None = "4.9"
    is_published: bool = True
    media: list[dict] = []


class DestinationCreate(DestinationBase):
    pass


class DestinationUpdate(BaseModel):
    title: str | None = None
    slug: str | None = None
    description: str | None = None
    country: str | None = None
    city: str | None = None
    state: str | None = None
    region: str | None = None
    label: str | None = None
    season: str | None = None
    price: Decimal | None = None
    duration_days: int | None = None
    highlights: list[str] | None = None
    best_for: str | None = None
    rating: str | None = None
    is_published: bool | None = None
    media: list[dict] | None = None


class DestinationOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    slug: str | None = None
    description: str | None = None
    country: str | None = None
    city: str | None = None
    state: str | None = None
    region: str | None = None
    label: str | None = None
    season: str | None = None
    price: Decimal | None = None
    duration_days: int | None = None
    highlights: list | None = []
    best_for: str | None = None
    rating: str | None = "4.9"
    is_published: bool
    media: list[dict] = []
    created_by: int | None = None
    created_at: datetime
    updated_at: datetime
