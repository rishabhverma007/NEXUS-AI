import { modelRegistry, ModelDescriptor } from "../models/model-registry";
import { CapabilityMatrix, AICapability } from "../interfaces/capabilities";
import { ContextManager, UnifiedRuntimeContext } from "../context/context-manager";
import { TokenBudgetManager, TokenBreakdown } from "../utils/token-budget-manager";
import { runtimeEventBus, RuntimeEventType } from "../events/event-bus";
import { StreamManager } from "../streaming/stream-manager";
import { toolRegistry as legacyToolRegistry } from "../toolcalling/tool-framework";
import { telemetryTracker } from "../telemetry/telemetry";
import { streamAgentChat } from "@/lib/api";
import { HybridRetrievalEngine, RetrievalPipelineResult } from "@/features/retrieval/pipeline/hybrid-engine";
import { TaskPlanner, ExecutionPlan } from "@/features/agentic/pipeline/planner";
import { ReflectionEngine, ReflectionResult } from "@/features/agentic/pipeline/reflection-engine";
import { memoryRepository, MemoryObjectItem } from "@/repositories/memory-repository";
import { graphRepository } from "@/repositories/graph-repository";
import { SeedSelector } from "@/features/graphrag/pipeline/seed-selector";
import { SubgraphExpansion } from "@/features/graphrag/pipeline/subgraph-expansion";
import { PathDiscovery } from "@/features/graphrag/pipeline/path-discovery";
import { GraphContextBuilder } from "@/features/graphrag/pipeline/graph-context-builder";
import { toolRepository } from "@/repositories/tool-repository";
import { ExecutionSandbox } from "@/features/tools/sandbox/execution-sandbox";
import { mcpRuntime } from "../mcp/mcp-client";
import { agentRepository } from "@/repositories/agent-repository";
import { researchRepository } from "@/repositories/research-repository";
import { DeepResearchEngine, DeepResearchExecutionOptions } from "@/features/research/pipeline/deep-research-engine";
import { observabilityRepository } from "@/repositories/observability-repository";
import { TracingEngine } from "@/features/observability/pipeline/tracing-engine";
import { EvaluationEngine } from "@/features/observability/pipeline/evaluation-engine";
import { GuardrailEngine } from "@/features/observability/pipeline/guardrail-engine";
import { CostEngine } from "@/features/observability/pipeline/cost-engine";
import { QualityScoreCalculator } from "@/features/observability/pipeline/quality-score-calculator";
import { PromptRegistry } from "@/features/observability/pipeline/prompt-registry";
import { governanceRepository } from "@/repositories/governance-repository";
import { GovernanceEngine } from "@/features/governance/pipeline/governance-engine";
import { PolicyEngine } from "@/features/governance/pipeline/policy-engine";
import { SecurityEngine } from "@/features/governance/pipeline/security-engine";
import { ComplianceEngine } from "@/features/governance/pipeline/compliance-engine";
import { ApprovalWorkflow } from "@/features/governance/pipeline/approval-workflow";
import { LicenseManager } from "@/features/governance/pipeline/license-manager";
import { studioRepository } from "@/repositories/studio-repository";
import { WorkflowRunner } from "@/features/studio/pipeline/workflow-runner";
import { PromptStudioEngine } from "@/features/studio/pipeline/prompt-studio-engine";
import { DeploymentEngine } from "@/features/studio/pipeline/deployment-engine";
import { operationsRepository } from "@/repositories/operations-repository";
import { HealthMonitor } from "@/features/operations/pipeline/health-monitor";
import { ReleaseManager } from "@/features/operations/pipeline/release-manager";
import { QueueManager } from "@/features/operations/pipeline/queue-manager";
import { WorkerClusterEngine } from "@/features/operations/pipeline/worker-cluster-engine";
import { DisasterRecoveryEngine } from "@/features/operations/pipeline/disaster-recovery-engine";

export class AIRuntimeSDK {
  private static instance: AIRuntimeSDK;

  public static getInstance(): AIRuntimeSDK {
    if (!AIRuntimeSDK.instance) {
      AIRuntimeSDK.instance = new AIRuntimeSDK();
    }
    return AIRuntimeSDK.instance;
  }

