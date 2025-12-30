import React, { useRef, useState, useMemo } from 'react';
import { useStore, LaneType, uid } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Plus, Trash2, ChevronDown, Check, Music, Mic2, ChevronRight, ListMusic, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
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
import { songStructurePresets } from '@/data/subgenres';
import { sectionDurationsByGenre, getRecommendedDuration } from '@/data/sectionDurations';

const MODIFIER_OPTIONS = {
  tempo: ["slow", "moderate", "fast", "very fast", "flexible", "rubato"],
  energy: ["gentle", "building", "explosive", "intense", "calm", "powerful", "subdued"],
  space: ["tight", "spacious", "intimate", "expansive", "compressed", "wide"],
  texture: ["smooth", "rough", "clean", "distorted", "layered", "sparse", "dense"],
  mood: ["energetic", "relaxed", "building", "aggressive", "melancholic", "euphoric", "hypnotic", "intimate"],
  dynamics: ["crescendo", "decrescendo", "punchy", "soft", "loud", "whispered"],
  style: ["anthemic", "minimal", "epic", "raw", "polished", "dreamy"],
};

export function Tube() {
  const doc = useStore((s) => s.doc);
  const addSection = useStore((s) => s.addSection);
  const updateSection = useStore((s) => s.updateSection);
  const removeSection = useStore((s) => s.removeSection);
  const setSectionLaneValue = useStore((s) => s.setSectionLaneValue);
  const setLayerAutomation = useStore((s) => s.setLayerAutomation);
  const [expandedLayers, setExpandedLayers] = useState<Record<string, boolean>>({});
  
  const sections = doc.arrangementTracks[doc.activeVariant];
  const layers = doc.layers;
  const sectionLayerAutomation = doc.sectionLayerAutomation;
  const containerRef = useRef<HTMLDivElement>(null);

  const currentGenre = useMemo(() => {
    const genres = doc.architecture.genreTags;
    for (const genre of genres) {
      if (sectionDurationsByGenre[genre]) return genre;
    }
    return 'Pop';
  }, [doc.architecture.genreTags]);

  const getLayerLevel = (sectionId: string, kind: 'instruments' | 'voices', groupId: string, itemName: string, defaultLevel: number): number => {
    const key = `${groupId}::${itemName}`;
    return sectionLayerAutomation[sectionId]?.[kind]?.[key]?.level ?? defaultLevel;
  };

  const toggleLayersExpanded = (sectionId: string) => {
    setExpandedLayers(prev => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  const SECTION_WIDTH = 180;
  const SECTION_GAP = 8;

  const getFlowPath = () => {
    if (sections.length < 2) return '';
    
    let d = '';
    
    sections.forEach((section, index) => {
      const x = index * (SECTION_WIDTH + SECTION_GAP) + (SECTION_WIDTH / 2);
      const sectionLanes = section.lanes || doc.lanes;
      const y = 100 - sectionLanes.energy;
      
      if (index === 0) {
        d += `M ${x} ${y}`;
      } else {
        const prevX = (index - 1) * (SECTION_WIDTH + SECTION_GAP) + (SECTION_WIDTH / 2);
        const prevLanes = sections[index - 1].lanes || doc.lanes;
        const prevY = 100 - prevLanes.energy;
        
        const cp1x = prevX + (SECTION_WIDTH / 2);
        const cp1y = prevY;
        const cp2x = x - (SECTION_WIDTH / 2);
        const cp2y = y;
        
        d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x} ${y}`;
      }
    });
    
    return d;
  };

  const handleAddSection = (type: string = 'Verse') => {
    const typeCount = sections.filter((s) => s.type === type).length;
    addSection({
      id: uid('sec'),
      type: type,
      label: `${type} ${typeCount + 1}`,
      content: '',
      modifiers: [],
      emphasis: [],
      tension: 50,
      bars: 8,
    });
  };

  const applyStructurePreset = (presetId: string) => {
    const preset = songStructurePresets.find(p => p.id === presetId);
    if (!preset) return;
    
    // Create new sections from preset
    const newSections = preset.sections.map((s) => ({
      id: uid('sec'),
      type: s.type,
      label: s.label,
      content: '',
      modifiers: [],
      emphasis: [],
      tension: 50,
      bars: s.bars,
    }));
    
    // Use setDoc to properly update state - replace sections for active variant
    const activeVariant = useStore.getState().doc.activeVariant;
    useStore.getState().setDoc((doc) => ({
      ...doc,
      arrangementTracks: {
        ...doc.arrangementTracks,
        [activeVariant]: newSections,
      },
    }));
  };

  return (
    <div className="w-full h-full flex flex-col glass-card rounded-lg overflow-hidden relative" data-testid="tube-timeline">
      <div className="h-12 border-b border-white/5 flex items-center px-4 justify-between bg-black/20 shrink-0">
        <h2 className="text-sm font-medium tracking-wider text-muted-foreground uppercase font-mono">Timeline / Tube View</h2>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="outline" className="h-7 text-xs bg-white/5 border-white/10 hover:bg-white/10" data-testid="button-structure-preset">
                <ListMusic className="w-3 h-3 mr-1" /> Structure Preset
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-background border-white/10 max-h-80 overflow-y-auto">
              <DropdownMenuLabel className="text-[10px] text-white/40 uppercase">Song Structures</DropdownMenuLabel>
              {songStructurePresets.map((preset) => (
                <DropdownMenuItem 
                  key={preset.id} 
                  onClick={() => applyStructurePreset(preset.id)} 
                  className="text-xs font-mono cursor-pointer"
                  data-testid={`preset-${preset.id}`}
                >
                  {preset.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="outline" className="h-7 text-xs bg-white/5 border-white/10 hover:bg-white/10" data-testid="button-add-section-dropdown">
                <Plus className="w-3 h-3 mr-1" /> Add Section
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-background border-white/10">
              {['Intro', 'Verse', 'Chorus', 'Pre-Chorus', 'Bridge', 'Outro'].map((type) => (
                <DropdownMenuItem key={type} onClick={() => handleAddSection(type)} className="text-xs font-mono cursor-pointer">
                  {type}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden relative bg-gradient-to-br from-black/80 to-black/60" ref={containerRef} style={{ overflowX: 'scroll' }}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />
        
        <div className="relative flex h-full p-8 min-w-max z-10">
          
          <svg className="absolute top-0 left-0 h-full w-full pointer-events-none z-0 overflow-visible" style={{ left: '32px', top: '78px', height: '100px' }}>
            <defs>
              <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--color-lane-energy)" stopOpacity="0.2" />
                <stop offset="100%" stopColor="var(--color-lane-energy)" stopOpacity="1" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <path 
              d={getFlowPath()} 
              fill="none" 
              stroke="url(#flowGradient)" 
              strokeWidth="4" 
              strokeLinecap="round"
              filter="url(#glow)"
              vectorEffect="non-scaling-stroke" 
            />
          </svg>

          {sections.map((section, index) => {
            const sectionLanes = section.lanes || doc.lanes;
            const sectionMood = section.modifiers?.find(m => 
              ['energetic', 'relaxed', 'building', 'aggressive', 'melancholic', 'euphoric', 'hypnotic', 'intimate'].includes(m)
            );
            const recommendation = getRecommendedDuration(currentGenre, section.type, sectionMood);
            
            return (
              <motion.div
                key={section.id}
                layoutId={section.id}
                className="relative flex flex-col h-full mr-2 group shrink-0 z-10"
                style={{ width: SECTION_WIDTH }}
                data-testid={`section-card-${section.id}`}
              >
                <div className="flex items-center justify-between mb-4 px-2 py-1 rounded bg-black/60 border border-white/10 group-hover:border-primary/50 transition-colors shadow-lg backdrop-blur-md">
                  <div className="flex flex-col flex-1">
                    <span className="text-[10px] text-primary/80 font-mono uppercase">{section.type}</span>
                    <input 
                      value={section.label}
                      onChange={(e) => updateSection(section.id, { label: e.target.value })}
                      className="bg-transparent text-sm font-display font-bold outline-none w-full text-white/90 placeholder-white/20"
                      aria-label={`Section label for ${section.type}`}
                      data-testid={`input-section-label-${section.id}`}
                    />
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => removeSection(section.id)}
                    aria-label={`Remove ${section.label} section`}
                    data-testid={`button-remove-section-${section.id}`}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>

                {/* Bars Length Slider with Recommendation */}
                <div className="mb-2 px-2 py-1.5 bg-black/40 rounded border border-white/5">
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col items-center min-w-[32px]">
                      <span className="text-sm font-bold text-white font-mono">{section.bars || 8}</span>
                      <span className="text-[8px] text-muted-foreground font-mono uppercase">Bars</span>
                    </div>
                    <input
                      type="range"
                      min="2"
                      max="64"
                      step="2"
                      value={section.bars || 8}
                      onChange={(e) => updateSection(section.id, { bars: parseInt(e.target.value) })}
                      className="flex-1 h-2 accent-primary cursor-pointer rounded-full"
                      aria-label={`Bars for ${section.label}: ${section.bars || 8} bars`}
                      aria-valuemin={2}
                      aria-valuemax={64}
                      aria-valuenow={section.bars || 8}
                      data-testid={`slider-bars-${section.id}`}
                    />
                    {recommendation && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => updateSection(section.id, { bars: recommendation.defaultBars })}
                              className={cn(
                                "p-1 rounded transition-colors",
                                (section.bars || 8) === recommendation.defaultBars 
                                  ? "text-green-400 bg-green-500/10" 
                                  : "text-yellow-400/60 hover:text-yellow-400 hover:bg-yellow-500/10"
                              )}
                              aria-label={`Apply recommended ${recommendation.defaultBars} bars for ${currentGenre} ${section.type}`}
                              data-testid={`button-apply-recommendation-${section.id}`}
                            >
                              <Lightbulb className="w-3 h-3" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-xs">
                            <p className="text-xs font-medium">{currentGenre}: {recommendation.defaultBars} bars</p>
                            {sectionMood && <p className="text-[10px] text-primary/80">Mood: {sectionMood}</p>}
                            <p className="text-[10px] text-white/60">{recommendation.description}</p>
                            <p className="text-[10px] text-white/40 mt-1">Range: {recommendation.minBars}-{recommendation.maxBars} bars</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </div>

                <div className="flex-1 flex flex-col gap-2 relative">
                  <LaneBar 
                    label="Energy" 
                    value={sectionLanes.energy} 
                    color="var(--color-lane-energy)"
                    onChange={(v) => setSectionLaneValue(section.id, 'energy', v)}
                  />
                  
                  <LaneBar 
                    label="Density" 
                    value={sectionLanes.density} 
                    color="var(--color-lane-density)"
                    onChange={(v) => setSectionLaneValue(section.id, 'density', v)}
                  />

                  <LaneBar 
                    label="Bright" 
                    value={sectionLanes.brightness} 
                    color="var(--color-lane-brightness)"
                    onChange={(v) => setSectionLaneValue(section.id, 'brightness', v)}
                  />

                  <LaneBar 
                    label="Vocals" 
                    value={sectionLanes.vocalPresence} 
                    color="var(--color-lane-vocals)"
                    onChange={(v) => setSectionLaneValue(section.id, 'vocalPresence', v)}
                  />

                  {/* Lyrics Input - Separate Section */}
                  <div className="mt-3 bg-black/40 rounded border border-white/5 p-2 shadow-inner">
                    <div className="text-[10px] text-muted-foreground font-mono uppercase mb-1 flex items-center gap-1">
                      <span className="text-primary">Lyrics</span>
                      <span className="text-white/30 text-[8px]">({section.content?.length || 0} chars)</span>
                    </div>
                    <textarea
                      value={section.content}
                      onChange={(e) => updateSection(section.id, { content: e.target.value })}
                      placeholder="Enter lyrics or description..."
                      className="w-full bg-black/30 border border-white/10 rounded px-2 py-1.5 text-xs text-white/90 outline-none resize-none min-h-[60px] focus:border-primary/50 transition-colors"
                      rows={3}
                      data-testid={`textarea-section-content-${section.id}`}
                    />
                  </div>

                  {/* Modifiers Input - Separate Section with Dropdown */}
                  <div className="mt-2 bg-black/40 rounded border border-white/5 p-2 shadow-inner">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-muted-foreground font-mono uppercase text-secondary">
                        Modifiers
                      </span>
                      <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-5 px-2 text-[9px] bg-secondary/10 hover:bg-secondary/20 border border-secondary/30"
                            data-testid={`button-modifier-dropdown-${section.id}`}
                          >
                            <Plus className="w-2.5 h-2.5 mr-1" /> Add
                            <ChevronDown className="w-2.5 h-2.5 ml-1" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent 
                          align="end" 
                          className="w-48 max-h-64 overflow-y-auto bg-background border-white/10"
                          onCloseAutoFocus={(e) => e.preventDefault()}
                        >
                          {Object.entries(MODIFIER_OPTIONS).map(([category, modifiers]) => (
                            <div key={category}>
                              <DropdownMenuLabel className="text-[9px] uppercase text-white/40 font-mono">
                                {category}
                              </DropdownMenuLabel>
                              {modifiers.map((mod) => {
                                const isSelected = section.modifiers.includes(mod);
                                return (
                                  <DropdownMenuItem
                                    key={mod}
                                    className="text-xs cursor-pointer flex items-center justify-between"
                                    onSelect={(e) => {
                                      e.preventDefault();
                                      if (isSelected) {
                                        updateSection(section.id, { 
                                          modifiers: section.modifiers.filter(m => m !== mod) 
                                        });
                                      } else {
                                        updateSection(section.id, { 
                                          modifiers: [...section.modifiers, mod] 
                                        });
                                      }
                                    }}
                                  >
                                    <div className="flex items-center gap-2">
                                      <div className={`w-3 h-3 rounded-sm border flex items-center justify-center ${isSelected ? 'bg-secondary border-secondary' : 'border-white/30'}`}>
                                        {isSelected && <Check className="w-2 h-2 text-black" />}
                                      </div>
                                      <span className={isSelected ? "text-secondary" : "text-white/70"}>
                                        {mod}
                                      </span>
                                    </div>
                                  </DropdownMenuItem>
                                );
                              })}
                              <DropdownMenuSeparator className="bg-white/5" />
                            </div>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {section.modifiers.length === 0 ? (
                        <span className="text-[9px] text-white/30 italic">No modifiers selected</span>
                      ) : (
                        section.modifiers.map((mod, i) => (
                          <span 
                            key={i} 
                            className="text-[10px] px-1.5 py-0.5 rounded bg-secondary/20 text-secondary border border-secondary/30 cursor-pointer hover:bg-secondary/30 transition-colors"
                            onClick={() => {
                              const newModifiers = section.modifiers.filter((_, idx) => idx !== i);
                              updateSection(section.id, { modifiers: newModifiers });
                            }}
                            data-testid={`modifier-tag-${section.id}-${i}`}
                          >
                            {mod} ×
                          </span>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Layer Controls - Collapsible */}
                  <Collapsible 
                    open={expandedLayers[section.id]} 
                    onOpenChange={() => toggleLayersExpanded(section.id)}
                    className="mt-2"
                  >
                    <CollapsibleTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full h-7 justify-between px-2 bg-black/40 border border-white/5 hover:bg-black/60 hover:border-white/10"
                        data-testid={`button-layers-toggle-${section.id}`}
                      >
                        <span className="text-[10px] text-muted-foreground font-mono uppercase flex items-center gap-1">
                          <Music className="w-3 h-3" />
                          <span>Layers</span>
                          <span className="text-white/30 text-[8px]">
                            ({layers.instruments.reduce((acc, g) => acc + g.items.length, 0) + layers.voices.reduce((acc, g) => acc + g.items.length, 0)})
                          </span>
                        </span>
                        <ChevronRight className={cn("w-3 h-3 transition-transform", expandedLayers[section.id] && "rotate-90")} />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="mt-1 bg-black/40 rounded border border-white/5 p-2 shadow-inner max-h-48 overflow-y-auto">
                        {/* Instruments */}
                        {layers.instruments.map((group) => (
                          <div key={group.id} className="mb-2">
                            <div className="text-[9px] text-primary/70 font-mono uppercase mb-1 flex items-center gap-1">
                              <Music className="w-2.5 h-2.5" />
                              {group.name}
                            </div>
                            {group.items.map((item) => {
                              const level = getLayerLevel(section.id, 'instruments', group.id, item.name, item.level);
                              return (
                                <div key={item.name} className="flex items-center gap-2 mb-1">
                                  <span className="text-[9px] text-white/60 w-16 truncate" title={item.name}>
                                    {item.name}
                                  </span>
                                  <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={level}
                                    onChange={(e) => setLayerAutomation(section.id, 'instruments', group.id, item.name, { level: parseInt(e.target.value) })}
                                    className="flex-1 h-1 accent-primary cursor-pointer"
                                    data-testid={`slider-instrument-${section.id}-${group.id}-${item.name}`}
                                  />
                                  <span className="text-[8px] text-white/40 w-6 text-right">{level}</span>
                                </div>
                              );
                            })}
                          </div>
                        ))}
                        
                        {/* Voices */}
                        {layers.voices.map((group) => (
                          <div key={group.id} className="mb-2">
                            <div className="text-[9px] text-secondary/70 font-mono uppercase mb-1 flex items-center gap-1">
                              <Mic2 className="w-2.5 h-2.5" />
                              {group.name}
                            </div>
                            {group.items.map((item) => {
                              const level = getLayerLevel(section.id, 'voices', group.id, item.name, item.level);
                              return (
                                <div key={item.name} className="flex items-center gap-2 mb-1">
                                  <span className="text-[9px] text-white/60 w-16 truncate" title={item.name}>
                                    {item.name}
                                  </span>
                                  <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={level}
                                    onChange={(e) => setLayerAutomation(section.id, 'voices', group.id, item.name, { level: parseInt(e.target.value) })}
                                    className="flex-1 h-1 accent-secondary cursor-pointer"
                                    data-testid={`slider-voice-${section.id}-${group.id}-${item.name}`}
                                  />
                                  <span className="text-[8px] text-white/40 w-6 text-right">{level}</span>
                                </div>
                              );
                            })}
                          </div>
                        ))}
                        
                        {layers.instruments.length === 0 && layers.voices.length === 0 && (
                          <span className="text-[9px] text-white/30 italic">No layers configured</span>
                        )}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
                
                {index < sections.length - 1 && (
                  <div className="absolute right-[-5px] top-12 bottom-4 w-[1px] bg-gradient-to-b from-transparent via-white/5 to-transparent border-r border-dashed border-white/5" />
                )}
              </motion.div>
            );
          })}
          
          <div className="w-24 flex items-center justify-center opacity-30 hover:opacity-100 transition-opacity ml-4">
            <button 
              onClick={() => handleAddSection('Verse')}
              className="w-12 h-12 rounded-full border border-dashed border-white/20 flex items-center justify-center hover:bg-white/5 hover:border-white/50 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all"
              data-testid="button-add-section-circle"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function LaneBar({ label, value, color, onChange }: { label: string; value: number; color: string; onChange: (val: number) => void }) {
  const height = `${Math.max(10, value)}%`;
  
  return (
    <div className="relative h-20 bg-black/40 rounded border border-white/5 group/lane overflow-hidden backdrop-blur-sm shadow-inner transition-colors hover:border-white/20">
      <div className="absolute inset-0 flex flex-col justify-end p-[1px]">
        <motion.div 
          className="w-full rounded-sm opacity-60 group-hover/lane:opacity-90 transition-opacity relative"
          style={{ height, backgroundColor: color }}
          animate={{ height }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/50 shadow-[0_0_10px_white]" />
        </motion.div>
      </div>
      
      <input 
        type="range" 
        min="0" 
        max="100" 
        value={value} 
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="absolute inset-0 w-full h-full opacity-0 cursor-ns-resize z-10" 
        title={`${label}: ${value}%`}
      />
      
      <div className="absolute bottom-1 left-2 pointer-events-none z-0">
        <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-white mix-blend-difference opacity-70">{label}</span>
      </div>
      <div className="absolute top-1 right-2 pointer-events-none z-0">
        <span className="text-[9px] font-mono text-white/50 bg-black/50 px-1 rounded">{value}</span>
      </div>
    </div>
  );
}
