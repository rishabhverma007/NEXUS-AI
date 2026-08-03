export interface CustomAgentDescriptor {
  role: string;
  description: string;
  capabilities: string[];
  allowedTools: string[];
  memoryType: string;
}

export class AgentDesignerEngine {
  static createAgentDescriptor(
    role: string,
    description: string,
    capabilities: string[],
    allowedTools: string[],
    memoryType: string = "semantic"
  ): CustomAgentDescriptor {
    return {
      role,
      description,
      capabilities,
      allowedTools,
      memoryType,
    };
  }
}
