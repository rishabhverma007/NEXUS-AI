"use client";

import { useState, useEffect, useCallback } from "react";
import { aiRuntime } from "@/runtime/sdk/runtime-sdk";
import { runtimeEventBus } from "@/runtime/events/event-bus";
import { ResearchSession, ResearchEvidence, ResearchHypothesis, ResearchReport } from "@/repositories/research-repository";
import { useNexusStore } from "@/stores/nexus-store";

export function useResearch() {
  const { currentWorkspace } = useNexusStore();
  const [sessions, setSessions] = useState<ResearchSession[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [evidenceList, setEvidenceList] = useState<ResearchEvidence[]>([]);
  const [hypotheses, setHypotheses] = useState<ResearchHypothesis[]>([]);
  const [report, setReport] = useState<ResearchReport | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionMessage, setExecutionMessage] = useState<string>("");
  const [progressPercent, setProgressPercent] = useState<number>(0);

  const fetchSessions = useCallback(async () => {
    try {
      const data = await aiRuntime.research.listSessions(currentWorkspace.id);
      setSessions(data);
      if (!selectedSessionId && data.length > 0) {
        setSelectedSessionId(data[0].id);
      }
    } catch (err) {
      console.error("[useResearch] Failed to fetch sessions:", err);
    }
  }, [currentWorkspace.id, selectedSessionId]);

  const fetchSessionDetails = useCallback(async (sessionId: string) => {
    try {
      const [evData, hypData, repData] = await Promise.all([
        aiRuntime.research.getEvidence(sessionId),
        aiRuntime.research.getHypotheses(sessionId),
        aiRuntime.research.getReport(sessionId),
      ]);
      setEvidenceList(evData);
      setHypotheses(hypData);
      setReport(repData || null);
    } catch (err) {
      console.error("[useResearch] Failed to fetch session details:", err);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  useEffect(() => {
    if (selectedSessionId) {
      fetchSessionDetails(selectedSessionId);
    }
  }, [selectedSessionId, fetchSessionDetails]);

  // Subscribe to Runtime Event Bus for Real-time Deep Research Progress
  useEffect(() => {
    const unsubStarted = runtimeEventBus.subscribe("RESEARCH_STARTED", () => {
      setIsExecuting(true);
      setProgressPercent(10);
      setExecutionMessage("Formulating Deep Research Strategy...");
    });

    const unsubProgress = runtimeEventBus.subscribe("RESEARCH_PROGRESS_UPDATED", (event) => {
      setProgressPercent(event.payload.progressPercent || 50);
      setExecutionMessage(event.payload.message || "Executing research phase...");
    });

    const unsubEvidence = runtimeEventBus.subscribe("RESEARCH_EVIDENCE_ADDED", () => {
      if (selectedSessionId) fetchSessionDetails(selectedSessionId);
    });

    const unsubCompleted = runtimeEventBus.subscribe("RESEARCH_COMPLETED", (event) => {
      setIsExecuting(false);
      setProgressPercent(100);
      setExecutionMessage("Deep Research completed!");
      fetchSessions();
      if (event.payload.sessionId) {
        setSelectedSessionId(event.payload.sessionId);
        fetchSessionDetails(event.payload.sessionId);
      }
    });

    const unsubFailed = runtimeEventBus.subscribe("RESEARCH_FAILED", (event) => {
      setIsExecuting(false);
      setExecutionMessage(`Research failed: ${event.payload.reason || "Unknown error"}`);
    });

    return () => {
      unsubStarted();
      unsubProgress();
      unsubEvidence();
      unsubCompleted();
      unsubFailed();
    };
  }, [fetchSessions, fetchSessionDetails, selectedSessionId]);

  const startResearch = async (title: string, objective: string, depthLevel: "fast" | "standard" | "deep" | "exhaustive" = "standard") => {
    setIsExecuting(true);
    setProgressPercent(5);
    setExecutionMessage("Initializing Research Engine...");
    try {
      const { session } = await aiRuntime.research.start({
        workspaceId: currentWorkspace.id,
        userId: "usr_01",
        title,
        objective,
        depthLevel,
      });
      setSelectedSessionId(session.id);
      await fetchSessions();
    } catch (err: any) {
      setIsExecuting(false);
      setExecutionMessage(`Error starting research: ${err.message}`);
    }
  };

  const selectedSession = sessions.find((s) => s.id === selectedSessionId) || null;

  return {
    sessions,
    selectedSession,
    selectedSessionId,
    setSelectedSessionId,
    evidenceList,
    hypotheses,
    report,
    isExecuting,
    executionMessage,
    progressPercent,
    startResearch,
    refresh: fetchSessions,
  };
}
