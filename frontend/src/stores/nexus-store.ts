import { create } from "zustand";
import { AgentMode, ChatThread, Workspace } from "@/types/nexus";

interface NexusState {
  currentWorkspace: Workspace;
  activeMode: AgentMode;
  selectedModel: string;
  isCommandMenuOpen: boolean;
  isAgentDrawerOpen: boolean;
  activeThreadId: string | null;
  threads: ChatThread[];
  
  setCurrentWorkspace: (ws: Workspace) => void;
  setActiveMode: (mode: AgentMode) => void;
  setSelectedModel: (model: string) => void;
  setCommandMenuOpen: (open: boolean) => void;
  setAgentDrawerOpen: (open: boolean) => void;
  setActiveThreadId: (id: string | null) => void;
  setThreads: (threads: ChatThread[]) => void;
}

export const useNexusStore = create<NexusState>((set) => ({
  currentWorkspace: {
    id: "ws_default_01",
    name: "Nexus Enterprise AI Core",
    slug: "nexus-enterprise-core",
    description: "Default Enterprise Knowledge Workspace"
  },
  activeMode: "agentic_rag",
  selectedModel: "gpt-4o",
  isCommandMenuOpen: false,
  isAgentDrawerOpen: true,
  activeThreadId: null,
  threads: [],

  setCurrentWorkspace: (ws) => set({ currentWorkspace: ws }),
  setActiveMode: (mode) => set({ activeMode: mode }),
  setSelectedModel: (model) => set({ selectedModel: model }),
  setCommandMenuOpen: (open) => set({ isCommandMenuOpen: open }),
  setAgentDrawerOpen: (open) => set({ isAgentDrawerOpen: open }),
  setActiveThreadId: (id) => set({ activeThreadId: id }),
  setThreads: (threads) => set({ threads }),
}));
