"""Stats endpoint tests: live counts + recent activity from a seeded workspace."""
import pytest
import pytest_asyncio
import httpx
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy.pool import StaticPool

from app.core.db import Base, get_db


@pytest_asyncio.fixture
async def stats_client(monkeypatch):
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
        yield client

    app.dependency_overrides.clear()


@pytest.mark.asyncio
async def test_stats_reflect_seeded_corpus(stats_client):
    # Registering seeds the full enterprise corpus into the user's workspace.
    reg = await stats_client.post(
        "/api/v1/auth/register",
        json={
            "email": "stats@demo.nexus",
            "full_name": "Stats Tester",
            "password": "stats-password-123",
        },
    )
    token = reg.json()["access_token"]

    resp = await stats_client.get(
        "/api/v1/stats", headers={"Authorization": f"Bearer {token}"}
    )
    assert resp.status_code == 200
    body = resp.json()

    counts = body["counts"]
    assert counts["documents"] == 6
    assert counts["chunks"] > 0
    assert counts["graph_entities"] == 8
    assert counts["graph_relations"] == 9
    assert counts["memories"] == 4
    assert counts["threads"] == 0
    assert counts["messages"] == 0
    assert counts["workspaces"] == 1
    assert body["avg_reflection_score"] is None

    # Recent activity should list the ingested documents.
    activities = body["recent_activity"]
    assert activities, "recent_activity should not be empty"
    assert any(a["type"] == "document" for a in activities)
    assert all("timestamp" in a for a in activities)


@pytest.mark.asyncio
async def test_stats_reflects_chat_activity(stats_client):
    reg = await stats_client.post(
        "/api/v1/auth/register",
        json={
            "email": "chat-stats@demo.nexus",
            "full_name": "Chat Stats",
            "password": "stats-password-123",
        },
    )
    token = reg.json()["access_token"]

    await stats_client.post(
        "/api/v1/chat/stream",
        headers={"Authorization": f"Bearer {token}"},
        json={"content": "Tell me about pgvector", "model": "gpt-4o", "agent_mode": "agentic_rag"},
    )

    resp = await stats_client.get(
        "/api/v1/stats", headers={"Authorization": f"Bearer {token}"}
    )
    body = resp.json()
    assert body["counts"]["threads"] == 1
    assert body["counts"]["messages"] == 2
    assert body["avg_reflection_score"] is not None
    assert any(a["type"] == "thread" for a in body["recent_activity"])
