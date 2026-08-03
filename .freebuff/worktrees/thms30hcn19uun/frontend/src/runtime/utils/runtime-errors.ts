export class AIRuntimeError extends Error {
  constructor(message: string, public code: string = "RUNTIME_ERROR", public details?: any) {
    super(message);
    this.name = "AIRuntimeError";
  }
}

export class ProviderError extends AIRuntimeError {
  constructor(message: string, provider: string, details?: any) {
    super(`Provider [${provider}] Error: ${message}`, "PROVIDER_ERROR", details);
    this.name = "ProviderError";
  }
}

export class ModelUnavailableError extends AIRuntimeError {
  constructor(modelId: string) {
    super(`Model [${modelId}] is currently unavailable or unsupported.`, "MODEL_UNAVAILABLE");
    this.name = "ModelUnavailableError";
  }
}

export class ContextOverflowError extends AIRuntimeError {
  constructor(tokens: number, maxAllowed: number) {
    super(`Context size (${tokens} tokens) exceeds context window budget (${maxAllowed} tokens).`, "CONTEXT_OVERFLOW");
    this.name = "ContextOverflowError";
  }
}

export class TokenLimitError extends AIRuntimeError {
  constructor(limit: number) {
    super(`Exceeded token limit of ${limit} tokens.`, "TOKEN_LIMIT_EXCEEDED");
    this.name = "TokenLimitError";
  }
}

export class ToolExecutionError extends AIRuntimeError {
  constructor(toolName: string, message: string) {
    super(`Tool [${toolName}] execution failed: ${message}`, "TOOL_EXECUTION_ERROR");
    this.name = "ToolExecutionError";
  }
}

export class WorkflowFailureError extends AIRuntimeError {
  constructor(workflowId: string, step: string) {
    super(`Workflow [${workflowId}] failed at node [${step}].`, "WORKFLOW_FAILURE");
    this.name = "WorkflowFailureError";
  }
}
