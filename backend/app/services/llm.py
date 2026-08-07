"""
NEXUS AI LLM Provider Abstraction.

Unified gateway to every model provider the product exposes (OpenAI, Anthropic,
DeepSeek, Ollama) via LiteLLM. Real LLM calls happen only when the corresponding
provider key is configured; otherwise the service degrades gracefully to
deterministic mock behaviour so the product never breaks without keys (demo /
local mode).

Model IDs used here are the ones the frontend sends (`gpt-4o`,
`claude-3-5-sonnet`, `deepseek-r1`, `ollama-llama3`) — see MODEL_REGISTRY.
"""
import hashlib
import logging
import time
from typing import AsyncGenerator, Dict, List, Optional

import numpy as np
import litellm

from app.core.config import settings

logger = logging.getLogger(__name__)

# Silence LiteLLM's noisy debug/log output in request handlers.
litellm.suppress_debug_info = True
litellm.drop_params = True

# ---------------------------------------------------------------------------
# Model registry: frontend model IDs -> provider + LiteLLM model string
# ---------------------------------------------------------------------------
MODEL_REGISTRY: Dict[str, Dict[str, str]] = {
    "gpt-4o": {
        "provider": "openai",
        "model": "gpt-4o",
        "env_key": "OPENAI_API_KEY",
    },
    "claude-3-5-sonnet": {
        "provider": "anthropic",
        "model": "anthropic/claude-3-5-sonnet",
        "env_key": "ANTHROPIC_API_KEY",
    },
    "deepseek-r1": {
        "provider": "deepseek",
        "model": "deepseek/deepseek-reasoner",
        "env_key": "DEEPSEEK_API_KEY",
    },
    "ollama-llama3": {
        "provider": "ollama",
        "model": "ollama/llama3.3",
        "env_key": None,
    },
}

_OLLAMA_REACHABLE: Optional[bool] = None
_OLLAMA_PROBE_AT: float = 0.0
_OLLAMA_PROBE_TTL: float = 30.0  # seconds before re-probing a failed Ollama


def _provider_key(env_key: Optional[str]) -> Optional[str]:
    """Resolve the configured API key for a provider env var name."""
    if not env_key:
        return None
    return getattr(settings, env_key, None)


async def _ollama_available() -> bool:
    """
    Cheap reachability probe for a local Ollama daemon (cached; failures
    re-probe after a short TTL so Ollama started later gets picked up).
    """
    global _OLLAMA_REACHABLE, _OLLAMA_PROBE_AT
    now = time.monotonic()
    if _OLLAMA_REACHABLE is True:
        return True
    if _OLLAMA_REACHABLE is False and (now - _OLLAMA_PROBE_AT) < _OLLAMA_PROBE_TTL:
        return False
    try:
        import aiohttp

        async with aiohttp.ClientSession() as session:
            async with session.get(
                f"{settings.OLLAMA_BASE_URL.rstrip('/')}/api/tags",
                timeout=aiohttp.ClientTimeout(total=1.0),
            ) as resp:
                _OLLAMA_REACHABLE = resp.status == 200
    except Exception:
        _OLLAMA_REACHABLE = False
    _OLLAMA_PROBE_AT = time.monotonic()
    return _OLLAMA_REACHABLE


def is_provider_configured(provider: str) -> bool:
    """True when the provider can be called for real (not simulated)."""
    if provider == "ollama":
        return bool(settings.OLLAMA_BASE_URL)
    for entry in MODEL_REGISTRY.values():
        if entry["provider"] == provider:
            return bool(_provider_key(entry["env_key"]))
    return False


async def is_model_available(model_id: str) -> bool:
    """True when the requested model can be reached for real streaming."""
    entry = MODEL_REGISTRY.get(model_id)
    if not entry:
        return False
    if entry["provider"] == "ollama":
        return await _ollama_available()
    return is_provider_configured(entry["provider"])


def is_embedding_configured() -> bool:
    """True when real embedding generation is configured (else mock vectors)."""
    provider = (settings.EMBEDDING_PROVIDER or "openai").lower()
    if provider == "ollama":
        return bool(settings.OLLAMA_BASE_URL)
    return bool(_provider_key("OPENAI_API_KEY"))


