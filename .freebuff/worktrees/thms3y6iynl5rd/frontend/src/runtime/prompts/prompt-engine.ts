import { promptRegistry } from "./prompt-registry";
import { AIRuntimeError } from "../utils/runtime-errors";

export class PromptEngine {
  static render(promptId: string, variables: Record<string, string>): string {
    const prompt = promptRegistry.getPrompt(promptId);
    if (!prompt) {
      throw new AIRuntimeError(`Prompt template [${promptId}] not found in PromptRegistry.`, "PROMPT_NOT_FOUND");
    }

    let rendered = prompt.template;
    for (const [key, value] of Object.entries(variables)) {
      const placeholder = new RegExp(`{{\\s*${key}\\s*}}`, "g");
      rendered = rendered.replace(placeholder, value);
    }
    return rendered;
  }
}
