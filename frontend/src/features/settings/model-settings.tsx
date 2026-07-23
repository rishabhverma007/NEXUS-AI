"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Cpu, Database, Server, Zap, Bot, Check } from "lucide-react";
import { useNexusStore } from "@/stores/nexus-store";
import { Input } from "@/components/ui/input";

const models = [
  { id: "gpt-4o", name: "OpenAI GPT-4o Enterprise", desc: "Top-tier multi-modal reasoning", icon: Bot },
  { id: "claude-3-5-sonnet", name: "Anthropic Claude 3.5 Sonnet", desc: "Architectural synthesis & code", icon: Bot },
  { id: "deepseek-r1", name: "DeepSeek R1 Reasoning", desc: "Deep reasoning step decomposition", icon: Cpu },
  { id: "ollama-llama3", name: "Ollama Llama-3.3 (Local AI)", desc: "100% offline local model endpoint", icon: Server },
];

export function ModelSettings() {
  const { selectedModel, setSelectedModel } = useNexusStore();
  const [temperature, setTemperature] = useState(0.2);
  const [ollamaUrl, setOllamaUrl] = useState("http://localhost:11434");

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h3 className="text-base font-semibold text-nexus-50 flex items-center gap-2">
          <Cpu className="h-4 w-4 text-nexus-accent" />
          AI Models & Inference Providers
        </h3>
        <p className="text-sm text-nexus-400 mt-1">
          Configure default LLM models, local Ollama server endpoints, and inference temperature.
        </p>
      </div>

      {/* Model Selection */}
      <div className="space-y-3">
        <label className="text-xs font-semibold text-nexus-300 block">Default LLM Provider</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {models.map((m, idx) => {
            const Icon = m.icon;
            const isActive = selectedModel === m.id;
            return (
              <motion.button
                key={m.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                onClick={() => setSelectedModel(m.id)}
                className={`relative p-5 rounded-2xl border text-left space-y-3 transition-all duration-200
                  ${isActive
                    ? "border-nexus-brand/50 bg-nexus-brand/5 shadow-glow-brand"
                    : "nexus-glass border-nexus-border hover:border-nexus-border-hover"
                  }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`p-2.5 rounded-xl border ${isActive ? "bg-nexus-brand/10 border-nexus-brand/20" : "bg-nexus-800/60 border-nexus-border"} ${isActive ? "text-nexus-brand-light" : "text-nexus-400"}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  {isActive && (
                    <div className="h-5 w-5 rounded-full bg-nexus-brand flex items-center justify-center">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>
                <div>
                  <div className="text-sm font-bold text-nexus-50">{m.name}</div>
                  <div className="text-xs text-nexus-400 mt-0.5">{m.desc}</div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Temperature Slider */}
      <div className="nexus-glass rounded-2xl border border-nexus-border p-5 space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-nexus-amber" />
            <span className="text-xs font-semibold text-nexus-300">Model Temperature</span>
          </div>
          <span className="font-mono text-sm text-nexus-accent font-bold">{temperature.toFixed(2)}</span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={temperature}
          onChange={(e) => setTemperature(parseFloat(e.target.value))}
          className="w-full h-1.5 bg-nexus-800 rounded-lg appearance-none cursor-pointer accent-nexus-brand"
          style={{
            background: `linear-gradient(to right, #7C3AED ${temperature * 100}%, #1E293B ${temperature * 100}%)`,
          }}
        />
        <div className="flex justify-between text-[10px] text-nexus-500">
          <span>Precise (0.0)</span>
          <span>Balanced (0.5)</span>
          <span>Creative (1.0)</span>
        </div>
        <p className="text-xs text-nexus-500">Lower temperature produces deterministic architectural code outputs.</p>
      </div>

      {/* Ollama URL */}
      <div className="nexus-glass rounded-2xl border border-nexus-border p-5 space-y-3">
        <label className="text-xs font-semibold text-nexus-300 block">Ollama Local AI Base URL</label>
        <Input
          type="text"
          value={ollamaUrl}
          onChange={(e) => setOllamaUrl(e.target.value)}
          variant="premium"
          className="font-mono"
        />
        <p className="text-xs text-nexus-500">Used for offline local inference without cloud dependencies.</p>
      </div>
    </div>
  );
}
