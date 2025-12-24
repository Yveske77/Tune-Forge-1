import React from 'react';
import { useStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Copy, Wand2, Music2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function PromptPreview() {
  const { activeTrack, tracks, genre } = useStore();
  const sections = tracks[activeTrack].sections;
  
  // Compiler Logic
  const compilePrompt = () => {
    let prompt = `[Full Song] [Genre: ${genre.main}, ${genre.sub}] [Era: ${genre.era}, ${genre.region}]\n`;
    
    sections.forEach(section => {
      // Determine descriptors based on lane values
      const descriptors = [];
      if (section.lanes.energy > 80) descriptors.push('high energy');
      else if (section.lanes.energy < 30) descriptors.push('low energy');
      
      if (section.lanes.density < 30) descriptors.push('sparse');
      else if (section.lanes.density > 80) descriptors.push('dense');
      
      if (section.lanes.brightness > 70) descriptors.push('bright');
      else if (section.lanes.brightness < 30) descriptors.push('dark');

      if (section.lanes.vocals > 0) {
        if (section.lanes.vocals > 80) descriptors.push('vocal heavy');
        else if (section.lanes.vocals < 30) descriptors.push('distant vocals');
      } else {
        descriptors.push('instrumental');
      }

      // Format active instruments
      const instrumentNames = section.activeInstruments
        .map(id => tracks[activeTrack].instruments.find(i => i.id === id)?.name)
        .filter(Boolean);
        
      const instrumentString = instrumentNames.length > 0 
        ? `\n(${instrumentNames.join(', ')})` 
        : '';

      prompt += `\n[${section.name}] (${descriptors.join(', ')}) ${instrumentString}`;
    });
    
    return prompt;
  };

  const promptText = compilePrompt();

  return (
    <div className="h-full flex flex-col glass-card rounded-lg overflow-hidden">
      <div className="h-12 border-b border-white/5 flex items-center px-4 justify-between bg-black/20">
        <h2 className="text-sm font-medium tracking-wider text-muted-foreground uppercase font-mono flex items-center gap-2">
          <Wand2 className="w-4 h-4 text-primary" />
          Compiler Output
        </h2>
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => navigator.clipboard.writeText(promptText)}>
          <Copy className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="flex-1 p-4 bg-black/40 overflow-auto font-mono text-sm leading-relaxed text-emerald-400/90 selection:bg-emerald-900/50">
        <pre className="whitespace-pre-wrap">{promptText}</pre>
      </div>
      
      <div className="p-4 border-t border-white/5 bg-black/20">
        <Button className="w-full bg-primary hover:bg-primary/90 text-white font-bold tracking-wide shadow-[0_0_20px_rgba(124,58,237,0.3)]">
          <Music2 className="w-4 h-4 mr-2" /> GENERATE (COPY)
        </Button>
      </div>
    </div>
  );
}
