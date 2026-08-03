-- ============================================================================
-- NEXUS AI — Enterprise Production Hardening, Scalability & Operations Database Schema
-- Module 16 Extension
-- ============================================================================

-- 1. Cluster Nodes Table
CREATE TABLE IF NOT EXISTS public.cluster_nodes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    node_name VARCHAR(100) NOT NULL UNIQUE,
    region VARCHAR(50) NOT NULL DEFAULT 'us-east-1',
    zone VARCHAR(50) NOT NULL DEFAULT 'us-east-1a',
    status VARCHAR(30) NOT NULL DEFAULT 'healthy' CHECK (status IN ('healthy', 'degraded', 'offline', 'draining')),
    cpu_utilization_percent NUMERIC(5,2) NOT NULL DEFAULT 24.50,
    memory_utilization_percent NUMERIC(5,2) NOT NULL DEFAULT 42.10,
    active_connections INT NOT NULL DEFAULT 120,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Background Workers Table
CREATE TABLE IF NOT EXISTS public.background_workers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    worker_id VARCHAR(100) NOT NULL UNIQUE,
    node_id UUID REFERENCES public.cluster_nodes(id) ON DELETE CASCADE,
    worker_type VARCHAR(50) NOT NULL CHECK (worker_type IN ('embedding', 'graph_indexing', 'memory_compaction', 'research', 'evaluation', 'workflow', 'document_processor')),
    status VARCHAR(30) NOT NULL DEFAULT 'idle' CHECK (status IN ('idle', 'busy', 'failed', 'stopped')),
    jobs_completed INT NOT NULL DEFAULT 0,
    concurrency_limit INT NOT NULL DEFAULT 10,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Task Queues Table
CREATE TABLE IF NOT EXISTS public.task_queues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    queue_name VARCHAR(100) NOT NULL UNIQUE,
    priority INT NOT NULL DEFAULT 1,
    pending_jobs INT NOT NULL DEFAULT 0,
    processing_jobs INT NOT NULL DEFAULT 0,
    dead_letter_jobs INT NOT NULL DEFAULT 0,
    rate_limit_per_sec INT NOT NULL DEFAULT 500,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Queued Jobs Detail Table
CREATE TABLE IF NOT EXISTS public.queued_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    queue_id UUID NOT NULL REFERENCES public.task_queues(id) ON DELETE CASCADE,
    job_type VARCHAR(50) NOT NULL,
    payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    status VARCHAR(30) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'dlq')),
    attempts INT NOT NULL DEFAULT 0,
    max_attempts INT NOT NULL DEFAULT 3,
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Cache Clusters Table (Redis)
CREATE TABLE IF NOT EXISTS public.cache_clusters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cluster_name VARCHAR(100) NOT NULL UNIQUE,
    hit_rate_percent NUMERIC(5,2) NOT NULL DEFAULT 98.40,
    memory_used_mb NUMERIC(10,2) NOT NULL DEFAULT 1420.50,
    evictions_count INT NOT NULL DEFAULT 12,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Circuit Breakers Table
CREATE TABLE IF NOT EXISTS public.circuit_breakers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_name VARCHAR(100) NOT NULL UNIQUE,
    state VARCHAR(20) NOT NULL DEFAULT 'closed' CHECK (state IN ('closed', 'open', 'half_open')),
    failure_threshold_percent INT NOT NULL DEFAULT 50,
    consecutive_failures INT NOT NULL DEFAULT 0,
    last_tripped_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Disaster Recovery Backups Table
CREATE TABLE IF NOT EXISTS public.disaster_backups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    backup_type VARCHAR(50) NOT NULL DEFAULT 'pitr' CHECK (backup_type IN ('full', 'differential', 'pitr', 'snapshot')),
    size_bytes BIGINT NOT NULL DEFAULT 10737418240,
    storage_location TEXT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'completed' CHECK (status IN ('running', 'completed', 'verified', 'failed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Deployment Releases Table
CREATE TABLE IF NOT EXISTS public.deployment_releases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    release_tag VARCHAR(50) NOT NULL UNIQUE,
    environment VARCHAR(30) NOT NULL DEFAULT 'production',
    commit_sha VARCHAR(50) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'success' CHECK (status IN ('deploying', 'success', 'rolled_back', 'failed')),
    deployed_by VARCHAR(100) NOT NULL,
    deployed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Infrastructure Metrics Snapshots Table
CREATE TABLE IF NOT EXISTS public.infrastructure_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    node_id UUID REFERENCES public.cluster_nodes(id) ON DELETE CASCADE,
    p50_latency_ms NUMERIC(10,2) NOT NULL DEFAULT 42.0,
    p95_latency_ms NUMERIC(10,2) NOT NULL DEFAULT 145.0,
    p99_latency_ms NUMERIC(10,2) NOT NULL DEFAULT 280.0,
    error_rate NUMERIC(5,4) NOT NULL DEFAULT 0.0001,
    snapshot_time TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. Incident Timeline Table
CREATE TABLE IF NOT EXISTS public.incident_timeline (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    severity VARCHAR(20) NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    status VARCHAR(30) NOT NULL DEFAULT 'resolved' CHECK (status IN ('investigating', 'identified', 'monitoring', 'resolved')),
    summary TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

-- Enable Row Level Security
ALTER TABLE public.cluster_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.background_workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_queues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.circuit_breakers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disaster_backups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deployment_releases ENABLE ROW LEVEL SECURITY;

-- Allow Global Cluster Operations Access
CREATE POLICY cluster_ops_policy ON public.cluster_nodes FOR ALL USING (true);
CREATE POLICY background_workers_policy ON public.background_workers FOR ALL USING (true);
CREATE POLICY task_queues_policy ON public.task_queues FOR ALL USING (true);
