import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Bot, Sparkles, Search, CheckCircle2, AlertCircle, X, Loader2, Copy, Check } from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { useStore } from "@/lib/store";
import { toast } from "sonner";

interface AgentLog {
  id: number;
  runType: string;
  status: string;
  summary: string | null;
  details: any;
  suggestions: any;
  createdAt: string;
}

interface PromptAnalysis {
  score: number;
  feedback: string[];
  optimizedPrompt: string;
}

interface AgentPanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentPrompt?: string;
}

export function AgentPanel({ isOpen, onClose, currentPrompt }: AgentPanelProps) {
  const [activeTab, setActiveTab] = useState<"analyze" | "improve" | "logs">("analyze");
  const [improvementTopic, setImprovementTopic] = useState("");

  const { data: logs = [], isLoading: logsLoading } = useQuery<AgentLog[]>({
    queryKey: ["/api/agent/logs"],
    queryFn: async () => {
      const res = await fetch("/api/agent/logs?limit=20", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch logs");
      return res.json();
    },
    enabled: isOpen,
  });

  const analyzeMutation = useMutation<PromptAnalysis, Error, string>({
    mutationFn: async (prompt: string) => {
      const res = await fetch("/api/agent/analyze-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ prompt }),
      });
      if (!res.ok) throw new Error("Analysis failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/agent/logs"] });
    },
  });

  const improvementMutation = useMutation({
    mutationFn: async (topic: string) => {
      const res = await fetch("/api/agent/search-improvements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ topic }),
      });
      if (!res.ok) throw new Error("Search failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/agent/logs"] });
    },
  });

  const runAssessmentMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/agent/full-assessment", {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Assessment failed");
      return res.json();
    },
    onSuccess: () => {
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["/api/agent/logs"] });
      }, 3000);
    },
  });

  const updateDocument = useStore((s) => s.updateDocument);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const applyOptimizedPrompt = (prompt: string) => {
    // This is a simplified implementation - in a real app you might want to parse the prompt
    // For now we'll just update a hypothetical 'globalDescription' or similar
    // Since the compiler generates the prompt from the doc, we'd ideally reverse-map it
    // But for this prototype, we'll just show the feedback.
    toast.info("Prompt optimization suggestions applied to analysis view.");
  };

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-card/95 backdrop-blur-lg border-l border-white/10 z-50 flex flex-col shadow-2xl" data-testid="agent-panel">
      <div className="h-14 border-b border-white/10 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-primary" />
          <span className="font-semibold text-white">AI Assistant</span>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0" data-testid="button-close-agent">
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex border-b border-white/10">
        {(["analyze", "improve", "logs"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 text-sm font-mono uppercase tracking-wider transition-colors ${
              activeTab === tab ? "text-primary border-b-2 border-primary" : "text-white/50 hover:text-white/70"
            }`}
            data-testid={`tab-${tab}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeTab === "analyze" && (
          <>
            <div className="space-y-2">
              <p className="text-sm text-white/60">
                Analyze your current prompt for quality, clarity, and optimization opportunities.
              </p>
              <Button
                onClick={() => currentPrompt && analyzeMutation.mutate(currentPrompt)}
                disabled={!currentPrompt || analyzeMutation.isPending}
                className="w-full"
                data-testid="button-analyze-prompt"
              >
                {analyzeMutation.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4 mr-2" />
                )}
                Analyze Current Prompt
              </Button>
            </div>

            {analyzeMutation.data && (
              <div className="space-y-3 bg-black/30 rounded-lg p-4 border border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-mono text-white/50">Quality Score</span>
                  <span
                    className={`text-2xl font-bold ${
                      analyzeMutation.data.score >= 80
                        ? "text-green-400"
                        : analyzeMutation.data.score >= 50
                        ? "text-yellow-400"
                        : "text-red-400"
                    }`}
                  >
                    {analyzeMutation.data.score}/100
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-mono text-white/50 uppercase">Feedback</span>
                  <ul className="space-y-1">
                    {analyzeMutation.data.feedback.map((item, i) => (
                      <li key={i} className="text-sm text-white/70 flex items-start gap-2">
                        <CheckCircle2 className="w-3 h-3 mt-1 text-primary shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {analyzeMutation.data.optimizedPrompt && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-white/50 uppercase">Optimized Version</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6" 
                        onClick={() => copyToClipboard(analyzeMutation.data!.optimizedPrompt)}
                      >
                        {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                      </Button>
                    </div>
                    <p className="text-sm text-white/80 bg-black/40 p-2 rounded border border-white/5">
                      {analyzeMutation.data.optimizedPrompt}
                    </p>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {activeTab === "improve" && (
          <>
            <div className="space-y-2">
              <p className="text-sm text-white/60">
                Search for best practices and improvement suggestions for specific areas.
              </p>
              <Textarea
                value={improvementTopic}
                onChange={(e) => setImprovementTopic(e.target.value)}
                placeholder="e.g., better prompt structure for electronic music..."
                className="bg-black/40 border-white/10 text-sm"
                rows={3}
                data-testid="input-improvement-topic"
              />
              <Button
                onClick={() => improvementMutation.mutate(improvementTopic)}
                disabled={!improvementTopic.trim() || improvementMutation.isPending}
                className="w-full"
                data-testid="button-search-improvements"
              >
                {improvementMutation.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Search className="w-4 h-4 mr-2" />
                )}
                Search Improvements
              </Button>
            </div>

            {improvementMutation.data?.suggestions && (
              <div className="space-y-2">
                {improvementMutation.data.suggestions.map((s: any, i: number) => (
                  <div key={i} className="bg-black/30 rounded-lg p-3 border border-white/10 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-white">{s.area}</span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded ${
                          s.priority === "high"
                            ? "bg-red-500/20 text-red-400"
                            : s.priority === "medium"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-green-500/20 text-green-400"
                        }`}
                      >
                        {s.priority}
                      </span>
                    </div>
                    <p className="text-sm text-white/70">{s.suggestion}</p>
                    <p className="text-xs text-white/40">{s.implementationHint}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-4 border-t border-white/10">
              <Button
                onClick={() => runAssessmentMutation.mutate()}
                disabled={runAssessmentMutation.isPending}
                variant="outline"
                className="w-full"
                data-testid="button-run-assessment"
              >
                {runAssessmentMutation.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Bot className="w-4 h-4 mr-2" />
                )}
                Run Full QA Assessment
              </Button>
            </div>
          </>
        )}

        {activeTab === "logs" && (
          <>
            {logsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : logs.length === 0 ? (
              <p className="text-sm text-white/40 text-center py-8">No agent activity yet</p>
            ) : (
              <div className="space-y-2">
                {logs.map((log) => (
                  <div key={log.id} className="bg-black/30 rounded-lg p-3 border border-white/10">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-mono text-primary">{log.runType}</span>
                      {log.status === "completed" ? (
                        <CheckCircle2 className="w-3 h-3 text-green-400" />
                      ) : (
                        <AlertCircle className="w-3 h-3 text-yellow-400" />
                      )}
                    </div>
                    <p className="text-sm text-white/70">{log.summary}</p>
                    <p className="text-xs text-white/30 mt-1">
                      {new Date(log.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
