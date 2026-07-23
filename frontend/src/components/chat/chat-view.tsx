"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion } from "framer-motion";
import { 
  ArrowUp, 
  Bot, 
  BrainCircuit, 
  Copy, 
  Database, 
  FileText, 
  GitFork, 
  Layers, 
  Sparkles, 
  User 
} from "lucide-react";
import { useNexusStore } from "@/stores/nexus-store";
import { AgentStep, ChatMessage, Citation } from "@/types/nexus";
import { streamAgentChat } from "@/lib/api";
import { AgentDrawer } from "./agent-drawer";

export function ChatView() {
  const { activeMode, selectedModel } = useNexusStore();
  const [inputPrompt, setInputPrompt] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg_welcome",
      role: "assistant",
      content: `Welcome to **NEXUS AI Enterprise Operating System**.\n\nI am initialized with **Multi-Agent RAG**, **pgvector Cosine Hybrid Search**, **GraphRAG Traversal**, and **Self-Reflection factual verification**.\n\nHow can I assist your enterprise architecture today?`,
      createdAt: new Date().toISOString()
    }
  ]);

  const [currentSteps, setCurrentSteps] = useState<AgentStep[]>([]);
  const [currentCitations, setCurrentCitations] = useState<Citation[]>([]);
  const [reflectionScore, setReflectionScore] = useState<number | undefined>(undefined);
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentSteps]);

  const handleSendPrompt = async () => {
    if (!inputPrompt.trim() || isStreaming) return;

    const userMessage: ChatMessage = {
      id: `usr_${Date.now()}`,
      role: "user",
      content: inputPrompt,
      createdAt: new Date().toISOString()
    };

    setMessages((prev) => [...prev, userMessage]);
    const promptToSubmit = inputPrompt;
    setInputPrompt("");
    setIsStreaming(true);
    setCurrentSteps([]);
    setCurrentCitations([]);
    setReflectionScore(undefined);

    const assistantMsgId = `asst_${Date.now()}`;
    const initialAssistantMsg: ChatMessage = {
      id: assistantMsgId,
      role: "assistant",
      content: "",
      createdAt: new Date().toISOString()
    };

    setMessages((prev) => [...prev, initialAssistantMsg]);

    try {
      await streamAgentChat(
        promptToSubmit,
        selectedModel,
        activeMode,
        (step) => {
          setCurrentSteps((prev) => {
            const idx = prev.findIndex((s) => s.step_id === step.step_id);
            if (idx >= 0) {
              const updated = [...prev];
              updated[idx] = step;
              return updated;
            }
            return [...prev, step];
          });
        },
        (token) => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMsgId
                ? { ...msg, content: msg.content + token }
                : msg
            )
          );
        },
        (data) => {
          setCurrentCitations(data.citations);
          setReflectionScore(data.reflection_score);
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMsgId
                ? {
                    ...msg,
                    citations: data.citations,
                    reflectionScore: data.reflection_score,
                    agentSteps: currentSteps
                  }
                : msg
            )
          );
          setIsStreaming(false);
        }
      );
    } catch (err) {
      console.error("Streaming error:", err);
      setIsStreaming(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] w-full overflow-hidden bg-nexus-950">
      {/* Main Conversation Stream */}
      <div className="flex-1 flex flex-col justify-between h-full relative">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={`flex gap-4 max-w-4xl mx-auto ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.role === "assistant" && (
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-nexus-accent to-nexus-brand-light p-0.5 flex-shrink-0 shadow-glow">
                  <div className="h-full w-full bg-nexus-950 rounded-[10px] flex items-center justify-center">
                    <BrainCircuit className="h-4 w-4 text-nexus-accent" />
                  </div>
                </div>
              )}

              <div
                className={`rounded-2xl p-5 text-sm leading-relaxed max-w-2xl border ${
                  msg.role === "user"
                    ? "bg-nexus-accent text-white border-nexus-accent shadow-glow"
                    : "nexus-glass border-nexus-border text-nexus-50"
                }`}
              >
                <div className="prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.content}
                  </ReactMarkdown>
                </div>

                {/* Citations Footer */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-nexus-border/80 space-y-1.5">
                    <div className="text-[10px] font-semibold text-nexus-400 uppercase tracking-wider flex items-center gap-1">
                      <FileText className="h-3 w-3 text-nexus-accent" />
                      Retrieved Grounding Sources ({msg.citations.length})
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {msg.citations.map((c, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 rounded bg-nexus-850 border border-nexus-border text-[10px] text-nexus-300 font-mono flex items-center gap-1"
                        >
                          <span className="text-nexus-accent">[{i + 1}]</span> Chunk {c.chunk_id.slice(0, 8)} (RRF: {c.rrf_score})
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {msg.role === "user" && (
                <div className="h-9 w-9 rounded-xl bg-nexus-800 border border-nexus-border flex items-center justify-center flex-shrink-0 text-nexus-300 font-bold text-xs">
                  PA
                </div>
              )}
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Dock */}
        <div className="p-4 border-t border-nexus-border/80 bg-nexus-950/90 backdrop-blur-md">
          <div className="max-w-4xl mx-auto space-y-3">
            <div className="relative nexus-glass rounded-2xl p-2 border border-nexus-border/80 focus-within:border-nexus-accent/60 shadow-2xl transition-all">
              <textarea
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendPrompt();
                  }
                }}
                placeholder="Ask NEXUS AI (e.g. 'Analyze GraphRAG relationships and memory indices for multi-agent architecture')..."
                className="w-full bg-transparent text-nexus-50 text-sm placeholder-nexus-500 p-3 resize-none focus:outline-none min-h-[60px]"
                rows={2}
              />
              <div className="flex items-center justify-between pt-2 px-2 border-t border-nexus-border/50">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-nexus-accent/10 border border-nexus-accent/20 text-[11px] text-nexus-accent font-medium flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    {activeMode.replace("_", " ").toUpperCase()}
                  </span>
                  <span className="text-[11px] text-nexus-500 font-mono">
                    {selectedModel}
                  </span>
                </div>
                <button
                  onClick={handleSendPrompt}
                  disabled={!inputPrompt.trim() || isStreaming}
                  className="p-2 rounded-xl bg-gradient-to-r from-nexus-accent to-nexus-brand-light hover:from-nexus-accent hover:to-nexus-brand-light text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-glow"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Agent Live Step Telemetry Drawer */}
      <AgentDrawer steps={currentSteps} reflectionScore={reflectionScore} />
    </div>
  );
}
