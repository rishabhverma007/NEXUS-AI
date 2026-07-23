# NEXUS AI — Enterprise AI Knowledge Operating System

![NEXUS AI Banner](https://img.shields.io/badge/NEXUS%20AI-Enterprise%20OS-blue?style=for-the-badge)
![Python Version](https://img.shields.io/badge/python-3.11.9-blue.svg)
![Next.js Version](https://img.shields.io/badge/Next.js-15-black.svg)
![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)

NEXUS AI is an enterprise-grade AI Knowledge Operating System engineered to rival top-tier platforms (ChatGPT Enterprise, Claude Projects, Perplexity AI, Cursor AI, and Notion AI).

---

## 🚀 Key Features & Enterprise Modules

- **Visual Low-Code AI Studio**: Visual DAG workflow builder, prompt playground with variable matrix, custom agent designer, and deployment center.
- **Multi-Agent RAG**: Autonomous collaboration between Router Agent, Vector RAG Agent, Graph RAG Agent, Memory Agent, Reflection Engine, and Synthesis Agent.
- **pgvector Cosine Hybrid Search**: Dense vector embeddings + BM25 sparse keyword matching fused with Reciprocal Rank Fusion (RRF).
- **3D GraphRAG Visualizer**: WebGL / Three.js node-edge topology visualizer for workspace entities and multi-hop graph traversal.
- **Long-Term Memory Service**: Distillation of chat turns into episodic & semantic memory vectors for user preference retention.
- **Enterprise Governance & Observability**: RLS multi-tenant security, policy engine, SOC2/ISO27001 readiness matrix, immutable audit log streaming, and cost analytics.
- **Cloud Operations & Hardening**: Distributed worker pools, task queues with DLQ fallback, Redis caching, circuit breakers, and automated disaster recovery.

---

## 🛠️ Tech Stack & Prerequisites

- **Python Version**: **Python 3.11.9** (Required)
- **Backend**: FastAPI, SQLAlchemy 2.0 (Async), NetworkX, Pydantic v2, Uvicorn.
- **Frontend**: Next.js 15 (App Router), TypeScript (Strict), Tailwind CSS, Three.js / React Three Fiber, Zustand.
- **DevOps**: Docker, Docker Compose, Kubernetes manifests, Helm charts, Terraform, GitHub Actions.

---

## ⚙️ Local Development Setup

### 1. Backend Setup (Python 3.11.9 Virtual Environment)

```bash
# Navigate to backend directory
cd backend

# Create Python 3.11.9 virtual environment
py -3.11 -m venv venv

# Activate virtual environment
# Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# Linux/macOS:
source venv/bin/activate

# Upgrade pip and install dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Run FastAPI Development Server
python app/main.py
```
Backend API server will run at: `http://localhost:8000` (OpenAPI docs at `http://localhost:8000/api/v1/openapi.json`)

---

### 2. Frontend Setup (Next.js 15)

```bash
# Navigate to frontend directory
cd frontend

# Install Node dependencies
npm install

# Run Next.js Development Server
npm run dev
```
Frontend Web UI will run at: `http://localhost:3000`

---

## 📦 Deployment Ready Options

### Docker Compose (Full Stack)

```bash
# Build and launch all services (Frontend + Redis + Backend)
docker-compose -f devops/docker-compose.yml up --build -d
```

### Kubernetes (Production Cluster)

```bash
# Apply Kubernetes manifests
kubectl apply -f devops/kubernetes-manifests.yaml
```

---

## 📤 GitHub Push Workflow

```bash
# Verify working tree status
git status

# Stage all production changes
git add .

# Commit changes
git commit -m "feat: complete production-ready NEXUS AI OS 16 modules with Python 3.11.9 venv setup"

# Push to origin
git push origin main
```

---

## 🛡️ License & Architecture Standard

Built following SOLID principles, clean Repository Pattern, strict TypeScript, and modular Python backend services.
