import React from 'react';
import { useStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Settings2, Sliders, Mic2, Drum, Speaker, Music } from 'lucide-react';

export function InstrumentRack() {
  const { activeTrack, tracks, genre, setGenre } = useStore();
  const instruments = tracks[activeTrack].instruments;

  const getIcon = (category: string) => {
    switch(category) {
      case 'vocal': return <Mic2 className="w-3 h-3" />;
      case 'drums': return <Drum className="w-3 h-3" />;
      case 'bass': return <Speaker className="w-3 h-3" />;
      default: return <Music className="w-3 h-3" />;
    }
  };

  return (
    <div className="h-full flex flex-col glass-card rounded-lg overflow-hidden border-l-4 border-l-primary/50">
      <div className="h-12 border-b border-white/5 flex items-center px-4 justify-between bg-black/20">
        <h2 className="text-sm font-medium tracking-wider text-muted-foreground uppercase font-mono flex items-center gap-2">
          <Settings2 className="w-4 h-4 text-primary" />
          Global Context
        </h2>
      </div>

      <div className="flex-1 p-4 overflow-y-auto no-scrollbar space-y-6">
        {/* Genre Selector */}
        <div className="space-y-3 bg-black/20 p-3 rounded border border-white/5">
          <label className="text-xs font-mono text-primary uppercase tracking-widest mb-2 block">Genre Grammar</label>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <span className="text-[9px] uppercase tracking-wider text-white/40">Main Genre</span>
              <input 
                className="w-full bg-black/60 border border-white/10 rounded-sm px-2 py-1 text-xs text-white focus:border-primary/50 outline-none font-mono"
                value={genre.main}
                onChange={(e) => setGenre({ main: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <span className="text-[9px] uppercase tracking-wider text-white/40">Subgenre</span>
              <input 
                className="w-full bg-black/60 border border-white/10 rounded-sm px-2 py-1 text-xs text-white focus:border-primary/50 outline-none font-mono"
                value={genre.sub}
                onChange={(e) => setGenre({ sub: e.target.value })}
              />
            </div>
             <div className="space-y-1">
              <span className="text-[9px] uppercase tracking-wider text-white/40">Era</span>
              <input 
                className="w-full bg-black/60 border border-white/10 rounded-sm px-2 py-1 text-xs text-white focus:border-primary/50 outline-none font-mono"
                value={genre.era}
                onChange={(e) => setGenre({ era: e.target.value })}
              />
            </div>
             <div className="space-y-1">
              <span className="text-[9px] uppercase tracking-wider text-white/40">Region</span>
              <input 
                className="w-full bg-black/60 border border-white/10 rounded-sm px-2 py-1 text-xs text-white focus:border-primary/50 outline-none font-mono"
                value={genre.region}
                onChange={(e) => setGenre({ region: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent w-full" />

        {/* Instruments List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono text-primary uppercase tracking-widest">Entities (Instruments)</label>
            <Sliders className="w-3 h-3 text-white/20" />
          </div>
          
          <div className="space-y-1">
            {instruments.map(inst => (
              <div key={inst.id} className="relative flex items-center justify-between p-2 rounded bg-white/[0.02] hover:bg-white/5 border border-white/5 hover:border-white/10 transition-all group overflow-hidden">
                <div className="flex items-center gap-3 z-10">
                  <div className={cn(
                    "w-6 h-6 rounded flex items-center justify-center text-black/80 shadow-lg",
                    inst.category === 'drums' ? "bg-red-500 shadow-red-500/20" :
                    inst.category === 'bass' ? "bg-blue-500 shadow-blue-500/20" :
                    inst.category === 'vocal' ? "bg-purple-500 shadow-purple-500/20" :
                    "bg-yellow-500 shadow-yellow-500/20"
                  )}>
                    {getIcon(inst.category)}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-white/90 font-display tracking-tight">{inst.name}</span>
                    <span className="text-[10px] text-white/40 font-mono tracking-wider">{inst.role}</span>
                  </div>
                </div>
                
                {/* Simulated VU Meter Background */}
                <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-black/50 to-transparent pointer-events-none" />
                
                {/* Controls */}
                <div className="flex gap-2 opacity-50 group-hover:opacity-100 transition-opacity z-10">
                   <div className="w-8 h-8 rounded-full border border-white/10 relative bg-black/40 hover:border-primary/50 cursor-pointer shadow-inner" title="Level">
                      <div className="absolute inset-[2px] rounded-full border border-white/5" />
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1px] h-3 bg-white/80 rotate-45 transform origin-bottom transition-transform group-hover:rotate-[60deg]" />
                   </div>
                   <div className="w-8 h-8 rounded-full border border-white/10 relative bg-black/40 hover:border-secondary/50 cursor-pointer shadow-inner" title="Pan">
                      <div className="absolute inset-[2px] rounded-full border border-white/5" />
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1px] h-3 bg-white/80 rotate-0 transform origin-bottom transition-transform group-hover:rotate-[-15deg]" />
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Footer Info */}
      <div className="p-2 bg-black/40 border-t border-white/5 text-[10px] text-white/20 font-mono text-center">
        AUDIO ENGINE: INTENT_ONLY_MODE
      </div>
    </div>
  );
}
