import { runtimeEventBus } from "@/runtime/events/event-bus";
import { VectorValidator } from "./vector-validator";

export interface BatchEmbeddingRequest {
  workspaceId: string;
  documentId: string;
  chunks: { id: string; content: string }[];
  modelId: string;
}

export class EmbeddingPipeline {
  static async processBatch(request: BatchEmbeddingRequest): Promise<boolean> {
    runtimeEventBus.publish("EMBEDDING_STARTED", {
      workspaceId: request.workspaceId,
      documentId: request.documentId,
      chunkCount: request.chunks.length,
    });

    // Simulate batch vector generation (1536-dim normalized vector)
    const expectedDim = request.modelId.includes("small") ? 1536 : 768;
    for (const chunk of request.chunks) {
      const mockVector = new Array(expectedDim).fill(0).map(() => Math.random() * 2 - 1);
      VectorValidator.validateVector(mockVector, expectedDim);
    }

    runtimeEventBus.publish("EMBEDDING_COMPLETED", {
      workspaceId: request.workspaceId,
      documentId: request.documentId,
      modelId: request.modelId,
    });

    runtimeEventBus.publish("INDEX_UPDATED", {
      workspaceId: request.workspaceId,
      addedVectors: request.chunks.length,
    });

    return true;
  }
}