  // 1. Get Model Registry
  getModel(modelId: string): ModelDescriptor | undefined {
    return modelRegistry.getModel(modelId);
  }

  getAllModels(): ModelDescriptor[] {
    return modelRegistry.getAllModels();
  }

  // 2. Validate Capability
  validateCapability(modelId: string, capability: AICapability): boolean {
    return CapabilityMatrix.validateCapability(modelId, capability);
  }

  // 3. Build Unified AI Context
  buildContext(
    workspaceId: string,
    userId: string,
    userPrompt: string,
    systemPrompt: string,
    vectorContext = "",
    graphContext = "",
    memoryContext = ""
  ): UnifiedRuntimeContext {
    return ContextManager.buildRuntimeContext(
      workspaceId,
      userId,
      userPrompt,
      systemPrompt,
      vectorContext,
      graphContext,
      memoryContext
    );
  }

  // 4. Estimate Tokens & Breakdown
  estimateTokens(text: string): number {
    return TokenBudgetManager.estimateTokens(text);
  }

  getTokenBreakdown(
    userPrompt: string,
    vectorContext = "",
    memoryContext = "",
    graphContext = ""
  ): TokenBreakdown {
    return TokenBudgetManager.calculateBreakdown(userPrompt, vectorContext, memoryContext, graphContext);
  }

  // 5. Call Sandboxed Tool (Legacy Helper)
  async callTool(toolId: string, input: any): Promise<any> {
    return await legacyToolRegistry.executeTool(toolId, input);
  }

  // 6. Enterprise Hybrid Retrieval Engine SDK
  async retrieve(
    query: string,
    workspaceId: string,
    mode: "fast" | "balanced" | "deep" | "research" = "balanced"
  ): Promise<RetrievalPipelineResult> {
    return await HybridRetrievalEngine.search(query, workspaceId, mode);
  }

  // 7. Agentic RAG Orchestration SDK
  plan(query: string, mode: "fast" | "balanced" | "deep" | "research" = "balanced"): ExecutionPlan {
    return TaskPlanner.createPlan(query, mode);
  }

  reflect(answerCandidate: string, evidenceCount: number): ReflectionResult {
    return ReflectionEngine.evaluate(answerCandidate, evidenceCount);
  }

  // 8. Long-Term Memory Platform SDK
  async remember(workspaceId: string, key: string, value: string, type = "semantic"): Promise<MemoryObjectItem> {
    const mem = await memoryRepository.saveMemory(workspaceId, key, value, type);
    runtimeEventBus.publish("MEMORY_UPDATED", { workspaceId, key });
    return mem;
  }

  async recall(workspaceId: string, type?: string): Promise<MemoryObjectItem[]> {
    return await memoryRepository.getMemories(workspaceId, type);
  }

  // 9. Enterprise Knowledge Graph SDK
  graph = {
    query: async (workspaceId: string) => graphRepository.getGraph(workspaceId),
    traverse: async (workspaceId: string, nodeId: string) => graphRepository.traverseSubgraph(workspaceId, nodeId),
  };

  // 10. Enterprise GraphRAG Intelligence Engine SDK
  graphrag = {
    expand: (seeds: any[], maxHops = 2) => SubgraphExpansion.expand(seeds, maxHops),
    buildContext: (subgraph: any, paths: any[]) => GraphContextBuilder.buildContext(subgraph, paths),
  };

  // 11. Enterprise Tool Ecosystem SDK
  tools = {
    list: async (workspaceId: string, category?: string) => toolRepository.getTools(workspaceId, category),
    register: async (workspaceId: string, name: string, category: any, description: string) => {
      const tool = await toolRepository.registerTool(workspaceId, name, category, description);
      runtimeEventBus.publish("TOOL_REGISTERED", { workspaceId, toolId: tool.id });
      return tool;
    },
    execute: async (toolId: string, input: any, timeoutMs?: number) => {
      runtimeEventBus.publish("TOOL_EXECUTION_STARTED", { toolId });
      const res = await ExecutionSandbox.executeInSandbox(toolId, input, timeoutMs);
      runtimeEventBus.publish("TOOL_EXECUTION_COMPLETED", { toolId, status: res.status });
      return res;
    },
  };

