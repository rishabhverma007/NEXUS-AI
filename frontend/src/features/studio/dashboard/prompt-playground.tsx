"use client";

import { useState } from "react";
import { usePromptStudio } from "@/hooks/use-prompt-studio";
import { Sliders, Play, Sparkles, FileText, CheckCircle2, Code } from "lucide-react";

export function PromptPlayground() {
  const { prompts, testResult, testPrompt } = usePromptStudio();
  const [systemPrompt, setSystemPrompt] = useState(
    "You are Antigravity, an enterprise AI assistant for NEXUS AI OS. Ground every claim using retrieved evidence nodes."
  );
  const [userTemplate, setUserTemplate] = useState("Context: {vectorContext}\nQuery: {userPrompt}\nAnswer:");
  const [userPromptVal, setUserPromptVal] = useState("Explain GraphRAG 2-hop entity traversal.");
  const [vectorContextVal, setVectorContextVal] = useState("Retrieved vector context chunk from Module 5 Hybrid Engine.");
  const [isTesting, setIsTesting] = useState(false);

  const handleTest = async () => {
    setIsTesting(true);
    await testPrompt(systemPrompt, userTemplate, {
      userPrompt: userPromptVal,
      vectorContext: vectorContextVal,
    });
    setIsTesting(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <Sliders className="h-4 w-4 text-cyan-400" /> Prompt Studio & Variable Matrix
        </h3>

        <button
          onClick={handleTest}
          disabled={isTesting}
          className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs flex items-center gap-2 shadow-glow transition-all"
        >
          <Play className="h-4 w-4" /> {isTesting ? "Testing..." : "Test Prompt"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Prompt Template Editors */}
        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 glass-panel space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-slate-300">System Prompt</label>
            <textarea
              rows={3}
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 font-mono text-xs focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-300">User Prompt Template (with {"{variables}"})</label>
            <textarea
              rows={3}
              value={userTemplate}
              onChange={(e) => setUserTemplate(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 font-mono text-xs focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800">
            <span className="font-semibold text-slate-300 block">Variable Inputs</span>
            <div className="space-y-2">
              <div>
                <span className="text-[10px] text-cyan-400 font-mono block">{"{userPrompt}"}</span>
                <input
                  type="text"
                  value={userPromptVal}
                  onChange={(e) => setUserPromptVal(e.target.value)}
                  className="w-full p-2 rounded bg-slate-950 border border-slate-800 text-slate-100 text-xs"
                />
              </div>
              <div>
                <span className="text-[10px] text-cyan-400 font-mono block">{"{vectorContext}"}</span>
                <input
                  type="text"
                  value={vectorContextVal}
                  onChange={(e) => setVectorContextVal(e.target.value)}
                  className="w-full p-2 rounded bg-slate-950 border border-slate-800 text-slate-100 text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Rendered Prompt & Test Result */}
        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 glass-panel space-y-4 text-xs flex flex-col justify-between">
          <div>
            <span className="font-semibold text-slate-300 block mb-2">Rendered Output Preview</span>
            {testResult ? (
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-slate-200 text-xs whitespace-pre-wrap">
                  {testResult.renderedPrompt}
                </div>

                <div className="p-3 rounded-lg bg-slate-950/80 border border-emerald-500/30 text-emerald-300 font-mono text-xs">
                  <span className="text-[10px] text-slate-400 block mb-1">Simulated Output Response</span>
                  {testResult.responseOutput}
                </div>
              </div>
            ) : (
              <div className="p-8 text-center border border-dashed border-slate-800 rounded-lg text-slate-400">
                Click "Test Prompt" to inject variables and evaluate.
              </div>
            )}
          </div>

          {testResult && (
            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-400">
              <span>Tokens Estimated: <strong className="text-cyan-400">{testResult.tokensEstimated}</strong></span>
              <span>Eval Score: <strong className="text-emerald-400">{(testResult.evalScore * 100).toFixed(1)}%</strong></span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