# ---------------------------------------------------------------------------
# Mock fallback (deterministic, stable across restarts)
# ---------------------------------------------------------------------------
def generate_mock_embedding(text: str, dim: int = 1536) -> List[float]:
    """
    Deterministic normalized embedding vector for local/demo operation when no
    external embedding provider is configured. Seeded from a stable hash of the
    text so identical text always yields the identical vector.
    """
    seed = int(hashlib.md5(text.encode("utf-8")).hexdigest(), 16) % (2**32)
    rng = np.random.RandomState(seed=seed)
    vec = rng.randn(dim).astype(np.float32)
    norm = np.linalg.norm(vec)
    if norm > 0:
        vec = vec / norm
    return vec.tolist()


# ---------------------------------------------------------------------------
# Chat completions
# ---------------------------------------------------------------------------
async def generate(
    prompt: str,
    system_prompt: str = "",
    model_id: str = "gpt-4o",
    temperature: float = 0.2,
    max_tokens: int = 1024,
    json_mode: bool = False,
) -> Optional[str]:
    """
    Non-streaming completion. Returns None when the provider is not configured
    or the call fails, so callers can fall back to heuristic behaviour.
    """
    entry = MODEL_REGISTRY.get(model_id)
    if not entry:
        return None
    if entry["provider"] == "ollama" and not await _ollama_available():
        return None
    if not is_provider_configured(entry["provider"]):
        return None
    try:
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": prompt},
        ]
        kwargs: Dict = dict(
            model=entry["model"],
            messages=messages,
            temperature=temperature,
            max_tokens=max_tokens,
            timeout=settings.LLM_NONSTREAM_TIMEOUT,
        )
        if json_mode:
            kwargs["response_format"] = {"type": "json_object"}
        resp = await litellm.acompletion(**kwargs)
        content = resp.choices[0].message.content
        return content if content else None
    except Exception as exc:
        logger.warning("LLM generate failed (model=%s): %s", model_id, exc)
        return None


async def stream_chat(
    prompt: str,
    system_prompt: str = "",
    model_id: str = "gpt-4o",
    temperature: float = 0.4,
    max_tokens: int = 2048,
) -> AsyncGenerator[str, None]:
    """
    Streams content deltas from the configured provider. Yields nothing when
    the provider is unavailable, so the orchestrator can fall back to its
    canned response path.
    """
    entry = MODEL_REGISTRY.get(model_id)
    if not entry:
        return
    if entry["provider"] == "ollama" and not await _ollama_available():
        return
    if not is_provider_configured(entry["provider"]):
        return
    try:
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": prompt},
        ]
        resp = await litellm.acompletion(
            model=entry["model"],
            messages=messages,
            temperature=temperature,
            max_tokens=max_tokens,
            timeout=settings.LLM_REQUEST_TIMEOUT,
            stream=True,
        )
        async for chunk in resp:
            if not chunk.choices:
                continue
            delta = chunk.choices[0].delta
            if delta and getattr(delta, "content", None):
                yield delta.content
    except Exception as exc:
        logger.warning("LLM stream_chat failed (model=%s): %s", model_id, exc)
        return


# ---------------------------------------------------------------------------
# Embeddings
# ---------------------------------------------------------------------------
async def embed_texts(texts: List[str]) -> List[List[float]]:
    """
    Batch embedding generation. Uses the configured embedding provider when
    available, otherwise deterministic mock vectors with the configured
    dimension (so schema + cosine math stay consistent either way).
    """
    if is_embedding_configured():
        try:
            embedding_model = settings.DEFAULT_EMBEDDING_MODEL
            if settings.EMBEDDING_PROVIDER.lower() == "ollama" and not embedding_model.startswith("ollama/"):
                embedding_model = f"ollama/{embedding_model}"
            resp = await litellm.aembedding(
                model=embedding_model,
                input=texts,
                timeout=settings.LLM_REQUEST_TIMEOUT,
            )
            return [item["embedding"] for item in resp.data]
        except Exception as exc:
            logger.warning("Embedding provider failed, falling back to mock: %s", exc)
    return [
        generate_mock_embedding(text, settings.EMBEDDING_DIMENSION)
        for text in texts
    ]
