import { useState } from 'react';
import { subgenreTemplates, templateCategories, SubgenreTemplate } from '@/data/templates';
import { useStore, uid } from '@/lib/store';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Sparkles, Music, Layers, Check } from 'lucide-react';
import { toast } from 'sonner';

export function TemplateSelector() {
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('Electronic');
  const [selectedTemplate, setSelectedTemplate] = useState<SubgenreTemplate | null>(null);
  
  const setArchitecture = useStore((s) => s.setArchitecture);
  const setLanes = useStore((s) => s.setLanes);
  const setNuance = useStore((s) => s.setNuance);
  const setDoc = useStore((s) => s.setDoc);
  const addSection = useStore((s) => s.addSection);

  const filteredTemplates = subgenreTemplates.filter(t => t.category === selectedCategory);

  const applyTemplate = (template: SubgenreTemplate) => {
    setArchitecture({
      ...template.architecture,
    });
    setLanes(template.lanes);
    setNuance(template.nuancePresets);
    
    setDoc((doc) => ({
      ...doc,
      layers: {
        instruments: template.instrumentGroups,
        voices: doc.layers.voices,
      },
      arrangementTracks: {
        ...doc.arrangementTracks,
        [doc.activeVariant]: template.suggestedSections.map((s) => ({
          id: uid('sec'),
          type: s.type,
          label: s.label,
          content: s.content,
          modifiers: [],
          emphasis: [],
          tension: 50,
        })),
      },
    }));
    
    toast.success(`Applied "${template.name}" template`);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full h-8 text-xs bg-gradient-to-r from-primary/20 to-secondary/20 border-primary/30 hover:from-primary/30 hover:to-secondary/30"
          data-testid="button-open-templates"
        >
          <Sparkles className="w-3 h-3 mr-2" />
          Load Subgenre Template
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl bg-card border-white/10">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-primary" />
            Subgenre Templates
          </DialogTitle>
          <DialogDescription>
            Choose a template to pre-configure your project with genre-specific settings
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex gap-2 flex-wrap mb-4">
          {templateCategories.map((cat) => (
            <Button
              key={cat}
              size="sm"
              variant={selectedCategory === cat ? 'default' : 'outline'}
              className="text-xs"
              onClick={() => setSelectedCategory(cat)}
              data-testid={`button-category-${cat.toLowerCase()}`}
            >
              {cat}
            </Button>
          ))}
        </div>
        
        <div className="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-2">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                selectedTemplate?.id === template.id 
                  ? 'border-primary bg-primary/10' 
                  : 'border-white/10 hover:border-white/30 bg-black/20'
              }`}
              onClick={() => setSelectedTemplate(template)}
              data-testid={`template-card-${template.id}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-medium text-sm text-white">{template.name}</h4>
                  <p className="text-[10px] text-white/50 mt-0.5">{template.description}</p>
                </div>
                {selectedTemplate?.id === template.id && (
                  <Check className="w-4 h-4 text-primary shrink-0" />
                )}
              </div>
              <div className="flex gap-1 flex-wrap mt-2">
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-white/60">
                  {template.architecture.tempoBpm} BPM
                </span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-white/60">
                  {template.architecture.key}
                </span>
                {template.architecture.genreTags?.slice(0, 2).map((tag) => (
                  <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded bg-primary/20 text-primary">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
          {filteredTemplates.length === 0 && (
            <p className="col-span-2 text-center text-white/40 text-sm py-8">
              No templates in this category yet
            </p>
          )}
        </div>
        
        {selectedTemplate && (
          <div className="mt-4 p-3 bg-black/30 rounded-lg border border-white/10">
            <h5 className="text-xs font-mono text-primary uppercase mb-2">Preview: {selectedTemplate.name}</h5>
            <div className="grid grid-cols-2 gap-4 text-xs text-white/70">
              <div>
                <span className="text-white/40">Sections:</span>
                <div className="flex gap-1 flex-wrap mt-1">
                  {selectedTemplate.suggestedSections.map((s, i) => (
                    <span key={i} className="px-1.5 py-0.5 rounded bg-white/10 text-[10px]">
                      {s.type}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-white/40">Instruments:</span>
                <div className="flex gap-1 flex-wrap mt-1">
                  {selectedTemplate.instrumentGroups.flatMap(g => g.items).slice(0, 5).map((item, i) => (
                    <span key={i} className="px-1.5 py-0.5 rounded bg-white/10 text-[10px]">
                      {item.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <Button 
              className="w-full mt-3" 
              onClick={() => applyTemplate(selectedTemplate)}
              data-testid="button-apply-template"
            >
              <Music className="w-4 h-4 mr-2" />
              Apply Template
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
