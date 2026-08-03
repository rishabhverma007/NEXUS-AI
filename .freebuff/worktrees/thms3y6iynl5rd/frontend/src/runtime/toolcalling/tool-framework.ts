import { ToolExecutionError } from "../utils/runtime-errors";

export interface ToolMetadata {
  id: string;
  name: string;
  description: string;
  requiredPermissions: string[];
}

export interface ITool<TInput = any, TOutput = any> {
  metadata: ToolMetadata;
  validateInput(input: TInput): boolean;
  execute(input: TInput): Promise<TOutput>;
  validateOutput(output: TOutput): boolean;
}

export class ToolRegistry {
  private static instance: ToolRegistry;
  private tools: Map<string, ITool> = new Map();

  public static getInstance(): ToolRegistry {
    if (!ToolRegistry.instance) {
      ToolRegistry.instance = new ToolRegistry();
    }
    return ToolRegistry.instance;
  }

  registerTool(tool: ITool) {
    this.tools.set(tool.metadata.id, tool);
  }

  async executeTool(toolId: string, input: any): Promise<any> {
    const tool = this.tools.get(toolId);
    if (!tool) {
      throw new ToolExecutionError(toolId, "Tool not registered in ToolRegistry.");
    }

    if (!tool.validateInput(input)) {
      throw new ToolExecutionError(toolId, "Invalid tool input parameters.");
    }

    const output = await tool.execute(input);

    if (!tool.validateOutput(output)) {
      throw new ToolExecutionError(toolId, "Tool output validation failed.");
    }

    return output;
  }
}

export const toolRegistry = ToolRegistry.getInstance();
