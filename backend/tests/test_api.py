import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import settings
from app.core.database import Base, get_db
from app.core.security import hash_password
from app.main import app
from app.models import User
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
    token_data = login_res.json()
    assert "access_token" in token_data
    token = token_data["access_token"]

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