  // 12. Model Context Protocol (MCP) Runtime SDK
  mcp = {
    listServers: async () => mcpRuntime.listServers(),
    connect: async (serverUrl: string, name: string) => {
      const srv = await mcpRuntime.connect(serverUrl, name);
      runtimeEventBus.publish("MCP_CONNECTED", { serverId: srv.id, url: serverUrl });
      return srv;
    },
    discover: async (serverId: string) => mcpRuntime.discoverTools(serverId),
    execute: async (serverId: string, toolName: string, input: any) => mcpRuntime.executeMCPTool(serverId, toolName, input),
  };

  // 13. Multi-Agent Collaboration Runtime SDK
  agents = {
    list: async () => agentRepository.getAgents(),
    execute: async (agentRole: string, taskPrompt: string) => {
      runtimeEventBus.publish("AGENT_STARTED", { agentRole });
      return { status: "success", agentRole, output: `Completed task via ${agentRole} agent` };
    },
    broadcast: (message: string) => {
      runtimeEventBus.publish("NOTIFICATION_CREATED", { message });
    },
  };

  // 14. Enterprise Deep Research Engine SDK
  research = {
    start: async (options: DeepResearchExecutionOptions) => DeepResearchEngine.execute(options),
    listSessions: async (workspaceId: string) => researchRepository.getSessions(workspaceId),
    getSession: async (sessionId: string) => researchRepository.getSessionById(sessionId),
    getEvidence: async (sessionId: string) => researchRepository.getEvidence(sessionId),
    getHypotheses: async (sessionId: string) => researchRepository.getHypotheses(sessionId),
    getReport: async (sessionId: string) => researchRepository.getReport(sessionId),
    getMetrics: async (workspaceId: string) => researchRepository.getMetrics(workspaceId),
  };

  // 15. Enterprise AI Evaluation, Guardrails & Observability SDK
  evaluate = {
    run: async (workspaceId: string, sessionId?: string, type: any = "full_pipeline") =>
      EvaluationEngine.runFullEvaluation(workspaceId, sessionId, type),
    report: async (workspaceId: string) => QualityScoreCalculator.calculateLatestScore(workspaceId),
  };

  guardrails = {
    validate: async (workspaceId: string, userId: string, promptText: string) =>
      GuardrailEngine.validatePrompt(workspaceId, userId, promptText),
    validateTool: async (workspaceId: string, toolId: string, payload: any) =>
      GuardrailEngine.validateToolCall(workspaceId, toolId, payload),
    listEvents: async (workspaceId: string) => observabilityRepository.getGuardrails(workspaceId),
  };

  tracing = {
    start: (workspaceId: string, opName: string, comp: any, parentId?: string) =>
      TracingEngine.startTrace(workspaceId, opName, comp, parentId),
    stop: async (spanId: string, workspaceId: string, opName: string, comp: any, status: any = "ok") =>
      TracingEngine.stopTrace(spanId, workspaceId, opName, comp, status),
    listSpans: async (workspaceId: string) => observabilityRepository.getTraces(workspaceId),
  };

  analytics = {
    metrics: async (workspaceId: string) => QualityScoreCalculator.calculateLatestScore(workspaceId),
  };

  cost = {
    report: async (workspaceId: string) => CostEngine.getWorkspaceCostSummary(workspaceId),
    record: async (workspaceId: string, modelId: string, p: number, c: number, e = 0, role?: string, tool?: string) =>
      CostEngine.recordUsage(workspaceId, modelId, p, c, e, role, tool),
  };

  prompts = {
    listVersions: async (workspaceId: string) => PromptRegistry.listVersions(workspaceId),
    createVersion: async (w: string, name: string, sys: string, tpl: string, author: string) =>
      PromptRegistry.createVersion(w, name, sys, tpl, author),
    rollback: async (workspaceId: string, promptVersionId: string) => PromptRegistry.rollback(workspaceId, promptVersionId),
  };

