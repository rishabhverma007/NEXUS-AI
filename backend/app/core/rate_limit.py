"""
API rate limiting — dependency-free, single-instance sliding-window limiter.

Keeps the stack lean (no slowapi/limits dependency, no redis requirement) while
giving real per-IP throttling for auth abuse vectors (login brute-force,
signup spam) and a sane ceiling on general API traffic. Designed for a
single-process deployment (uvicorn workers or a single Docker replica); for
horizontally scaled deployments swap this for a Redis-backed limiter.

Limits are expressed as (max_requests, window_seconds) keyed by URL prefix.
Sliding-window semantics: a request is allowed only if fewer than `max_requests`
requests from the same client occurred in the trailing `window_seconds`.

The client key is the socket peer IP by default — X-Forwarded-For is honored
ONLY when RATE_LIMIT_TRUST_FORWARDED_HEADERS is set, so clients cannot spoof
the header to rotate past per-IP limits.
"""
import time
from collections import defaultdict, deque
from typing import Deque, Dict, Optional, Tuple

from fastapi import Request
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware

from app.core.config import settings

# --- Policy ------------------------------------------------------------------
# route-prefix -> (max_requests, window_seconds)
RATE_LIMIT_RULES: Dict[str, Tuple[int, int]] = {
    "/api/v1/auth/login": (10, 60),       # 10 login attempts / minute / IP
    "/api/v1/auth/register": (5, 3600),   # 5 signups / hour / IP
    "/api/v1/auth": (30, 60),             # other auth endpoints
}

# Fallback applied to every other API route (and unknown paths).
DEFAULT_RULE: Tuple[int, int] = (240, 60)  # 240 requests / minute / IP

# Paths that are always exempt (no auth, no sensitive work).
EXEMPT_PATHS: Tuple[str, ...] = ("/", "/api/v1/health", "/docs", "/redoc", "/openapi.json")

RATE_LIMIT_EXCEEDED_MESSAGE = "Rate limit exceeded. Please try again later."


class RateLimitExceeded(Exception):
    def __init__(self, retry_after: int):
        super().__init__(RATE_LIMIT_EXCEEDED_MESSAGE)
        self.retry_after = retry_after


class RateLimiter:
    """Sliding-window tracker keyed by an arbitrary client key."""

    def __init__(self) -> None:
        # key -> timestamps of recent requests (monotonic seconds)
        self._hits: Dict[str, Deque[float]] = defaultdict(deque)
        self._last_cleanup: float = time.monotonic()

    def _prune(self, key: str, now: float, window: float) -> None:
        queue = self._hits[key]
        while queue and now - queue[0] > window:
            queue.popleft()

    def _sweep(self, now: float) -> None:
        """Drop empty buckets at most once per minute to bound memory."""
        if now - self._last_cleanup < 60:
            return
        self._last_cleanup = now
        for key in [k for k, q in self._hits.items() if not q]:
            del self._hits[key]

    def check(self, key: str, limit: int, window: int) -> None:
        now = time.monotonic()
        self._prune(key, now, float(window))
        queue = self._hits[key]
        if len(queue) >= limit:
            retry_after = max(1, int(window - (now - queue[0])) + 1)
            raise RateLimitExceeded(retry_after)
        queue.append(now)
        self._sweep(now)

    def clear(self) -> None:
        self._hits.clear()
        self._last_cleanup = time.monotonic()


def client_identifier(request: Request) -> str:
    """
    Client key for rate limiting.

    The socket peer is used unless the deployment explicitly opts into trusting
    X-Forwarded-For (RATE_LIMIT_TRUST_FORWARDED_HEADERS=true) — a reverse proxy
    sets the header only then. This prevents a client from sending a spoofed
    header to rotate identities and bypass per-IP limits.
    """
    if settings.RATE_LIMIT_TRUST_FORWARDED_HEADERS:
        forwarded = request.headers.get("x-forwarded-for")
        if forwarded:
            first_hop = forwarded.split(",")[0].strip()
            if first_hop:
                return first_hop
    if request.client is not None and request.client.host:
        return request.client.host
    return "unknown"


def resolve_rule(path: str) -> Tuple[int, int]:
    """Longest-prefix match against the configured rules; default rule otherwise."""
    best: Optional[Tuple[int, int]] = None
    best_len = -1
    for prefix, rule in RATE_LIMIT_RULES.items():
        if path.startswith(prefix) and len(prefix) > best_len:
            best = rule
            best_len = len(prefix)
    return best or DEFAULT_RULE


limiter = RateLimiter()


class RateLimitMiddleware(BaseHTTPMiddleware):
    """
    FastAPI/Starlette middleware enforcing the policy above.

    - OPTIONS preflight and EXEMPT_PATHS pass through untouched.
    - Rejected requests get 429 + Retry-After (seconds).
    - Allowed requests get X-RateLimit-Limit so clients can be polite.
    """

    async def dispatch(self, request: Request, call_next):
        if not settings.RATE_LIMIT_ENABLED or request.method == "OPTIONS":
            return await call_next(request)

        path = request.url.path
        if path in EXEMPT_PATHS:
            return await call_next(request)

        limit, window = resolve_rule(path)
        route_hint = path.split("/api/v1")[-1] if "/api/v1" in path else path
        key = f"{route_hint}:{client_identifier(request)}"

        try:
            limiter.check(key, limit, window)
        except RateLimitExceeded as exc:
            return JSONResponse(
                status_code=429,
                content={"detail": RATE_LIMIT_EXCEEDED_MESSAGE},
                headers={"Retry-After": str(exc.retry_after)},
            )

        response = await call_next(request)
        response.headers["X-RateLimit-Limit"] = str(limit)
        return response
