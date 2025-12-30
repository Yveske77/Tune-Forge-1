import React, { useState, useMemo } from 'react';
import { useStore, uid } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Settings2, Sliders, Mic2, Drum, Speaker, Music, Plus, X, ChevronDown, ChevronRight, Palette, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import dictionaries from '@/data/dictionaries.json';
import { TemplateSelector } from '@/components/TemplateSelector';
import { genreSubgenres } from '@/data/subgenres';
import { timbreOptions, textureOptions, getEmotionalDescriptor, soundDesignPresets } from '@/data/soundDesign';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function InstrumentRack() {
  const doc = useStore((s) => s.doc);
  const setArchitecture = useStore((s) => s.setArchitecture);
  const setMeta = useStore((s) => s.setMeta);
  const setLanes = useStore((s) => s.setLanes);
  const setNuance = useStore((s) => s.setNuance);
  const updateLayerItem = useStore((s) => s.updateLayerItem);
  const setDoc = useStore((s) => s.setDoc);

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    meta: true,
    architecture: true,
    soundDesign: false,
    lanes: true,
    layers: true,
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const layers = doc.layers;
  const architecture = doc.architecture;

  const availableSubgenres = useMemo(() => {
    const subgenres = new Set<string>();
    architecture.genreTags.forEach(genre => {
      const subs = genreSubgenres[genre];
      if (subs) {
        subs.forEach(s => subgenres.add(s));
      }
    });
    return Array.from(subgenres).sort();
  }, [architecture.genreTags]);

  const addLayerGroup = (kind: 'instruments' | 'voices') => {
    const name = kind === 'voices' ? 'New Voice Group' : 'New Instrument Group';
    const group = { 
      id: uid(kind === 'voices' ? 'vgrp' : 'grp'), 
      name, 
      items: [] 
    };
    setDoc(d => ({
      ...d, 
      layers: {
        ...d.layers, 
        [kind]: [...d.layers[kind], group]
      }
    }));
  };

  const addLayerItem = (kind: 'instruments' | 'voices', groupId: string, itemName: string) => {
    setDoc(d => ({
      ...d,
      layers: {
        ...d.layers,
        [kind]: d.layers[kind].map(g => {
          if (g.id !== groupId) return g;
          const exists = g.items.some(item => item.name === itemName);
          if (exists) return g;
          return {
            ...g,
            items: [...g.items, { name: itemName, level: 70, position: 'center' }]
          };
        })
      }
    }));
  };

  const removeLayerItem = (kind: 'instruments' | 'voices', groupId: string, itemName: string) => {
    setDoc(d => ({
      ...d,
      layers: {
        ...d.layers,
        [kind]: d.layers[kind].map(g => {
          if (g.id !== groupId) return g;
          return {
            ...g,
            items: g.items.filter(item => item.name !== itemName)
          };
        })
      }
    }));
  };

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
        {/* Template Selector */}
        <TemplateSelector />
        
        {/* Meta */}
        <Collapsible open={openSections.meta} onOpenChange={() => toggleSection('meta')}>
          <div className="bg-black/20 rounded border border-white/5">
            <CollapsibleTrigger className="w-full p-3 flex items-center justify-between hover:bg-white/5 transition-colors">
              <label className="text-xs font-mono text-primary uppercase tracking-widest cursor-pointer">Meta</label>
              <ChevronDown className={cn("w-4 h-4 text-white/40 transition-transform", openSections.meta && "rotate-180")} />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="px-3 pb-3 space-y-3">
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
            </CollapsibleContent>
          </div>
        </Collapsible>

        {/* Architecture */}
        <Collapsible open={openSections.architecture} onOpenChange={() => toggleSection('architecture')}>
          <div className="bg-black/20 rounded border border-white/5">
            <CollapsibleTrigger className="w-full p-3 flex items-center justify-between hover:bg-white/5 transition-colors">
              <label className="text-xs font-mono text-primary uppercase tracking-widest cursor-pointer">Architecture</label>
              <ChevronDown className={cn("w-4 h-4 text-white/40 transition-transform", openSections.architecture && "rotate-180")} />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="px-3 pb-3 space-y-3">
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

                {/* Subgenre Selector */}
                {availableSubgenres.length > 0 && (
                  <div className="space-y-2 mt-3">
                    <span className="text-[9px] uppercase tracking-wider text-white/40">Subgenre</span>
                    <select
                      className="w-full bg-black/60 border border-white/10 rounded-sm px-2 py-1.5 text-xs text-white focus:border-primary/50 outline-none font-mono"
                      value={architecture.subgenre || ''}
                      onChange={(e) => setArchitecture({ subgenre: e.target.value || undefined })}
                      data-testid="select-subgenre"
                    >
                      <option value="">Select subgenre...</option>
                      {availableSubgenres.map(sub => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                    </select>
                    {architecture.subgenre && (
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary/20 text-secondary border border-secondary/30">
                          {architecture.subgenre}
                        </span>
                        <button 
                          onClick={() => setArchitecture({ subgenre: undefined })}
                          className="text-white/40 hover:text-white"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>

        {/* Global Lanes with Emotional Descriptors */}
        <Collapsible open={openSections.lanes} onOpenChange={() => toggleSection('lanes')}>
          <div className="bg-black/20 rounded border border-white/5">
            <CollapsibleTrigger className="w-full p-3 flex items-center justify-between hover:bg-white/5 transition-colors">
              <label className="text-xs font-mono text-primary uppercase tracking-widest cursor-pointer">Global Lanes</label>
              <ChevronDown className={cn("w-4 h-4 text-white/40 transition-transform", openSections.lanes && "rotate-180")} />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="px-3 pb-3 space-y-4">
                {(['energy', 'density', 'brightness', 'vocalPresence'] as const).map(lane => {
                  const emotionalDesc = getEmotionalDescriptor(lane, doc.lanes[lane]);
                  return (
                    <div key={lane} className="space-y-1">
                      <div className="flex items-center gap-2">
                        <label 
                          htmlFor={`lane-${lane}`}
                          className="text-[10px] text-white/50 w-20 capitalize"
                        >
                          {lane === 'vocalPresence' ? 'Vocal' : lane}
                        </label>
                        <input 
                          id={`lane-${lane}`}
                          type="range"
                          min="0"
                          max="100"
                          step="5"
                          value={doc.lanes[lane]}
                          onChange={(e) => setLanes({ [lane]: Number(e.target.value) })}
                          className="flex-1 h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-primary"
                          aria-label={`${lane} level: ${doc.lanes[lane]} percent`}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-valuenow={doc.lanes[lane]}
                          data-testid={`slider-lane-${lane}`}
                        />
                        <span className="text-[10px] text-white/50 w-8 text-right font-mono">{doc.lanes[lane]}</span>
                      </div>
                      <p className="text-[9px] text-white/30 italic pl-20 leading-tight">{emotionalDesc}</p>
                    </div>
                  );
                })}
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>

        {/* Sound Design */}
        <Collapsible open={openSections.soundDesign} onOpenChange={() => toggleSection('soundDesign')}>
          <div className="bg-black/20 rounded border border-white/5">
            <CollapsibleTrigger className="w-full p-3 flex items-center justify-between hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-2">
                <label className="text-xs font-mono text-primary uppercase tracking-widest cursor-pointer">Sound Design</label>
                <Palette className="w-3 h-3 text-white/20" />
              </div>
              <ChevronDown className={cn("w-4 h-4 text-white/40 transition-transform", openSections.soundDesign && "rotate-180")} />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="px-3 pb-3 space-y-4">
                {/* Timbre */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] uppercase tracking-wider text-white/40">Timbre</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="w-3 h-3 text-white/30" />
                        </TooltipTrigger>
                        <TooltipContent side="right" className="max-w-xs">
                          <p className="text-xs">The tonal quality or color of the sound</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <select
                    className="w-full bg-black/60 border border-white/10 rounded-sm px-2 py-1.5 text-xs text-white focus:border-primary/50 outline-none"
                    value={doc.nuance.mix.find(m => timbreOptions.some(t => t.id === m)) || ''}
                    onChange={(e) => {
                      const newMix = doc.nuance.mix.filter(m => !timbreOptions.some(t => t.id === m));
                      if (e.target.value) newMix.push(e.target.value);
                      setNuance({ mix: newMix });
                    }}
                    aria-label="Select sound timbre"
                    data-testid="select-timbre"
                  >
                    <option value="">Select timbre...</option>
                    {timbreOptions.map(opt => (
                      <option key={opt.id} value={opt.id}>{opt.name} - {opt.description}</option>
                    ))}
                  </select>
                </div>

                {/* Texture */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] uppercase tracking-wider text-white/40">Texture</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="w-3 h-3 text-white/30" />
                        </TooltipTrigger>
                        <TooltipContent side="right" className="max-w-xs">
                          <p className="text-xs">The surface quality and processing of the sound</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <select
                    className="w-full bg-black/60 border border-white/10 rounded-sm px-2 py-1.5 text-xs text-white focus:border-primary/50 outline-none"
                    value={doc.nuance.fx.find(f => textureOptions.some(t => t.id === f)) || ''}
                    onChange={(e) => {
                      const newFx = doc.nuance.fx.filter(f => !textureOptions.some(t => t.id === f));
                      if (e.target.value) newFx.push(e.target.value);
                      setNuance({ fx: newFx });
                    }}
                    aria-label="Select sound texture"
                    data-testid="select-texture"
                  >
                    <option value="">Select texture...</option>
                    {textureOptions.map(opt => (
                      <option key={opt.id} value={opt.id}>{opt.name} - {opt.description}</option>
                    ))}
                  </select>
                </div>

                {/* Quick Presets */}
                <div className="space-y-2">
                  <span className="text-[9px] uppercase tracking-wider text-white/40">Quick Presets</span>
                  <div className="flex flex-wrap gap-1">
                    {soundDesignPresets.map(preset => (
                      <TooltipProvider key={preset.id}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => {
                                const newMix = doc.nuance.mix.filter(m => !timbreOptions.some(t => t.id === m));
                                newMix.push(preset.timbre);
                                const newFx = doc.nuance.fx.filter(f => !textureOptions.some(t => t.id === f));
                                newFx.push(preset.texture);
                                setNuance({ mix: newMix, fx: newFx });
                              }}
                              className="text-[9px] px-2 py-1 rounded bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-colors"
                              data-testid={`preset-${preset.id}`}
                            >
                              {preset.name}
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            <p className="text-xs">{preset.description}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>

        {/* Layers */}
        <Collapsible open={openSections.layers} onOpenChange={() => toggleSection('layers')}>
          <div className="bg-black/20 rounded border border-white/5">
            <CollapsibleTrigger className="w-full p-3 flex items-center justify-between hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-2">
                <label className="text-xs font-mono text-primary uppercase tracking-widest cursor-pointer">Layers</label>
                <Sliders className="w-3 h-3 text-white/20" />
              </div>
              <ChevronDown className={cn("w-4 h-4 text-white/40 transition-transform", openSections.layers && "rotate-180")} />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="px-3 pb-3 space-y-3">
                {/* Instruments */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] uppercase tracking-wider text-white/40">Instruments</span>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-5 px-2 text-[10px]"
                      onClick={() => addLayerGroup('instruments')}
                    >
                      <Plus className="w-3 h-3 mr-1" /> Group
                    </Button>
                  </div>
                  {layers.instruments.map(group => (
                    <div key={group.id} className="space-y-1 p-2 bg-black/30 rounded border border-white/5">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] text-white/50 font-mono">{group.name}</span>
                        <select 
                          className="text-[10px] bg-black/60 border border-white/10 rounded px-1 py-0.5 text-white"
                          onChange={(e) => {
                            if (e.target.value) {
                              addLayerItem('instruments', group.id, e.target.value);
                              e.target.value = '';
                            }
                          }}
                          defaultValue=""
                        >
                          <option value="">+ Add...</option>
                          {dictionaries.instruments.map(inst => (
                            <option key={inst} value={inst}>{inst}</option>
                          ))}
                        </select>
                      </div>
                      {group.items.map((item, idx) => (
                        <div key={`${group.id}-${idx}`} className="relative flex items-center justify-between p-2 rounded bg-white/[0.02] hover:bg-white/5 border border-white/5 hover:border-white/10 transition-all group/item overflow-hidden">
                          <div className="flex items-center gap-3 z-10">
                            <div className="w-6 h-6 rounded flex items-center justify-center text-black/80 shadow-lg bg-yellow-500 shadow-yellow-500/20">
                              {getIcon(item.name)}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-white/90 font-display tracking-tight">{item.name}</span>
                              <span className="text-[10px] text-white/40 font-mono tracking-wider">{group.name}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-white/40">{item.level}%</span>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-5 w-5 opacity-0 group-hover/item:opacity-100 transition-opacity text-destructive hover:text-destructive"
                              onClick={() => removeLayerItem('instruments', group.id, item.name)}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                {/* Voices */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] uppercase tracking-wider text-white/40">Voices</span>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-5 px-2 text-[10px]"
                      onClick={() => addLayerGroup('voices')}
                    >
                      <Plus className="w-3 h-3 mr-1" /> Group
                    </Button>
                  </div>
                  {layers.voices.map(group => (
                    <div key={group.id} className="space-y-1 p-2 bg-black/30 rounded border border-white/5">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] text-white/50 font-mono">{group.name}</span>
                        <select 
                          className="text-[10px] bg-black/60 border border-white/10 rounded px-1 py-0.5 text-white"
                          onChange={(e) => {
                            if (e.target.value) {
                              addLayerItem('voices', group.id, e.target.value);
                              e.target.value = '';
                            }
                          }}
                          defaultValue=""
                        >
                          <option value="">+ Add...</option>
                          {dictionaries.voices.map(voice => (
                            <option key={voice} value={voice}>{voice}</option>
                          ))}
                        </select>
                      </div>
                      {group.items.map((item, idx) => (
                        <div key={`${group.id}-${idx}`} className="relative flex items-center justify-between p-2 rounded bg-white/[0.02] hover:bg-white/5 border border-white/5 hover:border-white/10 transition-all group/item overflow-hidden">
                          <div className="flex items-center gap-3 z-10">
                            <div className="w-6 h-6 rounded flex items-center justify-center text-black/80 shadow-lg bg-purple-500 shadow-purple-500/20">
                              <Mic2 className="w-3 h-3" />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-white/90 font-display tracking-tight">{item.name}</span>
                              <span className="text-[10px] text-white/40 font-mono tracking-wider">{group.name}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-white/40">{item.level}%</span>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-5 w-5 opacity-0 group-hover/item:opacity-100 transition-opacity text-destructive hover:text-destructive"
                              onClick={() => removeLayerItem('voices', group.id, item.name)}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>
      </div>
      
      <div className="p-2 bg-black/40 border-t border-white/5 text-[10px] text-white/20 font-mono text-center">
        AUDIO ENGINE: INTENT_ONLY_MODE
      </div>
    </div>
  );
}
