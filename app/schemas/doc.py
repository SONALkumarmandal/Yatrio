from datetime import datetime

from pydantic import BaseModel, ConfigDict


class DocOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    owner_id: int
    project_id: int | None
    title: str
    description: str | None
    content: str | None
    file_url: str | None
    file_name: str | None
    file_size: int | None
    mime_type: str | None
    created_at: datetime
