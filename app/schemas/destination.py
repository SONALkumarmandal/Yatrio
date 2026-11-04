from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict


class DestinationOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    description: str | None
    country: str | None
    city: str | None
    price: Decimal | None
    duration_days: int | None
    is_published: bool
    media: list[dict]
    created_by: int | None
    created_at: datetime
    updated_at: datetime
