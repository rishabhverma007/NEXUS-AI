import { IKnowledgeParser } from "./base-parser";
import { MarkdownParser } from "./markdown-parser";

export class ParserFactory {
  private static parsers: IKnowledgeParser[] = [new MarkdownParser()];

  static getParser(mimeType: string, fileName: string): IKnowledgeParser {
    const ext = fileName.split(".").pop()?.toLowerCase() || "";
    for (const parser of ParserFactory.parsers) {
      if (parser.supports(mimeType, ext)) {
        return parser;
      }
    }
    // Fallback to default MarkdownParser
    return new MarkdownParser();
  }
}
