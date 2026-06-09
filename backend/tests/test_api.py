import sys
import os
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from database import Base, get_db
from main import app

engine = create_engine(
    "sqlite://",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSession = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestingSession()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)

ENTRY = {"date": "2026-06-09", "sector": "restaurant", "sales": 1250.50, "customers": 85}


def test_post_log_creates_entry():
    resp = client.post("/api/log", json=ENTRY)
    assert resp.status_code == 201
    body = resp.json()
    assert body["date"] == ENTRY["date"]
    assert body["sales"] == ENTRY["sales"]
    assert body["customers"] == ENTRY["customers"]
    assert "id" in body


def test_post_log_updates_existing():
    client.post("/api/log", json=ENTRY)
    updated = {**ENTRY, "sales": 2000.00, "customers": 120}
    resp = client.post("/api/log", json=updated)
    assert resp.status_code == 201
    body = resp.json()
    assert body["sales"] == 2000.00
    assert body["customers"] == 120
    # same id — no duplicate row
    all_rows = client.get("/api/summary").json()
    assert all_rows["totals"]["entry_count"] == 1


def test_get_summary_returns_totals():
    entry1 = {"date": "2026-06-07", "sector": "restaurant", "sales": 900.00, "customers": 60}
    entry2 = {"date": "2026-06-08", "sector": "restaurant", "sales": 1100.00, "customers": 70}
    client.post("/api/log", json=entry1)
    client.post("/api/log", json=entry2)

    resp = client.get("/api/summary")
    assert resp.status_code == 200
    body = resp.json()
    assert body["totals"]["entry_count"] == 2
    assert body["totals"]["total_sales"] == pytest.approx(2000.00)
    assert body["totals"]["total_customers"] == 130
    assert len(body["time_series"]) == 2
    assert body["time_series"][0]["date"] == "2026-06-07"
