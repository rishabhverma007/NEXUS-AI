# ==============================================================
# NEXUS AI — Backend Production Dockerfile
# Multi-stage: install → production runner
# ==============================================================

# ---- Stage 1: Builder ----
FROM python:3.11-slim AS builder

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# ---- Stage 2: Production Runner ----
FROM python:3.11-slim AS runner

WORKDIR /app

RUN addgroup --system --gid 1001 appuser && \
    adduser --system --uid 1001 appuser

COPY --from=builder /usr/local /usr/local
COPY . .

ENV PYTHONPATH=/app

EXPOSE 8000

USER appuser

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
