"use client";

import { ResearchReport } from "@/repositories/research-repository";
import { FileText, Download, CheckCircle2, ShieldCheck, Sparkles, BookOpen } from "lucide-react";

interface ResearchReportViewerProps {
  report: ResearchReport | null;
}

export function ResearchReportViewer({ report }: ResearchReportViewerProps) {
  if (!report) {
    return (
      <div className="p-8 text-center border border-dashed border-nexus-border rounded-xl bg-nexus-850/40">
        <FileText className="h-10 w-10 text-nexus-400 mx-auto mb-3" />
        <h3 className="text-sm font-medium text-nexus-300">No Final Report Available</h3>
        <p className="text-xs text-nexus-400 mt-1">The report will compile automatically once the deep research execution cycle finishes.</p>
      </div>
    );
  }

  const handleDownload = () => {
    const blob = new Blob([report.fullContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${report.title.toLowerCase().replace(/\s+/g, "-")}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Report Header Card */}
      <div className="p-6 rounded-xl bg-gradient-to-r from-nexus-850 via-nexus-950/40 to-nexus-850 border border-nexus-border nexus-glass space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-nexus-accent text-[10px] font-bold border border-nexus-accent/30 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="h-3 w-3" /> Verified Research Report
              </span>
              <span className="text-xs text-nexus-400">{report.citationsCount} Verified Citations</span>
            </div>
            <h2 className="text-xl font-bold text-nexus-50">{report.title}</h2>
          </div>

          <button
            onClick={handleDownload}
            className="px-3 py-1.5 rounded-lg bg-nexus-accent hover:bg-nexus-accent text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-glow"
          >
            <Download className="h-4 w-4" /> Export Report (.md)
          </button>
        </div>

        <div className="p-4 rounded-lg bg-nexus-950/60 border border-nexus-border/60 text-xs text-nexus-300 space-y-2">
          <span className="font-semibold text-nexus-accent flex items-center gap-1.5">
            <BookOpen className="h-4 w-4 text-nexus-accent" /> Executive Summary
          </span>
          <p className="leading-relaxed">{report.executiveSummary}</p>
        </div>

        {/* Key Takeaways Grid */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-nexus-300">Key Takeaways</span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {report.keyTakeaways.map((takeaway, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-nexus-950/70 border border-nexus-border/80 text-xs text-nexus-200 flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-nexus-emerald shrink-0 mt-0.5" />
                <span>{takeaway}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Full Report Content Viewer */}
      <div className="p-6 rounded-xl bg-nexus-850/80 border border-nexus-border nexus-glass">
        <article className="prose prose-invert max-w-none text-xs leading-relaxed text-nexus-200 space-y-4 whitespace-pre-wrap font-sans">
          {report.fullContent}
        </article>
      </div>
    </div>
  );
}
