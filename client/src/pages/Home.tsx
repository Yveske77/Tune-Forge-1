import React from 'react';
import { Shell } from '@/components/layout/Shell';
import { Tube } from '@/components/sequencer/Tube';
import { InstrumentRack } from '@/components/sequencer/InstrumentRack';
import { PromptPreview } from '@/components/sequencer/PromptPreview';
import { useStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Layers, Activity } from 'lucide-react';

export default function Home() {
  const { activeTrack, setActiveTrack } = useStore();

  return (
    <Shell>
      {/* Top Bar */}
      <header className="h-14 border-b border-white/10 bg-background/50 backdrop-blur-md px-6 flex items-center justify-between shrink-0 z-50">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center shadow-[0_0_15px_rgba(124,58,237,0.5)]">
            <Activity className="text-white w-5 h-5" />
          </div>
          <h1 className="text-xl font-display font-bold tracking-tight text-white">DAiW <span className="text-white/30 text-sm font-mono font-normal ml-2">INTENTION ENGINE v0.9</span></h1>
        </div>
        
        <div className="flex items-center gap-2 bg-black/40 p-1 rounded-lg border border-white/5">
           <button 
             onClick={() => setActiveTrack('A')}
             className={cn(
               "px-4 py-1.5 rounded text-sm font-mono font-bold transition-all",
               activeTrack === 'A' ? "bg-primary text-white shadow-lg" : "text-white/40 hover:text-white/70"
             )}
           >
             Arrangement A
           </button>
           <button 
             onClick={() => setActiveTrack('B')}
             className={cn(
               "px-4 py-1.5 rounded text-sm font-mono font-bold transition-all",
               activeTrack === 'B' ? "bg-secondary text-black shadow-lg" : "text-white/40 hover:text-white/70"
             )}
           >
             Arrangement B
           </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 p-4 grid grid-cols-12 gap-4 min-h-0">
        {/* Left: Global Context / Instruments */}
        <div className="col-span-3 h-full min-h-0">
           <InstrumentRack />
        </div>

        {/* Center: The Tube (Timeline) */}
        <div className="col-span-6 h-full min-h-0 flex flex-col">
          <Tube />
        </div>

        {/* Right: Compiler Output */}
        <div className="col-span-3 h-full min-h-0">
           <PromptPreview />
        </div>
      </div>
    </Shell>
  );
}
