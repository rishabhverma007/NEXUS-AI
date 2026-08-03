export interface ParsedSection {
  heading: string;
  level: number;
  content: string;
  pageNumber?: number;
}

export interface ParsedDocumentResult {
  title: string;
  rawText: string;
  sections: ParsedSection[];
  pageCount: number;
  wordCount: number;
  characterCount: number;
  metadata: Record<string, any>;
}

export interface IKnowledgeParser {
  supports(mimeType: string, extension: string): boolean;
  parse(content: string | ArrayBuffer, fileName: string): Promise<ParsedDocumentResult>;
}
