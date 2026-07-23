"use client";

import { useState } from "react";
import { Cpu, Database, Server, Zap } from "lucide-react";
import { useNexusStore } from "@/stores/nexus-store";

export function ModelSettings() {
  const { selectedModel, setSelectedModel } = useNexusStore();
  const [temperature, setTemperature] = useState(0.2);
  const [ollamaUrl, setOllamaUrl] = useState("http://localhost:11434");

  const models = [
    { id: "gpt-4o", name: "OpenAI GPT-4o Enterprise", desc: "Top-tier multi-modal reasoning" },
    { id: "claude-3-5-sonnet", name: "Anthropic Claude 3.5 Sonnet", desc: "Architectural synthesis & code" },
    { id: "deepseek-r1", name: "DeepSeek R1 Reasoning", desc: "Deep reasoning step decomposition" },
    { id: "ollama-llama3", name: "Ollama Llama-3.3 (Local AI)", desc: "100% offline local model endpoint" },
  ];

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
          <Cpu className="h-4 w-4 text-cyan-400" />
          AI Models & Inference Providers
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Configure default LLM models, local Ollama server endpoints, and temperature.
        </p>
      </div>

      <div className="space-y-4">
        <label className="text-xs font-semibold text-slate-300 block">Default LLM Provider</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {models.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedModel(m.id)}
              className={`p-4 rounded-xl border text-left space-y-1 transition-all ${
                selectedModel === m.id
                  ? "bg-slate-900 border-blue-500/80 shadow-glow text-slate-100"
                  : "glass-panel border-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              <div className="text-xs font-bold">{m.name}</div>
              <div className="text-[10px] text-slate-500">{m.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex justify-between text-xs">
          <span className="text-slate-300 font-semibold">Model Temperature</span>
          <span className="font-mono text-cyan-400 font-bold">{temperature}</span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={temperature}
          onChange={(e) => setTemperature(parseFloat(e.target.value))}
          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
        <p className="text-[10px] text-slate-500">Lower temperature produces deterministic architectural code outputs.</p>
      </div>

      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
        <label className="text-xs font-semibold text-slate-300 block">Ollama Local AI Base URL</label>
        <input
          type="text"
          value={ollamaUrl}
          onChange={(e) => setOllamaUrl(e.target.value)}
          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 font-mono focus:outline-none focus:border-blue-500"
        />
        <p className="text-[10px] text-slate-500">Used for offline local inference without cloud dependencies.</p>
      </div>
    </div>
  );
}
