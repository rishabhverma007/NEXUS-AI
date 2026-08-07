from typing import List, Optional
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "NEXUS AI Enterprise Knowledge OS"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Environment & Host Settings
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    ALLOWED_ORIGINS: List[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]

    # Security & Auth — SECRET_KEY is env-only; there is NO safe default in code.
    # A generated development fallback is used only when ENVIRONMENT != "production".
    SECRET_KEY: Optional[str] = None
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 Days

    # Database & Vector DB
    DATABASE_URL: str = "sqlite+aiosqlite:///./nexus_ai.db"
    SUPABASE_URL: Optional[str] = None
    SUPABASE_KEY: Optional[str] = None

    # AI Model Providers — real LLM calls are enabled only when a key is set;
    # with all keys unset the services fall back to deterministic simulation.
    OPENAI_API_KEY: Optional[str] = None
    ANTHROPIC_API_KEY: Optional[str] = None
    DEEPSEEK_API_KEY: Optional[str] = None
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    DEFAULT_LLM_PROVIDER: str = "openai"
    DEFAULT_LLM_MODEL: str = "gpt-4o"
    LLM_REQUEST_TIMEOUT: int = 120
    LLM_NONSTREAM_TIMEOUT: int = 30  # router/reflection completions inside SSE streams

    # Embeddings
    EMBEDDING_PROVIDER: str = "openai"  # openai | ollama
    DEFAULT_EMBEDDING_MODEL: str = "text-embedding-3-small"
    EMBEDDING_DIMENSION: int = 1536

    # Rate Limiting — in-memory sliding window (single instance). Disable only
    # for local demos or when a reverse proxy already enforces limits.
    RATE_LIMIT_ENABLED: bool = True
    # Only honor X-Forwarded-For when the app sits behind a trusted reverse
    # proxy. When False (default) the raw socket peer is used, so clients
    # cannot spoof the header to bypass per-IP limits.
    RATE_LIMIT_TRUST_FORWARDED_HEADERS: bool = False

    # GraphRAG & Hybrid Search Settings
    HYBRID_SEARCH_TOP_K: int = 10
    GRAPH_SEARCH_MAX_DEPTH: int = 2
    REFLECTION_EVALUATION_THRESHOLD: float = 0.8

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    _dev_secret_key: Optional[str] = None

    @property
    def effective_secret_key(self) -> str:
        """
        Resolves SECRET_KEY with a safe failure mode:
        - Production REQUIRES an explicit SECRET_KEY (no silent default).
        - Development falls back to a generated random key so the stack still
          runs locally without configuration.
        """
        if self.SECRET_KEY:
            return self.SECRET_KEY
        if (self.ENVIRONMENT or "development").lower() == "production":
            raise RuntimeError(
                "SECRET_KEY is required in production. Set it via the environment "
                "(docker-compose passes SECRET_KEY; see backend/.env.example)."
            )
        # Stable per-process dev fallback (a fresh key per call would break JWT:
        # tokens encoded with one key could never be decoded with the next).
        import secrets

        if self._dev_secret_key is None:
            self._dev_secret_key = secrets.token_urlsafe(48)
        return self._dev_secret_key


settings = Settings()
