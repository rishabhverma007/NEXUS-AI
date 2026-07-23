"use client";

import { useEffect, useState } from "react";
import { apiKeyRepository, APIKeyItem } from "@/repositories/api-key-repository";
import { KeyRound, Plus, Trash2, Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function APIKeysPage() {
  const [keys, setKeys] = useState<APIKeyItem[]>([]);
  const [name, setName] = useState("");
  const [createdSecret, setCreatedSecret] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const loadKeys = async () => {
    const data = await apiKeyRepository.getAPIKeys();
    setKeys(data);
  };

  useEffect(() => {
    loadKeys();
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    const { secret } = await apiKeyRepository.generateAPIKey(name, ["rag:read", "agent:execute"]);
    setCreatedSecret(secret);
    setName("");
    await loadKeys();
  };

  const handleRevoke = async (id: string) => {
    await apiKeyRepository.revokeAPIKey(id);
    await loadKeys();
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
            <KeyRound className="h-6 w-6 text-cyan-400" />
            API Key Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Programmatic API keys for automated agent execution, CI/CD deployments, and webhook integration.
          </p>
        </div>

        <Button variant="primary" size="sm" className="gap-2" onClick={() => setShowModal(true)}>
          <Plus className="h-4 w-4" />
          <span>Generate New API Key</span>
        </Button>
      </div>

      <div className="space-y-4">
        {keys.map((k) => (
          <div key={k.id} className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div className="space-y-1">
              <div className="font-semibold text-slate-100 text-sm flex items-center gap-2">
                <span>{k.name}</span>
                <span className="font-mono text-xs text-cyan-400 font-bold">{k.keyPrefix}</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                <span>Created: {k.createdAt}</span>
                <span>•</span>
                <span>Scopes: {k.scopes.join(", ")}</span>
              </div>
            </div>

            <Button variant="ghost" size="sm" onClick={() => handleRevoke(k.id)} className="text-rose-400 hover:text-rose-300">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      {/* Generate Key Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-slate-100">Generate New API Key</h3>

            {createdSecret ? (
              <div className="space-y-3">
                <p className="text-xs text-amber-400 font-semibold">
                  Save your secret key now! It will never be shown again.
                </p>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-400 break-all">
                  {createdSecret}
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    setCreatedSecret(null);
                    setShowModal(false);
                  }}
                >
                  Done
                </Button>
              </div>
            ) : (
              <form onSubmit={handleGenerate} className="space-y-3">
                <Input
                  placeholder="Key Name (e.g. Production Deployment)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <div className="flex gap-3 pt-2">
                  <Button variant="outline" size="sm" className="w-full" onClick={() => setShowModal(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" size="sm" className="w-full" type="submit">
                    Generate Key
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
