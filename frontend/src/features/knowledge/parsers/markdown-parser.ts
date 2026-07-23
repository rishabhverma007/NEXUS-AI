import { IKnowledgeParser, ParsedDocumentResult, ParsedSection } from "./base-parser";

export class MarkdownParser implements IKnowledgeParser {
  supports(mimeType: string, extension: string): boolean {
    return mimeType === "text/markdown" || extension === "md" || extension === "markdown";
  }

  async parse(content: string | ArrayBuffer, fileName: string): Promise<ParsedDocumentResult> {
    const text = typeof content === "string" ? content : new TextDecoder().decode(content);
    const lines = text.split("\n");

    const sections: ParsedSection[] = [];
    let currentHeading = "Overview";
    let currentLevel = 1;
    let currentLines: string[] = [];

    for (const line of lines) {
      const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);
      if (headingMatch) {
        if (currentLines.length > 0) {
          sections.push({
            heading: currentHeading,
            level: currentLevel,
            content: currentLines.join("\n").trim()
          });
          currentLines = [];
        }
        currentLevel = headingMatch[1].length;
        currentHeading = headingMatch[2].trim();
      } else {
        currentLines.push(line);
      }
    }

    if (currentLines.length > 0) {
      sections.push({
        heading: currentHeading,
        level: currentLevel,
        content: currentLines.join("\n").trim()
      });
    }

    const words = text.trim().split(/\s+/).filter(Boolean);

    return {
      title: fileName.replace(/\.[^/.]+$/, ""),
      rawText: text,
      sections,
      pageCount: Math.ceil(words.length / 500),
      wordCount: words.length,
      characterCount: text.length,
      metadata: { parserUsed: "MarkdownParser" }
    };
  }
}
