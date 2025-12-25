import React from 'react';
import { useStore, uid } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Settings2, Sliders, Mic2, Drum, Speaker, Music, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import dictionaries from '@/data/dictionaries.json';

export function InstrumentRack() {
  const doc = useStore((s) => s.doc);
  const setArchitecture = useStore((s) => s.setArchitecture);
  const setMeta = useStore((s) => s.setMeta);
  const setLanes = useStore((s) => s.setLanes);
  const updateLayerItem = useStore((s) => s.updateLayerItem);

  const layers = doc.layers;
  const architecture = doc.architecture;

  const getIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('vocal') || lower.includes('voice')) return <Mic2 className="w-3 h-3" />;
    if (lower.includes('drum') || lower.includes('kick') || lower.includes('snare') || lower.includes('hat')) return <Drum className="w-3 h-3" />;
    if (lower.includes('bass')) return <Speaker className="w-3 h-3" />;
    return <Music className="w-3 h-3" />;
  };

  const toggleGenre = (genre: string) => {
    const current = [...architecture.genreTags];
    if (current.includes(genre)) {
      setArchitecture({ genreTags: current.filter(g => g !== genre) });
    } else if (current.length < 3) {
      setArchitecture({ genreTags: [...current, genre] });
    }
  };

  return (
    <div className="h-full flex flex-col glass-card rounded-lg overflow-hidden border-l-4 border-l-primary/50" data-testid="instrument-rack">
      <div className="h-12 border-b border-white/5 flex items-center px-4 justify-between bg-black/20">
        <h2 className="text-sm font-medium tracking-wider text-muted-foreground uppercase font-mono flex items-center gap-2">
          <Settings2 className="w-4 h-4 text-primary" />
          Global Context
        </h2>
      </div>

      <div className="flex-1 p-4 overflow-y-auto no-scrollbar space-y-6">
        {/* Meta */}
        <div className="space-y-3 bg-black/20 p-3 rounded border border-white/5">
          <label className="text-xs font-mono text-primary uppercase tracking-widest mb-2 block">Meta</label>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <span className="text-[9px] uppercase tracking-wider text-white/40">Model</span>
              <select 
                className="w-full bg-black/60 border border-white/10 rounded-sm px-2 py-1 text-xs text-white focus:border-primary/50 outline-none font-mono"
                value={doc.meta.modelVersion}
                onChange={(e) => setMeta({ modelVersion: e.target.value })}
                data-testid="select-model-version"
              >
                <option value="v4.5">v4.5</option>
                <option value="v5">v5</option>
              </select>
            </div>
            <div className="space-y-1">
              <span className="text-[9px] uppercase tracking-wider text-white/40">Voice</span>
              <select 
                className="w-full bg-black/60 border border-white/10 rounded-sm px-2 py-1 text-xs text-white focus:border-primary/50 outline-none font-mono"
                value={doc.meta.voiceType}
                onChange={(e) => setMeta({ voiceType: e.target.value })}
                data-testid="select-voice-type"
              >
                <option>Adult Male</option>
                <option>Adult Female</option>
                <option>Duet</option>
              </select>
            </div>
            <div className="space-y-1">
              <span className="text-[9px] uppercase tracking-wider text-white/40">Language</span>
              <select 
                className="w-full bg-black/60 border border-white/10 rounded-sm px-2 py-1 text-xs text-white focus:border-primary/50 outline-none font-mono"
                value={doc.meta.language}
                onChange={(e) => setMeta({ language: e.target.value })}
                data-testid="select-language"
              >
                {['English', 'French', 'German', 'Spanish', 'Italian', 'Portuguese', 'Japanese', 'Korean', 'Chinese'].map(l => (
                  <option key={l}>{l}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <span className="text-[9px] uppercase tracking-wider text-white/40">Title</span>
              <input 
                className="w-full bg-black/60 border border-white/10 rounded-sm px-2 py-1 text-xs text-white focus:border-primary/50 outline-none font-mono"
                value={doc.meta.title}
                onChange={(e) => setMeta({ title: e.target.value })}
                placeholder="Song title..."
                data-testid="input-song-title"
              />
            </div>
          </div>
        </div>

        {/* Architecture */}
        <div className="space-y-3 bg-black/20 p-3 rounded border border-white/5">
          <label className="text-xs font-mono text-primary uppercase tracking-widest mb-2 block">Architecture</label>
          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1">
              <span className="text-[9px] uppercase tracking-wider text-white/40">BPM</span>
              <input 
                type="number"
                className="w-full bg-black/60 border border-white/10 rounded-sm px-2 py-1 text-xs text-white focus:border-primary/50 outline-none font-mono"
                value={architecture.tempoBpm}
                onChange={(e) => setArchitecture({ tempoBpm: Number(e.target.value) })}
                data-testid="input-tempo-bpm"
              />
            </div>
            <div className="space-y-1">
              <span className="text-[9px] uppercase tracking-wider text-white/40">Key</span>
              <select 
                className="w-full bg-black/60 border border-white/10 rounded-sm px-2 py-1 text-xs text-white focus:border-primary/50 outline-none font-mono"
                value={architecture.key}
                onChange={(e) => setArchitecture({ key: e.target.value })}
                data-testid="select-key"
              >
                {['C Major', 'C Minor', 'D Major', 'D Minor', 'E Major', 'E Minor', 'F Major', 'F Minor', 'G Major', 'G Minor', 'A Major', 'A Minor', 'B Major', 'B Minor'].map(k => (
                  <option key={k}>{k}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <span className="text-[9px] uppercase tracking-wider text-white/40">Time</span>
              <select 
                className="w-full bg-black/60 border border-white/10 rounded-sm px-2 py-1 text-xs text-white focus:border-primary/50 outline-none font-mono"
                value={architecture.timeSignature}
                onChange={(e) => setArchitecture({ timeSignature: e.target.value })}
                data-testid="select-time-signature"
              >
                {['4/4', '3/4', '6/8', '2/4', '5/4', '7/8'].map(t => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Genres */}
          <div className="space-y-2 mt-3">
            <span className="text-[9px] uppercase tracking-wider text-white/40">Genres (max 3)</span>
            <div className="flex flex-wrap gap-1">
              {architecture.genreTags.map(g => (
                <span key={g} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30 flex items-center gap-1">
                  {g}
                  <button onClick={() => toggleGenre(g)} className="hover:text-white">
                    <X className="w-2.5 h-2.5" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
              {dictionaries.genres.slice(0, 30).filter(g => !architecture.genreTags.includes(g)).map(g => (
                <button 
                  key={g} 
                  onClick={() => toggleGenre(g)}
                  className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/80 transition-colors"
                  data-testid={`button-genre-${g}`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent w-full" />

        {/* Global Lanes */}
        <div className="space-y-3">
          <label className="text-xs font-mono text-primary uppercase tracking-widest">Global Lanes</label>
          {(['energy', 'density', 'brightness', 'vocalPresence'] as const).map(lane => (
            <div key={lane} className="flex items-center gap-2">
              <span className="text-[10px] text-white/50 w-16 capitalize">{lane}</span>
              <input 
                type="range"
                min="0"
                max="100"
                value={doc.lanes[lane]}
                onChange={(e) => setLanes({ [lane]: Number(e.target.value) })}
                className="flex-1 h-1 bg-white/10 rounded appearance-none cursor-pointer"
                data-testid={`slider-lane-${lane}`}
              />
              <span className="text-[10px] text-white/50 w-8 text-right">{doc.lanes[lane]}</span>
            </div>
          ))}
        </div>

        <div className="h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent w-full" />

        {/* Layers */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono text-primary uppercase tracking-widest">Layers</label>
            <Sliders className="w-3 h-3 text-white/20" />
          </div>
          
          {/* Instruments */}
          <div className="space-y-1">
            <span className="text-[9px] uppercase tracking-wider text-white/40">Instruments</span>
            {layers.instruments.flatMap(group => 
              group.items.map((item, idx) => (
                <div key={`${group.id}-${idx}`} className="relative flex items-center justify-between p-2 rounded bg-white/[0.02] hover:bg-white/5 border border-white/5 hover:border-white/10 transition-all group overflow-hidden">
                  <div className="flex items-center gap-3 z-10">
                    <div className="w-6 h-6 rounded flex items-center justify-center text-black/80 shadow-lg bg-yellow-500 shadow-yellow-500/20">
                      {getIcon(item.name)}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-white/90 font-display tracking-tight">{item.name}</span>
                      <span className="text-[10px] text-white/40 font-mono tracking-wider">{group.name}</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-white/40">{item.level}%</span>
                </div>
              ))
            )}
          </div>

          {/* Voices */}
          <div className="space-y-1">
            <span className="text-[9px] uppercase tracking-wider text-white/40">Voices</span>
            {layers.voices.flatMap(group => 
              group.items.map((item, idx) => (
                <div key={`${group.id}-${idx}`} className="relative flex items-center justify-between p-2 rounded bg-white/[0.02] hover:bg-white/5 border border-white/5 hover:border-white/10 transition-all group overflow-hidden">
                  <div className="flex items-center gap-3 z-10">
                    <div className="w-6 h-6 rounded flex items-center justify-center text-black/80 shadow-lg bg-purple-500 shadow-purple-500/20">
                      <Mic2 className="w-3 h-3" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-white/90 font-display tracking-tight">{item.name}</span>
                      <span className="text-[10px] text-white/40 font-mono tracking-wider">{group.name}</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-white/40">{item.level}%</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      
      <div className="p-2 bg-black/40 border-t border-white/5 text-[10px] text-white/20 font-mono text-center">
        AUDIO ENGINE: INTENT_ONLY_MODE
      </div>
    </div>
  );
}
