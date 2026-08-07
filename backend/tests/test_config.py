"""Tests for the env-only SECRET_KEY behaviour."""
import pytest


def test_effective_secret_key_returns_explicit_value(monkeypatch):
    from app.core.config import settings

    monkeypatch.setattr(settings, "SECRET_KEY", "test-secret-123")
    assert settings.effective_secret_key == "test-secret-123"


def test_effective_secret_key_raises_in_production(monkeypatch):
    from app.core.config import settings

    monkeypatch.setattr(settings, "SECRET_KEY", None)
    monkeypatch.setattr(settings, "ENVIRONMENT", "production")
    with pytest.raises(RuntimeError):
        settings.effective_secret_key


def test_effective_secret_key_generates_dev_fallback(monkeypatch):
    from app.core.config import settings

    monkeypatch.setattr(settings, "SECRET_KEY", None)
    monkeypatch.setattr(settings, "ENVIRONMENT", "development")
    key = settings.effective_secret_key
    assert isinstance(key, str) and len(key) >= 32


def test_dev_fallback_key_is_stable_across_calls(monkeypatch):
    """A fresh key per access would break JWT (encode/decode mismatch)."""
    from app.core.config import settings

    monkeypatch.setattr(settings, "SECRET_KEY", None)
    monkeypatch.setattr(settings, "ENVIRONMENT", "development")
    monkeypatch.setattr(settings, "_dev_secret_key", None, raising=False)
    first = settings.effective_secret_key
    second = settings.effective_secret_key
    assert first == second
    assert len(first) >= 32


def test_health_endpoint_registered():
    from app.main import app

    paths = {route.path for route in app.routes}
    assert "/api/v1/health" in paths
    assert "/api/v1/chat/stream" in paths
