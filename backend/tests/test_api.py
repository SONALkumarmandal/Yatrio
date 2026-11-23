import secrets

import pytest
from fastapi.testclient import TestClient
from pydantic import ValidationError
from sqlalchemy import create_engine, select
from sqlalchemy.orm import sessionmaker

from app.core.config import Settings, settings
from app.core.database import Base, get_db
from app.core.security import hash_password
from app.main import app, seed_first_admin_if_missing
from app.models import Destination, User
from app.routers.destinations import seed_destinations_if_empty

TEST_DB_URL = "sqlite:///./test_yatrio.db"
test_engine = create_engine(TEST_DB_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


@pytest.fixture(scope="session", autouse=True)
def setup_database():
    Base.metadata.drop_all(bind=test_engine)
    Base.metadata.create_all(bind=test_engine)
    with TestingSessionLocal() as db:
        admin_user = User(
            email="admin_test@yatrio.com",
            username="admin_test",
            full_name="Admin Test",
            hashed_password=hash_password("Admin12345!"),
            role="admin",
        )
        db.add(admin_user)
        seed_destinations_if_empty(db)
        db.commit()
    yield
    Base.metadata.drop_all(bind=test_engine)


@pytest.fixture
def client():
    return TestClient(app)


def test_health_check(client):
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json() == {"status": "ok"}


def test_cors_normalizes_vercel_origin():
    config = Settings(
        JWT_SECRET_KEY=secrets.token_urlsafe(48),
        ENVIRONMENT="production",
        CORS_ORIGINS="https://yatrio.vercel.app/",
        FIRST_ADMIN_EMAIL="",
        FIRST_ADMIN_PASSWORD="",
        _env_file=None,
    )
    assert config.cors_origins_list == ["https://yatrio.vercel.app"]
    assert config.FIRST_ADMIN_EMAIL is None
    assert config.FIRST_ADMIN_PASSWORD is None


def test_admin_settings_trim_email_and_username():
    config = Settings(
        JWT_SECRET_KEY=secrets.token_urlsafe(48),
        FIRST_ADMIN_EMAIL=" admin@example.test ",
        FIRST_ADMIN_USERNAME=" admin ",
        FIRST_ADMIN_PASSWORD="a-unique-admin-password-long-enough",
        _env_file=None,
    )
    assert config.FIRST_ADMIN_EMAIL == "admin@example.test"
    assert config.FIRST_ADMIN_USERNAME == "admin"


def test_settings_rejects_weak_jwt_secret():
    with pytest.raises(ValidationError):
        Settings(JWT_SECRET_KEY="short", _env_file=None)


def test_production_settings_reject_http_origins():
    with pytest.raises(ValidationError):
        Settings(
            JWT_SECRET_KEY=secrets.token_urlsafe(48),
            ENVIRONMENT="production",
            CORS_ORIGINS="http://localhost:5173",
            _env_file=None,
        )


def test_admin_bootstrap_skips_existing_admin_username(monkeypatch):
    monkeypatch.setattr(settings, "FIRST_ADMIN_EMAIL", "new-admin@example.test")
    monkeypatch.setattr(settings, "FIRST_ADMIN_USERNAME", "admin")
    monkeypatch.setattr(settings, "FIRST_ADMIN_PASSWORD", "a-unique-admin-password-long-enough")

    with TestingSessionLocal() as db:
        existing_admin = User(
            email="existing-admin@example.test",
            username="admin",
            hashed_password=hash_password("Existing-Admin-Password-2026!"),
            role="admin",
        )
        db.add(existing_admin)
        db.commit()

        seed_first_admin_if_missing(db)

        assert db.scalar(
            select(User).where(User.email == "new-admin@example.test")
        ) is None

        db.delete(existing_admin)
        db.commit()


def test_auth_registration_and_login(client):
    # Register new user
    reg_res = client.post(
        "/api/auth/register",
        json={
            "email": "traveler@yatrio.com",
            "username": "traveler1",
            "full_name": "Happy Traveler",
            "password": "Password123!",
        },
    )
    assert reg_res.status_code == 201
    user_data = reg_res.json()
    assert user_data["email"] == "traveler@yatrio.com"
    assert user_data["username"] == "traveler1"

    # Login
    login_res = client.post(
        "/api/auth/login",
        json={"email": "traveler@yatrio.com", "password": "Password123!"},
    )
    assert login_res.status_code == 200
    assert "set-cookie" not in login_res.headers
    token_data = login_res.json()
    assert "access_token" in token_data
    token = token_data["access_token"]

    assert client.get("/api/users/me").status_code == 401

    # Verify /api/users/me
    headers = {"Authorization": f"Bearer {token}"}
    me_res = client.get("/api/users/me", headers=headers)
    assert me_res.status_code == 200
    assert me_res.json()["username"] == "traveler1"


def test_public_destinations(client):
    res = client.get("/api/destinations")
    assert res.status_code == 200
    data = res.json()
    assert "items" in data
    assert data["total"] >= 6
    assert any(item["slug"] == "kerala" for item in data["items"])

    # Test single destination detail
    detail_res = client.get("/api/destinations/kerala")
    assert detail_res.status_code == 200
    assert detail_res.json()["title"] == "Kerala"

    # Test region filter
    region_res = client.get("/api/destinations?region=South")
    assert region_res.status_code == 200
    assert any(item["region"] == "South" for item in region_res.json()["items"])

    # Test search query
    search_res = client.get("/api/destinations?search=backwaters")
    assert search_res.status_code == 200
    assert search_res.json()["total"] >= 1


def test_unpublished_destination_is_not_public_by_id(client):
    with TestingSessionLocal() as db:
        destination = Destination(
            slug="unpublished-security-test",
            title="Unpublished test destination",
            is_published=False,
        )
        db.add(destination)
        db.commit()
        db.refresh(destination)
        destination_id = destination.id

    response = client.get(f"/api/destinations/{destination_id}")
    assert response.status_code == 404


def test_admin_destinations(client):
    # Login as admin
    login_res = client.post(
        "/api/auth/login",
        json={"email": "admin_test@yatrio.com", "password": "Admin12345!"},
    )
    assert login_res.status_code == 200
    admin_token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {admin_token}"}

    # Create new destination via admin form
    create_res = client.post(
        "/api/admin/destinations",
        headers=headers,
        data={
            "title": "Varanasi Ghats",
            "slug": "varanasi",
            "country": "India",
            "city": "Varanasi",
            "state": "Uttar Pradesh",
            "region": "North",
            "label": "Spiritual calm",
            "price": "16500",
            "duration_days": "4",
            "description": "Dawn boat rides and serene evening aarti on the Ganga.",
            "is_published": "true",
        },
    )
    assert create_res.status_code == 201
    new_dest = create_res.json()
    dest_id = new_dest["id"]
    assert new_dest["slug"] == "varanasi"

    # Verify public can query it
    public_res = client.get("/api/destinations/varanasi")
    assert public_res.status_code == 200
    assert public_res.json()["title"] == "Varanasi Ghats"

    # Delete destination as admin
    del_res = client.delete(f"/api/admin/destinations/{dest_id}", headers=headers)
    assert del_res.status_code == 204


def test_user_projects(client):
    # Login as traveler
    login_res = client.post(
        "/api/auth/login",
        json={"email": "traveler@yatrio.com", "password": "Password123!"},
    )
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Create trip project
    proj_res = client.post(
        "/api/projects",
        headers=headers,
        json={
            "name": "My Winter Kerala Honeymoon",
            "description": "Alleppey + Munnar for 6 days",
            "status": "draft",
            "data": {"travelers": 2, "dates": "2026-12-10", "budget": 45000},
        },
    )
    assert proj_res.status_code == 201
    project_id = proj_res.json()["id"]

    # List projects
    list_res = client.get("/api/projects", headers=headers)
    assert list_res.status_code == 200
    assert any(p["id"] == project_id for p in list_res.json()["items"])
