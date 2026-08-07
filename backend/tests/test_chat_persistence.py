"""Chat persistence tests: /chat/stream saves threads + messages; history loads."""
import json

import pytest
import pytest_asyncio
import httpx
from sqlalchemy import select
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy.pool import StaticPool

from app.core.db import Base, get_db
from app.models.domain import ChatMessage, ChatThread


@pytest_asyncio.fixture
async def chat_client(monkeypatch):
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


async def _register(client: httpx.AsyncClient) -> str:
    resp = await client.post(
        "/api/v1/auth/register",
        json={
            "email": "chat@demo.nexus",
            "full_name": "Chat Tester",
            "password": "chat-password-123",
        },
    )
    assert resp.status_code == 201
    return resp.json()["access_token"]


async def _stream_once(
    client: httpx.AsyncClient, token: str, query: str, thread_id: str | None = None
) -> httpx.Response:
    return await client.post(
        "/api/v1/chat/stream",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "thread_id": thread_id,
            "content": query,
            "model": "gpt-4o",
            "agent_mode": "agentic_rag",
            "stream": True,
        },
    )


@pytest.mark.asyncio
async def test_stream_creates_thread_and_persists_exchange(chat_client):
    client, Session = chat_client
    token = await _register(client)

    resp = await _stream_once(client, token, "What is hybrid search?")
    assert resp.status_code == 200

    # The SSE body must carry the thread event + a done event.
    body = resp.text
    assert '"type": "thread"' in body
    assert '"type": "done"' in body

    async with Session() as session:
        threads = (await session.execute(select(ChatThread))).scalars().all()
        assert len(threads) == 1
        thread = threads[0]
        assert "hybrid search" in thread.title.lower()

        messages = (
            await session.execute(
                select(ChatMessage).where(ChatMessage.thread_id == thread.id)
            )
        ).scalars().all()
        roles = [m.role for m in messages]
        assert roles == ["user", "assistant"]
        assert messages[0].content == "What is hybrid search?"
        assert len(messages[1].content) > 0
        assert messages[1].agent_steps_json  # agent steps captured
        assert messages[1].reflection_score is not None


@pytest.mark.asyncio
async def test_history_endpoint_returns_saved_messages(chat_client):
    client, Session = chat_client
    token = await _register(client)
    await _stream_once(client, token, "Explain GraphRAG traversal")

    async with Session() as session:
        thread_id = (await session.execute(select(ChatThread.id))).scalar_one()

    resp = await client.get(
        f"/api/v1/chat/threads/{thread_id}/messages",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert resp.status_code == 200
    messages = resp.json()
    assert len(messages) == 2
    assert messages[0]["role"] == "user"
    assert messages[1]["role"] == "assistant"
    assert messages[1]["content"]
    assert "citations" in messages[1]
    assert "reflection_score" in messages[1]


@pytest.mark.asyncio
async def test_stream_continues_existing_thread(chat_client):
    client, Session = chat_client
    token = await _register(client)

    first = await _stream_once(client, token, "First question")
    thread_id = json.loads(
        [line for line in first.text.split("\n") if line.startswith("data:")][0][5:]
    )["thread_id"]

    second = await _stream_once(client, token, "Second question", thread_id=thread_id)
    assert second.status_code == 200

    async with Session() as session:
        threads = (await session.execute(select(ChatThread))).scalars().all()
        assert len(threads) == 1  # same thread, not a new one
        messages = (
            await session.execute(
                select(ChatMessage).where(ChatMessage.thread_id == thread_id)
            )
        ).scalars().all()
        assert len(messages) == 4  # 2 exchanges


@pytest.mark.asyncio
async def test_history_rejects_foreign_thread(chat_client):
    client, Session = chat_client
    token = await _register(client)
    resp = await client.get(
        "/api/v1/chat/threads/does-not-exist/messages",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert resp.status_code == 404
