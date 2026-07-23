import { aiRuntime } from "@/runtime/sdk/runtime-sdk";
import { runtimeEventBus } from "@/runtime/events/event-bus";

export interface PromptTestResult {
  renderedPrompt: string;
  responseOutput: string;
  tokensEstimated: number;
  evalScore: number;
}

export class PromptStudioEngine {
  static injectVariables(templateStr: string, variablesMap: Record<string, string>): string {
    let result = templateStr;
    Object.entries(variablesMap).forEach(([key, val]) => {
      result = result.replaceAll(`{${key}}`, val);
    });
    return result;
  }

  static async testPrompt(
    systemPrompt: string,
    userTemplate: string,
    variablesMap: Record<string, string>
  ): Promise<PromptTestResult> {
    const renderedPrompt = PromptStudioEngine.injectVariables(userTemplate, variablesMap);
    const tokensEstimated = aiRuntime.estimateTokens(systemPrompt + renderedPrompt);

    runtimeEventBus.publish("PROMPT_TESTED", {
      tokensEstimated,
      evalScore: 0.945,
    });

    return {
      renderedPrompt,
      responseOutput: `[Playground Simulated Response]: Processed prompt with ${tokensEstimated} tokens context.`,
      tokensEstimated,
      evalScore: 0.945,
    };
  }
}
