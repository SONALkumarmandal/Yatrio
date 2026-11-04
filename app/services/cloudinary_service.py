import os
import cloudinary
import cloudinary.uploader
from fastapi import HTTPException, UploadFile, status

from app.core.config import settings

cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET,
    secure=True,
)

IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}
VIDEO_TYPES = {"video/mp4", "video/webm"}
DOC_TYPES = IMAGE_TYPES | {
    "application/pdf",
    "text/plain",
    "text/markdown",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
}
MEDIA_TYPES = IMAGE_TYPES | VIDEO_TYPES


def upload_file(file: UploadFile, folder: str, allowed: set[str]) -> dict:
    if file.content_type not in allowed:
        raise HTTPException(status.HTTP_415_UNSUPPORTED_MEDIA_TYPE, f"Unsupported file type: {file.content_type}")

    file.file.seek(0, os.SEEK_END)
    size = file.file.tell()
    file.file.seek(0)
    if size > settings.MAX_UPLOAD_MB * 1024 * 1024:
        raise HTTPException(status.HTTP_413_REQUEST_ENTITY_TOO_LARGE, f"File exceeds {settings.MAX_UPLOAD_MB} MB")

    try:
        res = cloudinary.uploader.upload(
            file.file,
            folder=f"{settings.CLOUDINARY_FOLDER}/{folder}",
            resource_type="auto",
            use_filename=True,
            unique_filename=True,
        )
    except Exception as exc:  # cloudinary raises generic errors
        raise HTTPException(status.HTTP_502_BAD_GATEWAY, f"Cloudinary upload failed: {exc}")

    return {
        "url": res["secure_url"],
        "public_id": res["public_id"],
        "resource_type": res.get("resource_type", "image"),
        "format": res.get("format"),
        "bytes": res.get("bytes", size),
        "original_filename": file.filename,
        "content_type": file.content_type,
    }


def delete_asset(public_id: str | None, resource_type: str | None = "image") -> None:
    """Best-effort delete; never block a DB operation on a Cloudinary hiccup."""
    if not public_id:
        return
    try:
        cloudinary.uploader.destroy(public_id, resource_type=resource_type or "image", invalidate=True)
    except Exception:
        pass
