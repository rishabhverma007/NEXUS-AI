# NEXUS AI — Enterprise AI Knowledge Operating System

![NEXUS AI Banner](https://img.shields.io/badge/NEXUS%20AI-Enterprise%20OS-blue?style=for-the-badge)
![Python Version](https://img.shields.io/badge/python-3.11.9-blue.svg)
![Next.js Version](https://img.shields.io/badge/Next.js-15-black.svg)
![Tests](https://img.shields.io/badge/tests-38%20passing-brightgreen.svg)
![CI](https://img.shields.io/badge/CI-GitHub%20Actions-blueviolet.svg)

NEXUS AI is an enterprise-grade AI Knowledge Operating System — a full-stack
**Multi-Agent RAG + GraphRAG** platform with real LLM integration, per-user
workspaces, persistent chat threads, live telemetry, rate limiting, and
Docker/CI deployment readiness. It is built to rival platforms like ChatGPT
Enterprise, Claude Projects, Perplexity, Cursor, and Notion AI.

> **One key principle:** the stack works *with zero API keys*. Without keys it
> runs in deterministic **simulation mode** (great for demos & CI); drop in a
> single provider key and every chat streams **real, grounded LLM answers**.

---

## ✨ Feature Highlights

| Area | What it does |
| --- | --- |
| **Multi-Agent RAG** | Router → Vector RAG / Graph RAG / Memory agents fan out in parallel; a Synthesis agent streams a grounded answer while a Reflection agent scores hallucination risk. |
| **Real LLM Gateway** | LiteLLM powers OpenAI, Anthropic, DeepSeek **and** local Ollama through one async API (`stream_chat`, JSON completions, embeddings). Automatic simulated fallback when no keys are set. |
| **Hybrid Search** | Dense vector cosine similarity + sparse BM25 keyword scoring fused with **Reciprocal Rank Fusion (RRF)** for both ranking quality and keyword precision. |
| **3D GraphRAG Visualizer** | WebGL / Three.js node–edge topology explorer with multi-hop ego-graph traversal (NetworkX). |
| **Long-Term Memory** | Episodic / semantic / preference memory with cosine retrieval, distilled from chat and ingested into the agent context. |
| **Reflection Engine** | Every answer is scored for factual consistency before streaming completes (scores below threshold are flagged, never silently approved). |
| **Authentication** | Register / login / me with **bcrypt + JWT** (timing-safe login, per-user workspaces preloaded with the enterprise corpus). |
| **API Rate Limiting** | Dependency-free sliding-window limiter — 10 logins/min, 5 signups/hr, 240 general req/min per IP, `429 + Retry-After`, spoof-proof by default. |
| **Persistent Chat Threads** | Every exchange is saved (content, agent steps, citations, reflection score); thread history, switching, and auto-created threads. |
| **Live Dashboard Telemetry** | `/stats` aggregates real document/graph/memory/chat counts + average reflection score; the dashboard renders live data, not placeholders. |
| **Readiness Probe** | `/health` reports DB status, per-model availability, and **LIVE AI vs Simulation** mode — shown as a live badge in the UI. |

---

## 🏗️ Architecture

```
┌────────────────────────────────────────────────────────────────────┐
│                        Next.js 15 Frontend                         │
│   Dashboard · Chat (threads) · Knowledge · 3D Graph · Memory · …   │
│   Zustand store · Auth guard · LIVE AI badge · API client          │
└───────────────┬────────────────────────────────────────────────────┘
                │  HTTPS / SSE (same-origin /api/*)
┌───────────────▼────────────────────────────────────────────────────┐
│                        FastAPI Backend (:8000)                     │
│  ┌─────────────┐  ┌──────────────────┐  ┌───────────────────────┐  │
│  │ API v1      │→ │ Services         │→ │ AI Layer (LiteLLM)    │  │
│  │ auth        │  │ agentic_rag      │  │  OpenAI / Anthropic / │  │
│  │ chat        │  │ hybrid_search    │  │  DeepSeek / Ollama    │  │
│  │ knowledge   │  │ graph_rag        │  │  + mock fallback      │  │
│  │ graph       │  │ memory_service   │  │  (deterministic)      │  │
│  │ memory      │  │ doc_processor    │  └───────────────────────┘  │
│  │ stats       │  │ seeder           │                            │
│  │ workspace   │  └──────────────────┘   Rate limiter (middleware)│
│  └─────────────┘  JWT auth · RBAC roles · per-user workspaces      │
└───────────────┬────────────────────────────────────────────────────┘
                │  SQLAlchemy 2.0 async
        ┌───────▼────────┐        ┌───────────────────┐
        │ SQLite (dev)   │        │ pgvector (Docker) │
        │ aiosqlite      │        │ Postgres + HNSW   │
        └────────────────┘        └───────────────────┘
```

### Multi-Agent pipeline (SSE streaming protocol)

`/chat/stream` emits Server-Sent Events consumed by the chat UI:

| Frame | Payload |
| --- | --- |
| `thread` | `{ thread_id }` — id of the persisted conversation (auto-created) |
| `agent_step` | live telemetry: `{ step_id, agent_name, status, thought, output }` |
| `token` | incremental markdown chunks of the grounded answer |
| `done` | `{ citations, reflection_score, graph }` — final grounding + score |
| `error` | `{ message }` — pipeline failure |

Agents: **RouterAgent → { VectorRAGAgent, GraphRAGAgent, MemoryAgent } → SynthesisAgent → ReflectionAgent**.
With no LLM keys, the entire flow runs on the deterministic simulated path so the product demos itself.

---

## 🛠️ Tech Stack

- **Backend**: Python 3.11 · FastAPI · SQLAlchemy 2.0 (async) · Pydantic v2 · python-jose · passlib/bcrypt · NetworkX · LiteLLM · Uvicorn
- **Frontend**: Next.js 15 (App Router) · TypeScript (strict) · Tailwind CSS · Three.js / React Three Fiber · Zustand · Framer Motion · React Query
- **Data**: SQLite (dev) / PostgreSQL + **pgvector** (production) · deterministic mock embeddings (dev)
- **DevOps**: Dockerfiles (backend + frontend) · Docker Compose (pgvector + API + UI) · GitHub Actions CI

---

## ⚙️ Quick Start (local dev)

### 1. Backend

```bash
cd backend
py -3.11 -m venv venv                      # or: python -m venv venv
source venv/bin/activate                   # Windows: .\venv\Scripts\Activate.ps1
pip install --upgrade pip
pip install -r requirements.txt

cp .env.example .env                       # optional — see "AI Modes" below

# Seed the enterprise corpus (docs, graph, memories) — auto-seeded on first boot
python seed.py

# Run the API
python app/main.py                          # or: uvicorn app.main:app --reload
```

API: `http://localhost:8000` · OpenAPI: `http://localhost:8000/api/v1/openapi.json` · Readiness: `http://localhost:8000/api/v1/health`

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

UI: `http://localhost:3000` — create an account on `/signup`, and you're in. The dashboard, chat threads, 3D graph, and knowledge base all work immediately against the seeded corpus.

### 3. Tests

```bash
cd backend
pip install -r requirements-dev.txt
python -m pytest -q        # 38 tests: auth, rate limits, chat persistence, stats, engines, LLM service, config
```

---

## 🤖 AI Modes: LIVE vs Simulation

The frontend header shows a live badge reflecting the backend `/health` probe.

- **🟢 LIVE AI** — at least one provider key is configured and reachable. Chat streams real grounded answers; embeddings are real.
- **🟡 SIMULATION** — no keys set. Deterministic, seeded simulation — every flow still works end-to-end for demos and CI.
- **🔴 OFFLINE** — backend unreachable.

**To go live**, create `backend/.env` with one key:

```bash
# backend/.env
OPENAI_API_KEY=sk-...          # or ANTHROPIC_API_KEY / DEEPSEEK_API_KEY
# or zero-key local AI:
OLLAMA_BASE_URL=http://localhost:11434   # + `ollama pull llama3.3`
```

Then restart the backend — the badge flips green instantly. (Note: switching the embedding provider only affects newly ingested documents; re-run `python seed.py` after a re-ingest.)

---

## 🔐 Environment Variables

See `backend/.env.example` for the full annotated template. Key variables:

| Variable | Default | Purpose |
| --- | --- | --- |
| `SECRET_KEY` | *(none)* | **Required in production** (compose refuses to start without it). Dev generates a stable fallback. `python -c "import secrets; print(secrets.token_urlsafe(48))"` |
| `OPENAI_API_KEY` / `ANTHROPIC_API_KEY` / `DEEPSEEK_API_KEY` | *(none)* | Enable real LLM chat + embeddings. |
| `OLLAMA_BASE_URL` | `http://localhost:11434` | Zero-key local AI (pull `llama3.3`). |
| `EMBEDDING_PROVIDER` | `openai` | `openai` or `ollama`. |
| `DATABASE_URL` | `sqlite+aiosqlite:///./nexus_ai.db` | SQLite for dev; `postgresql+asyncpg://…` for production (pgvector). |
| `ENVIRONMENT` | `development` | `production` requires an explicit `SECRET_KEY`. |
| `RATE_LIMIT_ENABLED` | `true` | Toggle the in-memory rate limiter. |
| `RATE_LIMIT_TRUST_FORWARDED_HEADERS` | `false` | Trust `X-Forwarded-For` only behind a trusted reverse proxy. |

---

## 🔌 API Reference (v1 — `/api/v1`)

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/auth/register` | Create account + personal workspace (preloaded corpus) → JWT |
| POST | `/auth/login` | JSON **or** OAuth2 form login → JWT (timing-safe) |
| GET | `/auth/me` | Current user (strict auth) |
| POST | `/chat/stream` | Stream an agentic answer over SSE (auto-creates/continues a thread) |
| GET | `/chat/threads` | Conversation list with message counts |
| GET | `/chat/threads/{id}/messages` | Full persisted history (steps, citations, reflection) |
| GET | `/knowledge/documents` | Ingested documents |
| POST | `/knowledge/documents` | Ingest a document (markdown/text) |
| POST | `/knowledge/search` | Hybrid RRF search over the workspace |
| GET | `/graph/visualization` | 3D graph nodes/edges for the workspace |
| POST | `/graph/query` | Ego-graph subgraph traversal |
| GET/POST | `/memory` · `/memory/search` | Store / recall long-term memory |
| GET | `/workspaces` | User workspaces |
| GET | `/stats` | Live dashboard telemetry (counts + recent activity) |
| GET | `/health` | Readiness probe (AI mode, models, DB) |

All endpoints (except `/health` and `/`) accept a `Bearer` token; when no token is
present in development, a demo-fallback identity (`ws_default_01`) is used so
the app remains explorable.

---

## 🐳 Deployment

### Docker Compose (full stack — pgvector + backend + frontend)

```bash
cp backend/.env.example .env        # then fill in SECRET_KEY (+ keys)
docker compose up --build
```

- `nexus-db` — `ankane/pgvector` (Postgres + HNSW vector index), health-checked
- `nexus-backend` — Python 3.11-slim, uvicorn, `curl` healthcheck against `/api/v1/health`
- `nexus-frontend` — Node 20-alpine, **Next.js standalone output** running as a non-root user
- `${SECRET_KEY:?…}` — compose **refuses to start** without a secret key

### CI (GitHub Actions — `.github/workflows/ci.yml`)

- **Backend**: `compileall` → import check → `pytest` (38 tests)
- **Frontend**: `npm ci` → `tsc --noEmit` → production `next build`

---

## 📁 Project Structure

```
backend/
  app/
    core/            # config (env), db (async engine), security (JWT/bcrypt/RBAC), rate_limit
    api/v1/          # auth, chat, knowledge, graph, memory, stats, workspace routers
    services/        # agentic_rag, llm (LiteLLM gateway), hybrid_search, graph_rag,
                     # memory_service, doc_processor, seeder
    models/          # SQLAlchemy domain models + Pydantic schemas
    seed_data.py     # enterprise corpus (6 docs, 8 entities, 9 relations, 4 memories)
  seed.py            # idempotent corpus seeding CLI
  tests/             # 38 pytest tests (auth, rate limits, chat, stats, engines, llm, config)
  Dockerfile         # production image (slim, healthchecked)
  .env.example       # full environment template
frontend/
  src/
    app/             # (auth) login/signup · (dashboard) 18 modules · (marketing)
    components/      # chat (view + agent drawer), layout (header/sidebar/badges), ui, auth guard
    features/        # dashboard, auth, knowledge, graphrag, research, observability, studio…
    stores/          # nexus-store, auth-store (persisted session)
    lib/api.ts       # typed API client (auth headers, SSE parsing, threads, stats)
    runtime/sdk/     # AIRuntimeSDK — full programmatic SDK over the platform
docker-compose.yml   # pgvector + backend + frontend
.github/workflows/   # CI (backend compile+tests, frontend tsc+build)
```

---

## 🛣️ Roadmap Status

| Tier | Scope | Status |
| --- | --- | --- |
| 1 | Real AI (LiteLLM gateway, agentic RAG, embeddings, health probe) | ✅ |
| 2 | Deployment (Dockerfiles, compose, SECRET_KEY hygiene, CI, test suite) | ✅ |
| 3 | Enterprise seed corpus + engine tests (search ranking, graph traversal) | ✅ |
| 4 | End-to-end auth (register/login/me, per-user workspaces) + rate limiting | ✅ |
| 5 | Persistent chat threads + live dashboard telemetry | ✅ |
| 6 | Audit logging · RAG eval harness · file upload · auth hardening | 🔜 next |

---

## 📄 License

MIT — see [LICENSE](LICENSE.md).

Built with SOLID principles, a clean repository pattern, strict TypeScript, and modular Python services.
