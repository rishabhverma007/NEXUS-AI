"""End-to-end auth tests: register, login, /auth/me — against an in-memory DB."""
import pytest
import pytest_asyncio
import httpx
from sqlalchemy import select
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy.pool import StaticPool

from app.core.db import Base, get_db
from app.models.domain import User, Workspace


@pytest_asyncio.fixture
async def auth_client(monkeypatch):
    """FastAPI app wired to a fresh in-memory SQLite DB, rate limiting off."""
    engine = create_async_engine(
        "sqlite+aiosqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    Session = async_sessionmaker(bind=engine, expire_on_commit=False)

    async def override_get_db():
        async with Session() as session:
            try:
                yield session
                await session.commit()
            except Exception:
                await session.rollback()
                raise

    from app.main import app

    app.dependency_overrides[get_db] = override_get_db
    monkeypatch.setattr("app.core.config.settings.RATE_LIMIT_ENABLED", False)

    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        yield client, Session

    app.dependency_overrides.clear()


REGISTER_PAYLOAD = {
    "email": "architect@nexus.ai",
    "full_name": "Ada Architect",
    "password": "strong-password-123",
}


@pytest.mark.asyncio
async def test_register_creates_user_workspace_and_token(auth_client):
    client, Session = auth_client
    resp = await client.post("/api/v1/auth/register", json=REGISTER_PAYLOAD)
    assert resp.status_code == 201
    body = resp.json()
    assert body["access_token"]
    assert body["token_type"] == "bearer"
    assert body["workspace_id"]
    assert body["user"]["email"] == REGISTER_PAYLOAD["email"]
    assert body["user"]["full_name"] == "Ada Architect"

    async with Session() as session:
        users = (await session.execute(select(User))).scalars().all()
        assert len(users) == 1
        assert users[0].email == REGISTER_PAYLOAD["email"]
        # Password must be hashed, never stored in plain text.
        assert users[0].hashed_password != REGISTER_PAYLOAD["password"]

        workspaces = (await session.execute(select(Workspace))).scalars().all()
        assert len(workspaces) == 1
        assert workspaces[0].id == body["workspace_id"]
        assert workspaces[0].owner_id == users[0].id


@pytest.mark.asyncio
async def test_register_duplicate_email_conflicts(auth_client):
    client, _ = auth_client
    first = await client.post("/api/v1/auth/register", json=REGISTER_PAYLOAD)
    assert first.status_code == 201
    second = await client.post("/api/v1/auth/register", json=REGISTER_PAYLOAD)
    assert second.status_code == 409
    assert "already exists" in second.json()["detail"]


@pytest.mark.asyncio
async def test_register_rejects_short_password(auth_client):
    client, _ = auth_client
    payload = {**REGISTER_PAYLOAD, "password": "short"}
    resp = await client.post("/api/v1/auth/register", json=payload)
    assert resp.status_code == 422


@pytest.mark.asyncio
async def test_login_returns_token_for_valid_credentials(auth_client):
    client, _ = auth_client
    await client.post("/api/v1/auth/register", json=REGISTER_PAYLOAD)
    resp = await client.post(
        "/api/v1/auth/login",
        json={"email": REGISTER_PAYLOAD["email"], "password": REGISTER_PAYLOAD["password"]},
    )
    assert resp.status_code == 200
    body = resp.json()
    assert body["access_token"]
    assert body["user"]["email"] == REGISTER_PAYLOAD["email"]


@pytest.mark.asyncio
async def test_login_wrong_password_unauthorized(auth_client):
    client, _ = auth_client
    await client.post("/api/v1/auth/register", json=REGISTER_PAYLOAD)
    resp = await client.post(
        "/api/v1/auth/login",
        json={"email": REGISTER_PAYLOAD["email"], "password": "wrong-password"},
    )
    assert resp.status_code == 401


@pytest.mark.asyncio
async def test_login_unknown_email_unauthorized(auth_client):
    client, _ = auth_client
    resp = await client.post(
        "/api/v1/auth/login",
        json={"email": "nobody@nexus.ai", "password": "whatever-123"},
    )
    assert resp.status_code == 401


@pytest.mark.asyncio
async def test_me_requires_valid_token(auth_client):
    client, _ = auth_client
    # No token -> strict 401 (no dev fallback on /auth/me).
    resp = await client.get("/api/v1/auth/me")
    assert resp.status_code == 401

    # Garbage token -> 401.
    resp = await client.get(
        "/api/v1/auth/me", headers={"Authorization": "Bearer not-a-jwt"}
    )
    assert resp.status_code == 401


@pytest.mark.asyncio
async def test_me_returns_current_user(auth_client):
    client, _ = auth_client
    reg = await client.post("/api/v1/auth/register", json=REGISTER_PAYLOAD)
    token = reg.json()["access_token"]
    resp = await client.get(
        "/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"}
    )
    assert resp.status_code == 200
    assert resp.json()["email"] == REGISTER_PAYLOAD["email"]
    assert resp.json()["is_active"] is True
