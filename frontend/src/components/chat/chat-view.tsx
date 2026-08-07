"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion } from "framer-motion";
import {
  ArrowUp,
  BrainCircuit,
  FileText,
  MessageSquare,
  Plus,
  Sparkles,
} from "lucide-react";
import { useNexusStore } from "@/stores/nexus-store";
import { AgentStep, ChatMessage, Citation } from "@/types/nexus";
import { fetchThreadMessages, fetchThreads, streamAgentChat } from "@/lib/api";
import { cn } from "@/lib/utils";
import { AgentDrawer } from "./agent-drawer";

const WELCOME_MESSAGE: ChatMessage = {
  id: "msg_welcome",
  role: "assistant",
  content: `Welcome to **NEXUS AI Enterprise Operating System**.\n\nI am initialized with **Multi-Agent RAG**, **pgvector Cosine Hybrid Search**, **GraphRAG Traversal**, and **Self-Reflection factual verification**. Conversations are persisted per thread — pick one on the left or start fresh.\n\nHow can I assist your enterprise architecture today?`,
  createdAt: new Date().toISOString(),
};

export function ChatView() {
  const {
    activeMode,
    selectedModel,
    threads,
    setThreads,
    activeThreadId,
    setActiveThreadId,
  } = useNexusStore();

  const [inputPrompt, setInputPrompt] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [currentSteps, setCurrentSteps] = useState<AgentStep[]>([]);
  const [currentCitations, setCurrentCitations] = useState<Citation[]>([]);
  const [reflectionScore, setReflectionScore] = useState<number | undefined>(undefined);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // Mirror of currentSteps that stays current inside the streaming callbacks
  // (avoids the stale-closure where onDone misses the final step update).
  const stepsRef = useRef<AgentStep[]>([]);

  const refreshThreads = async () => {
    try {
      setThreads(await fetchThreads());
    } catch {
      // Backend unavailable — keep whatever we have.
    }
  };

  // Load the conversation list on mount.
  useEffect(() => {
    refreshThreads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, currentSteps]);

  const loadThread = async (threadId: string) => {
    if (threadId === activeThreadId || isStreaming) return;
    setActiveThreadId(threadId);
    setIsLoadingHistory(true);
    setCurrentSteps([]);
    setCurrentCitations([]);
    setReflectionScore(undefined);
    setMessages([WELCOME_MESSAGE]);
    try {
      const history = await fetchThreadMessages(threadId);
      const saved: ChatMessage[] = history.map((m) => ({
        id: m.id,
        role: m.role,
        content: m.content,
        agentSteps: m.agent_steps,
        citations: m.citations,
        reflectionScore: m.reflection_score ?? undefined,
        createdAt: m.created_at,
      }));
      setMessages([WELCOME_MESSAGE, ...saved]);
    } catch {
      // History fetch failed — leave the welcome message.
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const startNewThread = () => {
    if (isStreaming) return;
    setActiveThreadId(null);
    setMessages([WELCOME_MESSAGE]);
    setCurrentSteps([]);
    setCurrentCitations([]);
    setReflectionScore(undefined);
  };

  const handleSendPrompt = async () => {
    if (!inputPrompt.trim() || isStreaming) return;

    const userMessage: ChatMessage = {
      id: `usr_${Date.now()}`,
      role: "user",
      content: inputPrompt,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const promptToSubmit = inputPrompt;
    setInputPrompt("");
    setIsStreaming(true);
    setCurrentSteps([]);
    setCurrentCitations([]);
    setReflectionScore(undefined);
    stepsRef.current = [];

    const assistantMsgId = `asst_${Date.now()}`;
    const initialAssistantMsg: ChatMessage = {
      id: assistantMsgId,
      role: "assistant",
      content: "",
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, initialAssistantMsg]);

    try {
      await streamAgentChat(
        promptToSubmit,
        selectedModel,
        activeMode,
        activeThreadId,
        (tid) => {
          setActiveThreadId(tid);
          void refreshThreads();
        },
        (step) => {
          setCurrentSteps((prev) => {
            const idx = prev.findIndex((s) => s.step_id === step.step_id);
            const updated =
              idx >= 0
                ? [...prev.slice(0, idx), step, ...prev.slice(idx + 1)]
                : [...prev, step];
            stepsRef.current = updated;
            return updated;
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
                    agentSteps: stepsRef.current,
                  }
                : msg
            )
          );
          setIsStreaming(false);
          void refreshThreads();
        }
      );
    } catch (err) {
      console.error("Streaming error:", err);
      setIsStreaming(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] w-full overflow-hidden bg-slate-950">
      {/* Main Conversation Stream */}
      <div className="flex-1 flex flex-col justify-between h-full relative min-w-0">
        {/* Thread switcher */}
        <div className="flex items-center gap-2 px-6 pt-4 max-w-4xl mx-auto w-full overflow-x-auto no-scrollbar">
          <button
            onClick={startNewThread}
            className={cn(
              "shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] font-medium transition-all",
              !activeThreadId
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 border-blue-500 text-white shadow-glow"
                : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
            )}
          >
            <Plus className="h-3 w-3" />
            New
          </button>
          {threads.map((t) => (
            <button
              key={t.id}
              onClick={() => loadThread(t.id)}
              title={`${t.title} — ${t.message_count ?? 0} messages`}
              className={cn(
                "shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] font-medium transition-all max-w-[220px]",
                activeThreadId === t.id
                  ? "bg-indigo-500/20 border-indigo-400/40 text-indigo-200"
                  : "bg-slate-900/70 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
              )}
            >
              <MessageSquare className="h-3 w-3 shrink-0" />
              <span className="truncate">{t.title}</span>
              {typeof t.message_count === "number" && t.message_count > 0 && (
                <span className="text-[9px] text-slate-500 font-mono shrink-0">
                  {t.message_count}
                </span>
              )}
            </button>
          ))}
        </div>

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
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 p-0.5 flex-shrink-0 shadow-glow">
                  <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                    <BrainCircuit className="h-4 w-4 text-cyan-400" />
                  </div>
                </div>
              )}

              <div
                className={`rounded-2xl p-5 text-sm leading-relaxed max-w-2xl border ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white border-blue-500 shadow-glow"
                    : "glass-panel border-slate-800 text-slate-100"
                }`}
              >
                <div className="prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.content}
                  </ReactMarkdown>
                </div>

                {/* Citations Footer */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-1.5">
                    <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <FileText className="h-3 w-3 text-cyan-400" />
                      Retrieved Grounding Sources ({msg.citations.length})
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {msg.citations.map((c, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-300 font-mono flex items-center gap-1"
                        >
                          <span className="text-cyan-400">[{i + 1}]</span> Chunk {c.chunk_id.slice(0, 8)} (RRF: {c.rrf_score})
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {msg.role === "user" && (
                <div className="h-9 w-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0 text-slate-300 font-bold text-xs">
                  PA
                </div>
              )}
            </motion.div>
          ))}
          {isLoadingHistory && (
            <div className="flex justify-center pt-4">
              <div className="h-5 w-5 rounded-full border-2 border-blue-400/30 border-t-blue-400 animate-spin" />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Dock */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
          <div className="max-w-4xl mx-auto space-y-3">
            <div className="relative glass-panel rounded-2xl p-2 border border-slate-800/80 focus-within:border-blue-500/60 shadow-2xl transition-all">
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
                className="w-full bg-transparent text-slate-100 text-sm placeholder-slate-500 p-3 resize-none focus:outline-none min-h-[60px]"
                rows={2}
              />
              <div className="flex items-center justify-between pt-2 px-2 border-t border-slate-800/50">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[11px] text-blue-400 font-medium flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    {activeMode.replace("_", " ").toUpperCase()}
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {selectedModel}
                  </span>
                </div>
                <button
                  onClick={handleSendPrompt}
                  disabled={!inputPrompt.trim() || isStreaming}
                  className="p-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-glow"
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
