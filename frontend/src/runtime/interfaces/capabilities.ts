import { modelRegistry } from "../models/model-registry";
import { AIRuntimeError } from "../utils/runtime-errors";

export type AICapability =
  | "vision"
  | "streaming"
  | "thinking"
  | "json_mode"
  | "function_calling"
  | "embeddings"
  | "large_context";

export class CapabilityMatrix {
  static validateCapability(modelId: string, requiredCapability: AICapability): boolean {
    const model = modelRegistry.getModel(modelId);
    if (!model) {
      throw new AIRuntimeError(`Model ${modelId} not found in ModelRegistry.`, "MODEL_NOT_FOUND");
    }

    switch (requiredCapability) {
      case "vision":
        return model.supportsVision;
      case "streaming":
        return model.supportsStreaming;
      case "thinking":
        return model.supportsThinking;
      case "json_mode":
      case "function_calling":
        return model.supportsFunctionCalling;
      case "embeddings":
        return model.supportsEmbeddings;
      case "large_context":
        return model.contextWindow >= 128000;
      default:
        return true;
    }
  }

  static enforceCapability(modelId: string, requiredCapability: AICapability): void {
    const supported = CapabilityMatrix.validateCapability(modelId, requiredCapability);
    if (!supported) {
      throw new AIRuntimeError(
        `Model [${modelId}] does not support required capability [${requiredCapability}].`,
        "CAPABILITY_MISMATCH"
      );
    }
  }
}
