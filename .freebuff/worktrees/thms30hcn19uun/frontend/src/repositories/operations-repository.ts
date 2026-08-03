export interface ClusterNodeItem {
  id: string;
  nodeName: string;
  region: string;
  zone: string;
  status: "healthy" | "degraded" | "offline" | "draining";
  cpuUtilizationPercent: number;
  memoryUtilizationPercent: number;
  activeConnections: number;
  createdAt: string;
}

export interface BackgroundWorkerItem {
  id: string;
  workerId: string;
  nodeId?: string;
  workerType: "embedding" | "graph_indexing" | "memory_compaction" | "research" | "evaluation" | "workflow" | "document_processor";
  status: "idle" | "busy" | "failed" | "stopped";
  jobsCompleted: number;
  concurrencyLimit: number;
  createdAt: string;
}

export interface TaskQueueItem {
  id: string;
  queueName: string;
  priority: number;
  pendingJobs: number;
  processingJobs: number;
  deadLetterJobs: number;
  rateLimitPerSec: number;
  createdAt: string;
}

export interface DisasterBackupItem {
  id: string;
  backupType: "full" | "differential" | "pitr" | "snapshot";
  sizeBytes: number;
  storageLocation: string;
  status: "running" | "completed" | "verified" | "failed";
  createdAt: string;
}

export interface DeploymentReleaseItem {
  id: string;
  releaseTag: string;
  environment: string;
  commitSha: string;
  status: "deploying" | "success" | "rolled_back" | "failed";
  deployedBy: string;
  deployedAt: string;
}

export class OperationsRepository {
  private static instance: OperationsRepository;

  private clusterNodes: ClusterNodeItem[] = [
    { id: "node_01", nodeName: "nexus-prod-us-east-1a-01", region: "us-east-1", zone: "us-east-1a", status: "healthy", cpuUtilizationPercent: 24.5, memoryUtilizationPercent: 42.1, activeConnections: 184, createdAt: new Date().toISOString() },
    { id: "node_02", nodeName: "nexus-prod-us-east-1b-02", region: "us-east-1", zone: "us-east-1b", status: "healthy", cpuUtilizationPercent: 28.2, memoryUtilizationPercent: 48.6, activeConnections: 210, createdAt: new Date().toISOString() },
    { id: "node_03", nodeName: "nexus-prod-eu-west-1a-01", region: "eu-west-1", zone: "eu-west-1a", status: "healthy", cpuUtilizationPercent: 19.8, memoryUtilizationPercent: 36.4, activeConnections: 145, createdAt: new Date().toISOString() },
  ];

  private workers: BackgroundWorkerItem[] = [
    { id: "wrk_01", workerId: "embedding-worker-pool-01", workerType: "embedding", status: "busy", jobsCompleted: 14280, concurrencyLimit: 20, createdAt: new Date().toISOString() },
    { id: "wrk_02", workerId: "graph-indexer-pool-01", workerType: "graph_indexing", status: "idle", jobsCompleted: 3890, concurrencyLimit: 10, createdAt: new Date().toISOString() },
    { id: "wrk_03", workerId: "memory-compact-worker-01", workerType: "memory_compaction", status: "idle", jobsCompleted: 1240, concurrencyLimit: 5, createdAt: new Date().toISOString() },
    { id: "wrk_04", workerId: "deep-research-orchestrator-01", workerType: "research", status: "busy", jobsCompleted: 420, concurrencyLimit: 8, createdAt: new Date().toISOString() },
  ];

  private queues: TaskQueueItem[] = [
    { id: "q_01", queueName: "retrieval_embedding_high", priority: 1, pendingJobs: 12, processingJobs: 8, deadLetterJobs: 0, rateLimitPerSec: 1000, createdAt: new Date().toISOString() },
    { id: "q_02", queueName: "graphrag_traversal_queue", priority: 2, pendingJobs: 4, processingJobs: 5, deadLetterJobs: 0, rateLimitPerSec: 500, createdAt: new Date().toISOString() },
    { id: "q_03", queueName: "deep_research_long_running", priority: 3, pendingJobs: 2, processingJobs: 3, deadLetterJobs: 1, rateLimitPerSec: 100, createdAt: new Date().toISOString() },
  ];

  private backups: DisasterBackupItem[] = [
    { id: "bak_01", backupType: "pitr", sizeBytes: 14820000000, storageLocation: "s3://nexus-backups-prod/pitr/2026-07-23", status: "verified", createdAt: new Date(Date.now() - 3600000 * 3).toISOString() },
  ];

  private releases: DeploymentReleaseItem[] = [
    { id: "rel_01", releaseTag: "v1.16.0", environment: "production", commitSha: "94c4e753", status: "success", deployedBy: "github-actions[bot]", deployedAt: new Date(Date.now() - 3600000 * 12).toISOString() },
  ];

  public static getInstance(): OperationsRepository {
    if (!OperationsRepository.instance) {
      OperationsRepository.instance = new OperationsRepository();
    }
    return OperationsRepository.instance;
  }

  async getClusterNodes(): Promise<ClusterNodeItem[]> {
    return this.clusterNodes;
  }

  async getWorkers(): Promise<BackgroundWorkerItem[]> {
    return this.workers;
  }

  async getQueues(): Promise<TaskQueueItem[]> {
    return this.queues;
  }

  async getBackups(): Promise<DisasterBackupItem[]> {
    return this.backups;
  }

  async createBackup(type: DisasterBackupItem["backupType"]): Promise<DisasterBackupItem> {
    const bak: DisasterBackupItem = {
      id: `bak_${Date.now()}`,
      backupType: type,
      sizeBytes: 15200000000,
      storageLocation: `s3://nexus-backups-prod/manual/${Date.now()}`,
      status: "verified",
      createdAt: new Date().toISOString(),
    };
    this.backups.unshift(bak);
    return bak;
  }

  async getReleases(): Promise<DeploymentReleaseItem[]> {
    return this.releases;
  }

  async createRelease(releaseTag: string, env: string, commitSha: string, deployedBy: string): Promise<DeploymentReleaseItem> {
    const rel: DeploymentReleaseItem = {
      id: `rel_${Date.now()}`,
      releaseTag,
      environment: env,
      commitSha,
      status: "success",
      deployedBy,
      deployedAt: new Date().toISOString(),
    };
    this.releases.unshift(rel);
    return rel;
  }
}

export const operationsRepository = OperationsRepository.getInstance();