  // 16. Enterprise Governance, Administration & Security SDK
  governance = {
    organizations: async (orgId: string) => GovernanceEngine.getOrganizationDetails(orgId),
    policies: async (orgId: string) => governanceRepository.getPolicies(orgId),
    createPolicy: async (orgId: string, name: string, type: any, desc: string, rules: any, reqAppr: boolean) =>
      PolicyEngine.createPolicy(orgId, name, type, desc, rules, reqAppr),
    approvals: async (orgId: string) => ApprovalWorkflow.listApprovals(orgId),
    grantApproval: async (id: string, reason?: string) => ApprovalWorkflow.grantApproval(id, reason),
    rejectApproval: async (id: string, reason?: string) => ApprovalWorkflow.rejectApproval(id, reason),
    security: async (orgId: string) => SecurityEngine.listSecurityEvents(orgId),
    compliance: async (orgId: string) => ComplianceEngine.getComplianceStatus(orgId),
    licenses: async (orgId: string) => LicenseManager.getLicenseDetails(orgId),
    quotas: async (workspaceId: string) => LicenseManager.getQuotaStatus(workspaceId),
    audit: async (orgId: string) => governanceRepository.getSecurityEvents(orgId),
  };

  // 17. Enterprise AI Studio, Prompt Studio & Visual Workflow Builder SDK
  studio = {
    projects: async (workspaceId: string) => studioRepository.getProjects(workspaceId),
    createProject: async (p: any) => studioRepository.createProject(p),
    workflows: async (workspaceId: string) => studioRepository.getWorkflows(workspaceId),
    getWorkflowGraph: async (workflowId: string) => studioRepository.getWorkflowGraph(workflowId),
    runWorkflow: async (workflowId: string, workspaceId: string, inputPrompt: string) =>
      WorkflowRunner.run(workflowId, workspaceId, inputPrompt),
    deploy: async (w: string, ws: string, tag: string, env: any, by: string) =>
      DeploymentEngine.deployWorkflow(w, ws, tag, env, by),
    getDeployments: async (workspaceId: string) => studioRepository.getDeployments(workspaceId),
    prompts: async (workspaceId: string) => studioRepository.getPromptTemplates(workspaceId),
    testPrompt: async (sys: string, tpl: string, vars: any) => PromptStudioEngine.testPrompt(sys, tpl, vars),
  };

  // 18. Enterprise Production Hardening, Scalability & Operations SDK
  operations = {
    health: async () => HealthMonitor.checkHealth(),
    deployments: async () => operationsRepository.getReleases(),
    createRelease: async (tag: string, env: string, sha: string, by: string) => ReleaseManager.createRelease(tag, env, sha, by),
    queues: async () => QueueManager.getQueueMetrics(),
    workers: async () => WorkerClusterEngine.listWorkers(),
    infrastructure: async () => operationsRepository.getClusterNodes(),
    backups: async () => operationsRepository.getBackups(),
    triggerBackup: async (type: any) => DisasterRecoveryEngine.triggerBackup(type),
  };

  // 14. Multimodal SSE Stream Execution
  async stream(
    prompt: string,
    modelId: string,
    agentMode: import("@/types/nexus").AgentMode,
    workspaceId: string,
    streamManager: StreamManager
  ): Promise<void> {
    const startTime = Date.now();
    runtimeEventBus.publish("SEARCH_STARTED", { prompt, workspaceId });

    try {
      await streamAgentChat(
        prompt,
        modelId,
        agentMode,
        (step) => {
          streamManager.emitReasoning(step.thought);
        },
        (token) => {
          streamManager.emitToken(token);
        },
        (data) => {
          streamManager.emitDone(data);
          runtimeEventBus.publish("AGENT_COMPLETED", { workspaceId, reflectionScore: data.reflection_score });
          telemetryTracker.recordEvent({
            provider: "fastapi_langgraph",
            modelId,
            latencyMs: Date.now() - startTime,
            promptTokens: this.estimateTokens(prompt),
            responseTokens: 250,
            toolUsageCount: 2,
            status: "success",
          });
        }
      );
    } catch (err: any) {
      streamManager.emit("error", err.message);
      telemetryTracker.recordEvent({
        provider: "fastapi_langgraph",
        modelId,
        latencyMs: Date.now() - startTime,
        promptTokens: this.estimateTokens(prompt),
        responseTokens: 0,
        toolUsageCount: 0,
        status: "error",
      });
    }
  }
}

export const aiRuntime = AIRuntimeSDK.getInstance();
