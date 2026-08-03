import { ParsedDocumentResult } from "../parsers/base-parser";

export type ChunkStrategy = "recursive" | "heading" | "paragraph" | "token_window";

export interface PreparedChunk {
  chunkOrder: number;
  content: string;
  estimatedTokenCount: number;
  heading: string;
  pageNumber: number;
  metadata: Record<string, any>;
}

export class ChunkPreparer {
  static prepareChunks(parsedDoc: ParsedDocumentResult, strategy: ChunkStrategy = "heading"): PreparedChunk[] {
    const chunks: PreparedChunk[] = [];
    let order = 0;

    if (strategy === "heading" && parsedDoc.sections.length > 0) {
      for (const section of parsedDoc.sections) {
        if (!section.content) continue;
        order++;
        const tokenEst = Math.ceil(section.content.split(/\s+/).length * 1.3);
        chunks.push({
          chunkOrder: order,
          content: section.content,
          estimatedTokenCount: tokenEst,
          heading: section.heading,
          pageNumber: section.pageNumber || 1,
          metadata: { strategy: "heading", level: section.level }
        });
      }
    } else {
      // Paragraph fallback strategy
      const paragraphs = parsedDoc.rawText.split(/\n\s*\n/).filter(Boolean);
      for (const p of paragraphs) {
        order++;
        const tokenEst = Math.ceil(p.split(/\s+/).length * 1.3);
        chunks.push({
          chunkOrder: order,
          content: p.trim(),
          estimatedTokenCount: tokenEst,
          heading: "Paragraph",
          pageNumber: 1,
          metadata: { strategy: "paragraph" }
        });
      }
    }

    return chunks;
  }
}
