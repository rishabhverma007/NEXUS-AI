import { AIRuntimeError } from "@/runtime/utils/runtime-errors";

export class VectorValidator {
  static validateVector(vector: number[], expectedDimension: number): boolean {
    if (!vector || vector.length === 0) {
      throw new AIRuntimeError("Vector is empty or null.", "EMPTY_VECTOR");
    }

    if (vector.length !== expectedDimension) {
      throw new AIRuntimeError(
        `Vector dimension mismatch. Expected ${expectedDimension}, got ${vector.length}.`,
        "DIMENSION_MISMATCH"
      );
    }

    for (const val of vector) {
      if (isNaN(val) || !isFinite(val)) {
        throw new AIRuntimeError("Vector contains NaN or infinite values.", "INVALID_VECTOR_VALUES");
      }
    }

    return true;
  }
}
