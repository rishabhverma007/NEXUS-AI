"""Unit tests for the LLM provider abstraction (no network, no DB)."""
import math

import pytest

from app.services.llm import (
    generate_mock_embedding,
    is_embedding_configured,
    is_provider_configured,
    MODEL_REGISTRY,
)


def test_mock_embedding_is_deterministic():
    a = generate_mock_embedding("NEXUS AI hybrid search", 1536)
    b = generate_mock_embedding("NEXUS AI hybrid search", 1536)
    assert a == b
    assert len(a) == 1536


def test_mock_embedding_is_normalized():
    vec = generate_mock_embedding("pgvector + GraphRAG", 1536)
    norm = math.sqrt(sum(x * x for x in vec))
    assert abs(norm - 1.0) < 1e-4


def test_mock_embedding_differs_for_different_text():
    a = generate_mock_embedding("vector search", 1536)
    b = generate_mock_embedding("episodic memory", 1536)
    assert a != b


def test_model_registry_covers_frontend_model_ids():
    # The IDs the frontend model picker sends must all resolve to a provider.
    for model_id in ["gpt-4o", "claude-3-5-sonnet", "deepseek-r1", "ollama-llama3"]:
        assert model_id in MODEL_REGISTRY, f"missing {model_id}"


def test_no_provider_configured_without_keys(monkeypatch):
    monkeypatch.setattr("app.core.config.settings.OPENAI_API_KEY", None)
    monkeypatch.setattr("app.core.config.settings.ANTHROPIC_API_KEY", None)
    monkeypatch.setattr("app.core.config.settings.DEEPSEEK_API_KEY", None)
    assert is_provider_configured("openai") is False
    assert is_provider_configured("anthropic") is False
    assert is_provider_configured("deepseek") is False
    assert is_embedding_configured() is False


@pytest.mark.asyncio
async def test_model_availability_false_without_keys(monkeypatch):
    monkeypatch.setattr("app.core.config.settings.OPENAI_API_KEY", None)
    from app.services.llm import is_model_available

    assert await is_model_available("gpt-4o") is False
