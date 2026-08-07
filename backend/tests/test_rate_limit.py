"""Rate limiter tests: sliding-window semantics + 429 enforcement via middleware."""
import time

import pytest
import pytest_asyncio
import httpx


# --- RateLimiter unit tests ---------------------------------------------------


def test_allows_requests_up_to_limit():
    from app.core.rate_limit import RateLimiter

    limiter = RateLimiter()
    for _ in range(5):
        limiter.check("k", 5, 60)  # no raise


def test_blocks_requests_beyond_limit():
    from app.core.rate_limit import RateLimiter, RateLimitExceeded

    limiter = RateLimiter()
    for _ in range(5):
        limiter.check("k", 5, 60)
    with pytest.raises(RateLimitExceeded) as exc_info:
        limiter.check("k", 5, 60)
    assert exc_info.value.retry_after >= 1


def test_buckets_are_independent_per_key():
    from app.core.rate_limit import RateLimiter

    limiter = RateLimiter()
    for _ in range(3):
        limiter.check("a", 3, 60)
    # Different key is unaffected.
    limiter.check("b", 3, 60)


def test_window_expires_after_duration():
    from app.core.rate_limit import RateLimiter

    limiter = RateLimiter()
    for _ in range(2):
        limiter.check("k", 2, 1)
    with pytest.raises(Exception):
        limiter.check("k", 2, 1)
    # Fast-forward past the 1s window; requests become allowed again.
    time.sleep(1.05)
    limiter.check("k", 2, 1)


def test_clear_resets_state():
    from app.core.rate_limit import RateLimiter

    limiter = RateLimiter()
    for _ in range(2):
        limiter.check("k", 2, 60)
    limiter.clear()
    limiter.check("k", 2, 60)


# --- Middleware integration tests ---------------------------------------------

AUTH_ME_PATH = "/api/v1/auth/me"


@pytest_asyncio.fixture
async def rate_client(monkeypatch):
    """Real app with a tiny /auth/me rule and a fresh limiter."""
    from app.main import app
    import app.core.rate_limit as rate_limit

    monkeypatch.setattr(
        rate_limit,
        "RATE_LIMIT_RULES",
        {AUTH_ME_PATH: (2, 60)},
    )
    monkeypatch.setattr(rate_limit, "DEFAULT_RULE", (100, 60))
    rate_limit.limiter.clear()

    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        yield client

    rate_limit.limiter.clear()


@pytest.mark.asyncio
async def test_middleware_returns_429_after_limit(rate_client):
    # /auth/me without a token -> 401 (strict auth), but the rate limiter runs
    # first, so the third request must be throttled regardless of auth result.
    first = await rate_client.get(AUTH_ME_PATH)
    second = await rate_client.get(AUTH_ME_PATH)
    assert first.status_code == 401
    assert second.status_code == 401

    third = await rate_client.get(AUTH_ME_PATH)
    assert third.status_code == 429
    assert "Retry-After" in third.headers
    assert third.json()["detail"]


@pytest.mark.asyncio
async def test_rate_limit_response_has_retry_after(rate_client):
    await rate_client.get(AUTH_ME_PATH)
    await rate_client.get(AUTH_ME_PATH)
    resp = await rate_client.get(AUTH_ME_PATH)
    assert resp.status_code == 429
    assert int(resp.headers["Retry-After"]) >= 1


@pytest.mark.asyncio
async def test_exempt_paths_are_not_throttled(rate_client):
    # /health is exempt — hammer it well beyond the tiny /auth/me rule.
    for _ in range(6):
        resp = await rate_client.get("/api/v1/health")
        assert resp.status_code == 200
