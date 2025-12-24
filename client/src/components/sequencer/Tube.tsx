import React, { useRef, useEffect, useState } from 'react';
import { useStore, LaneType } from '@/lib/store';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Plus, Trash2, GripVertical, ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Tube() {
  const { activeTrack, tracks, updateLane, updateSection, toggleInstrument, removeSection, addSection } = useStore();
  const sections = tracks[activeTrack].sections;
  const instruments = tracks[activeTrack].instruments;
  const containerRef = useRef<HTMLDivElement>(null);

  // Constants for visualization
  const SECTION_WIDTH = 180;
  const SECTION_GAP = 8;
  const BAR_HEIGHT = 96; // 24 * 4 (h-24)

  // Calculate SVG Path for the "Energy" Flow
  const getFlowPath = () => {
    if (sections.length < 2) return '';
    
    // We need to map section index to X and energy value to Y
    // Each section is SECTION_WIDTH wide + margin-right 8px (approx)
    // The "Energy" bar is the first one. Let's say we want the line to go through the middle of the energy bar.
    // But the energy bar is relative. 
    
    // Easier approach: render the SVG absolutely over the whole scroll container.
    // We assume fixed widths.
    
    let d = '';
    
    sections.forEach((section, index) => {
      // X = Center of the section. 
      // Section starts at index * (SECTION_WIDTH + 8)
      // Center is + SECTION_WIDTH / 2
      const x = index * (SECTION_WIDTH + SECTION_GAP) + (SECTION_WIDTH / 2);
      
      // Y = Inverted value. 
      // Container height for the bars area... let's approximate.
      // The bars are in a flex-1 container. The SVG needs to overlay that specific area.
      // Let's put the SVG inside the same container as the bars.
      // Value 0-100. 100 is top (y=0), 0 is bottom (y=100%).
      // Let's use relative units in the SVG: 0-100 viewbox height?
      
      const y = 100 - section.lanes.energy; 
      
      if (index === 0) {
        d += `M ${x} ${y}`;
      } else {
        // Simple line for now, Bezier would need control points
        const prevX = (index - 1) * (SECTION_WIDTH + SECTION_GAP) + (SECTION_WIDTH / 2);
        const prevY = 100 - sections[index - 1].lanes.energy;
        
        const cp1x = prevX + (SECTION_WIDTH / 2);
        const cp1y = prevY;
        const cp2x = x - (SECTION_WIDTH / 2);
        const cp2y = y;
        
        d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x} ${y}`;
      }
    });
    
    return d;
  };

  return (
    <div className="w-full h-full flex flex-col glass-card rounded-lg overflow-hidden relative">
      {/* Header */}
      <div className="h-12 border-b border-white/5 flex items-center px-4 justify-between bg-black/20 shrink-0">
        <h2 className="text-sm font-medium tracking-wider text-muted-foreground uppercase font-mono">Timeline / Tube View</h2>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="h-7 text-xs bg-white/5 border-white/10 hover:bg-white/10" onClick={() => addSection(activeTrack)}>
            <Plus className="w-3 h-3 mr-1" /> Add Section
          </Button>
        </div>
      </div>

      {/* Timeline Scroll Area */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden relative no-scrollbar bg-[url(@assets/generated_images/subtle_dark_technical_grid_background.png)] bg-cover bg-center" ref={containerRef}>
        <div className="absolute inset-0 bg-black/80 backdrop-blur-[2px]" />
        
        <div className="relative flex h-full p-8 min-w-max z-10">
          
          {/* Flow Line SVG Overlay - Absolute to the scroll content */}
          <svg className="absolute top-0 left-0 h-full w-full pointer-events-none z-0 overflow-visible" style={{ left: '32px', top: '78px', height: '100px' }}>
             {/* Gradient Defs */}
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
             {/* The Path */}
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

          {sections.map((section, index) => (
            <motion.div
              key={section.id}
              layoutId={section.id}
              className="relative flex flex-col h-full mr-2 group shrink-0 z-10"
              style={{ width: SECTION_WIDTH }}
            >
              {/* Section Header */}
              <div className="flex items-center justify-between mb-4 px-2 py-1 rounded bg-black/60 border border-white/10 group-hover:border-primary/50 transition-colors shadow-lg backdrop-blur-md">
                <input 
                  value={section.name}
                  onChange={(e) => updateSection(activeTrack, section.id, { name: e.target.value })}
                  className="bg-transparent text-sm font-display font-bold outline-none w-full text-white/90 placeholder-white/20"
                />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => removeSection(activeTrack, section.id)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>

              {/* Lanes Container */}
              <div className="flex-1 flex flex-col gap-2 relative">
                {/* Lane: Energy (Connected by Flow Line) */}
                <LaneBar 
                  label="Energy" 
                  value={section.lanes.energy} 
                  color="var(--color-lane-energy)"
                  onChange={(v) => updateLane(activeTrack, section.id, 'energy', v)}
                />
                
                {/* Lane: Density */}
                <LaneBar 
                  label="Density" 
                  value={section.lanes.density} 
                  color="var(--color-lane-density)"
                  onChange={(v) => updateLane(activeTrack, section.id, 'density', v)}
                />

                {/* Lane: Brightness */}
                <LaneBar 
                  label="Bright" 
                  value={section.lanes.brightness} 
                  color="var(--color-lane-brightness)"
                  onChange={(v) => updateLane(activeTrack, section.id, 'brightness', v)}
                />

                {/* Lane: Vocals */}
                <LaneBar 
                  label="Vocals" 
                  value={section.lanes.vocals} 
                  color="var(--color-lane-vocals)"
                  onChange={(v) => updateLane(activeTrack, section.id, 'vocals', v)}
                />

                {/* Instrument Matrix */}
                <div className="mt-4 flex-1 bg-black/40 rounded border border-white/5 p-2 gap-1 flex flex-col overflow-y-auto no-scrollbar shadow-inner">
                   <div className="text-[10px] text-muted-foreground font-mono uppercase mb-1 sticky top-0 bg-black/40 backdrop-blur pb-1">Mix Presence</div>
                   {instruments.map(inst => (
                     <button
                        key={inst.id}
                        onClick={() => toggleInstrument(activeTrack, section.id, inst.id)}
                        className={cn(
                          "text-xs text-left px-2 py-1.5 rounded transition-all duration-200 border flex items-center justify-between group/inst",
                          section.activeInstruments.includes(inst.id)
                            ? "bg-white/10 border-white/20 text-white shadow-[0_0_10px_rgba(255,255,255,0.1)]"
                            : "bg-transparent border-transparent text-muted-foreground hover:bg-white/5 opacity-50 hover:opacity-100"
                        )}
                     >
                       <span>{inst.name}</span>
                       <div className={cn("w-1.5 h-1.5 rounded-full", section.activeInstruments.includes(inst.id) ? "bg-primary shadow-[0_0_5px_var(--color-primary)]" : "bg-white/10")} />
                     </button>
                   ))}
                </div>
              </div>
              
              {/* Connector Line (Vertical Separator) */}
              {index < sections.length - 1 && (
                <div className="absolute right-[-5px] top-12 bottom-4 w-[1px] bg-gradient-to-b from-transparent via-white/5 to-transparent border-r border-dashed border-white/5" />
              )}
            </motion.div>
          ))}
          
          <div className="w-24 flex items-center justify-center opacity-30 hover:opacity-100 transition-opacity ml-4">
            <button 
              onClick={() => addSection(activeTrack)}
              className="w-12 h-12 rounded-full border border-dashed border-white/20 flex items-center justify-center hover:bg-white/5 hover:border-white/50 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function LaneBar({ label, value, color, onChange }: { label: string, value: number, color: string, onChange: (val: number) => void }) {
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
          {/* Top glow line */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/50 shadow-[0_0_10px_white]" />
        </motion.div>
      </div>
      
      {/* Interaction Layer */}
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
