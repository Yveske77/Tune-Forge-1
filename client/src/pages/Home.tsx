import React, { useState, useMemo } from 'react';
import { Shell } from '@/components/layout/Shell';
import { Tube } from '@/components/sequencer/Tube';
import { InstrumentRack } from '@/components/sequencer/InstrumentRack';
import { PromptPreview } from '@/components/sequencer/PromptPreview';
import { ProjectManager } from '@/components/ProjectManager';
import { AgentPanel } from '@/components/AgentPanel';
import { ExportPanel } from '@/components/ExportPanel';
import { useStore } from '@/lib/store';
import { compileToSuno } from '@/lib/compiler';
import { cn } from '@/lib/utils';
import { Activity, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
  const doc = useStore((s) => s.doc);
  const currentProjectName = useStore((s) => s.currentProjectName);
  const setActiveVariant = useStore((s) => s.setActiveVariant);
  const activeVariant = doc.activeVariant;
  const [agentPanelOpen, setAgentPanelOpen] = useState(false);
  
  const compiledPrompt = useMemo(() => compileToSuno(doc), [doc]);

  return (
    <Shell>
      <header className="h-14 border-b border-white/10 bg-background/50 backdrop-blur-md px-6 flex items-center justify-between shrink-0 z-50">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-[0_0_15px_rgba(124,58,237,0.5)]">
            <Activity className="text-white w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-display font-bold tracking-tight text-white">DAiW <span className="text-white/30 text-sm font-mono font-normal ml-2">v1.0</span></h1>
            <p className="text-xs text-white/40 font-mono" data-testid="text-project-name">{currentProjectName}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <ProjectManager />
          <ExportPanel />
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setAgentPanelOpen(true)}
            className="h-8 gap-2 bg-primary/10 border-primary/30 hover:bg-primary/20"
            data-testid="button-open-agent"
          >
            <Bot className="w-4 h-4" />
            AI Assistant
          </Button>
          
          <div className="flex items-center gap-2 bg-black/40 p-1 rounded-lg border border-white/5">
            <button 
              onClick={() => setActiveVariant('A')}
              className={cn(
                "px-4 py-1.5 rounded text-sm font-mono font-bold transition-all",
                activeVariant === 'A' ? "bg-primary text-white shadow-lg" : "text-white/40 hover:text-white/70"
              )}
              data-testid="button-variant-a"
            >
              Arrangement A
            </button>
            <button 
              onClick={() => setActiveVariant('B')}
              className={cn(
                "px-4 py-1.5 rounded text-sm font-mono font-bold transition-all",
                activeVariant === 'B' ? "bg-secondary text-black shadow-lg" : "text-white/40 hover:text-white/70"
              )}
              data-testid="button-variant-b"
            >
              Arrangement B
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 p-4 grid grid-cols-12 gap-4 min-h-0">
        <div className="col-span-3 h-full min-h-0">
          <InstrumentRack />
        </div>

        <div className="col-span-6 h-full min-h-0 flex flex-col">
          <Tube />
        </div>

        <div className="col-span-3 h-full min-h-0">
          <PromptPreview />
        </div>
      </div>
      
      <AgentPanel 
        isOpen={agentPanelOpen} 
        onClose={() => setAgentPanelOpen(false)} 
        currentPrompt={compiledPrompt}
      />
    </Shell>
  );
}
