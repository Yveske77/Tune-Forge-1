import React, { useRef, useEffect } from 'react';
import { useStore, LaneType, uid } from '@/lib/store';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Tube() {
  const doc = useStore((s) => s.doc);
  const addSection = useStore((s) => s.addSection);
  const updateSection = useStore((s) => s.updateSection);
  const removeSection = useStore((s) => s.removeSection);
  const setSectionLaneValue = useStore((s) => s.setSectionLaneValue);
  
  const sections = doc.arrangementTracks[doc.activeVariant];
  const layers = doc.layers;
  const containerRef = useRef<HTMLDivElement>(null);

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

  const handleAddSection = () => {
    const verseCount = sections.filter((s) => s.type.toLowerCase() === 'verse').length;
    addSection({
      id: uid('sec'),
      type: 'Verse',
      label: `Verse ${verseCount + 1}`,
      content: '',
      modifiers: [],
      emphasis: [],
      tension: 50,
    });
  };

  return (
    <div className="w-full h-full flex flex-col glass-card rounded-lg overflow-hidden relative" data-testid="tube-timeline">
      <div className="h-12 border-b border-white/5 flex items-center px-4 justify-between bg-black/20 shrink-0">
        <h2 className="text-sm font-medium tracking-wider text-muted-foreground uppercase font-mono">Timeline / Tube View</h2>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="h-7 text-xs bg-white/5 border-white/10 hover:bg-white/10" onClick={handleAddSection} data-testid="button-add-section">
            <Plus className="w-3 h-3 mr-1" /> Add Section
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden relative no-scrollbar bg-gradient-to-br from-black/80 to-black/60" ref={containerRef}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
        
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
                      data-testid={`input-section-label-${section.id}`}
                    />
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => removeSection(section.id)}
                    data-testid={`button-remove-section-${section.id}`}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
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

                  <div className="mt-4 flex-1 bg-black/40 rounded border border-white/5 p-2 gap-1 flex flex-col overflow-y-auto no-scrollbar shadow-inner">
                    <div className="text-[10px] text-muted-foreground font-mono uppercase mb-1 sticky top-0 bg-black/40 backdrop-blur pb-1">
                      Content & Modifiers
                    </div>
                    <input
                      value={section.content}
                      onChange={(e) => updateSection(section.id, { content: e.target.value })}
                      placeholder="Description..."
                      className="w-full bg-black/30 border border-white/5 rounded px-2 py-1 text-xs text-white/80 outline-none"
                      data-testid={`input-section-content-${section.id}`}
                    />
                    <div className="flex flex-wrap gap-1 mt-2">
                      {section.modifiers.map((mod, i) => (
                        <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-primary/20 text-primary border border-primary/30">
                          {mod}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                {index < sections.length - 1 && (
                  <div className="absolute right-[-5px] top-12 bottom-4 w-[1px] bg-gradient-to-b from-transparent via-white/5 to-transparent border-r border-dashed border-white/5" />
                )}
              </motion.div>
            );
          })}
          
          <div className="w-24 flex items-center justify-center opacity-30 hover:opacity-100 transition-opacity ml-4">
            <button 
              onClick={handleAddSection}
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
