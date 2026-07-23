from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, EmailStr


# Auth & User Schemas
class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    avatar_url: Optional[str] = None


class UserCreate(UserBase):
    password: str


class UserResponse(UserBase):
    id: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    workspace_id: str
    user: UserResponse


# Workspace Schemas
class WorkspaceBase(BaseModel):
    name: str
    description: Optional[str] = None


class WorkspaceCreate(WorkspaceBase):
    pass


class WorkspaceResponse(WorkspaceBase):
    id: str
    slug: str
    owner_id: str
    settings: Dict[str, Any] = Field(default_factory=dict)
    created_at: datetime

    class Config:
        from_attributes = True


# Chat & Agent Schemas
class ChatMessageCreate(BaseModel):
    thread_id: Optional[str] = None
    workspace_id: str = "ws_default_01"
    content: str
    model: str = "gpt-4o"
    agent_mode: str = "agentic_rag"  # agentic_rag, graph_rag, memory_search, deep_research
    stream: bool = True


class AgentStep(BaseModel):
    step_id: str
    agent_name: str  # RouterAgent, VectorRAGAgent, GraphRAGAgent, ReflectionAgent, CodeAgent
    status: str      # pending, running, completed, skipped, failed
    thought: str
    output: Optional[Any] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class ChatMessageResponse(BaseModel):
    id: str
    thread_id: str
    role: str
    content: str
    agent_steps: List[AgentStep] = Field(default_factory=list)
    citations: List[Dict[str, Any]] = Field(default_factory=list)
    reflection_score: Optional[float] = None
    created_at: datetime


# Knowledge Ingestion Schemas
class DocumentCreate(BaseModel):
    title: str
    content: str
    source_type: str = "markdown"  # file, web, repo, markdown
    metadata: Dict[str, Any] = Field(default_factory=dict)


class DocumentResponse(BaseModel):
    id: str
    workspace_id: str
    title: str
    source_type: str
    status: str
    chunk_count: int
    created_at: datetime

    class Config:
        from_attributes = True


class DocumentChunkResponse(BaseModel):
    id: str
    document_id: str
    chunk_index: int
    content: str
    token_count: int
    metadata: Dict[str, Any]


# GraphRAG Schemas
class KGEntityResponse(BaseModel):
    id: str
    name: str
    entity_type: str
    description: str
    properties: Dict[str, Any] = Field(default_factory=dict)


class KGRelationResponse(BaseModel):
    id: str
    source_entity_id: str
    target_entity_id: str
    relation_type: str
    weight: float
    description: str


class KGGraphPayload(BaseModel):
    nodes: List[KGEntityResponse]
    edges: List[KGRelationResponse]


# Memory Schemas
class MemoryCreate(BaseModel):
    memory_type: str  # episodic, semantic, preference, entity
    key: str
    value: str


class MemoryResponse(MemoryCreate):
    id: str
    workspace_id: str
    user_id: str
    confidence_score: float
    created_at: datetime

    class Config:
        from_attributes = True
