export class QueryRewriter {
  static rewrite(query: string): string {
    let rewritten = query.trim();

    // Expand common acronyms
    rewritten = rewritten.replace(/\b(RAG)\b/gi, "Retrieval Augmented Generation");
    rewritten = rewritten.replace(/\b(RLS)\b/gi, "Row Level Security");
    rewritten = rewritten.replace(/\b(DAG)\b/gi, "Directed Acyclic Graph");

    return rewritten;
  }
}
