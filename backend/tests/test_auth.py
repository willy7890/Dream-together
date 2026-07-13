import os
import sys

os.environ["DATABASE_URL"] = "sqlite:///./test.db"
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from fastapi.testclient import TestClient  # noqa: E402

from app.main import app  # noqa: E402

def test_register_and_login():
    with TestClient(app) as client:
        email = "test_user@example.com"
        r = client.post("/api/v1/auth/register", json={"full_name": "Test User", "email": email, "password": "secret123"})
        assert r.status_code in (201, 400)  # 400 if already exists from a prior run

        r = client.post("/api/v1/auth/login", json={"email": email, "password": "secret123"})
        assert r.status_code == 200
        assert "access_token" in r.json()


def test_health():
    with TestClient(app) as client:
        r = client.get("/health")
        assert r.status_code == 200
