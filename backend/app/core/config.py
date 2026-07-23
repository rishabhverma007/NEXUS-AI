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

    # Security & Auth
    SECRET_KEY: str = "nexus-enterprise-secret-key-super-secure-change-in-production-32bytes!"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 Days

    # Database & Vector DB
    DATABASE_URL: str = "sqlite+aiosqlite:///./nexus_ai.db"
    SUPABASE_URL: Optional[str] = None
    SUPABASE_KEY: Optional[str] = None

    # AI Model Providers
    OPENAI_API_KEY: Optional[str] = "mock-openai-key"
    ANTHROPIC_API_KEY: Optional[str] = None
    DEEPSEEK_API_KEY: Optional[str] = None
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    DEFAULT_LLM_PROVIDER: str = "openai"
    DEFAULT_LLM_MODEL: str = "gpt-4o"
    DEFAULT_EMBEDDING_MODEL: str = "text-embedding-3-small"
    EMBEDDING_DIMENSION: int = 1536

    # GraphRAG & Hybrid Search Settings
    HYBRID_SEARCH_TOP_K: int = 10
    GRAPH_SEARCH_MAX_DEPTH: int = 2
    REFLECTION_EVALUATION_THRESHOLD: float = 0.8

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()
