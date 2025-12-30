import { useState } from 'react';
import { useStore } from '@/lib/store';
import { compileToSuno, getLyricsText } from '@/lib/compiler';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Download, FileText, Music, FileJson, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

interface ExportFormat {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  extension: string;
}

const exportFormats: ExportFormat[] = [
  { id: 'prompt', name: 'Suno/Udio Prompt', description: 'Compiled prompt ready for AI music generation', icon: <Music className="w-4 h-4" />, extension: 'txt' },
  { id: 'lyrics', name: 'Lyrics Text', description: 'Extracted lyrics from all sections', icon: <FileText className="w-4 h-4" />, extension: 'txt' },
  { id: 'project', name: 'Project JSON', description: 'Full project data for backup/sharing', icon: <FileJson className="w-4 h-4" />, extension: 'json' },
  { id: 'midi-structure', name: 'MIDI Structure', description: 'Section markers and arrangement data', icon: <Music className="w-4 h-4" />, extension: 'json' },
];

export function ExportPanel() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const doc = useStore((s) => s.doc);
  
  const downloadFile = (content: string, filename: string, mimeType: string = 'text/plain') => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = async (content: string, formatId: string) => {
    await navigator.clipboard.writeText(content);
    setCopied(formatId);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(null), 2000);
  };

  const generateExport = (formatId: string): string => {
    const baseFilename = (doc.meta.title || 'untitled').replace(/[^\w\-]+/g, '_');
    
    switch (formatId) {
      case 'prompt':
        return compileToSuno(doc);
      
      case 'lyrics':
        return getLyricsText(doc);
      
      case 'project':
        return JSON.stringify(doc, null, 2);
      
      case 'midi-structure':
        const sections = doc.arrangementTracks?.[doc.activeVariant] || [];
        const midiStructure = {
          tempo: doc.architecture?.tempoBpm || 120,
          timeSignature: doc.architecture?.timeSignature || '4/4',
          key: doc.architecture?.key || 'C',
          sections: sections.map((s, index) => ({
            index,
            type: s.type || 'Section',
            label: s.label || `Section ${index + 1}`,
            estimatedBars: 8,
            lanes: s.lanes || doc.lanes || { energy: 50, density: 50, brightness: 50, vocalPresence: 50 },
            content: s.content || '',
          })),
          globalLanes: doc.lanes || { energy: 50, density: 50, brightness: 50, vocalPresence: 50 },
          instruments: (doc.layers?.instruments || []).flatMap(g => (g.items || []).map(i => ({
            name: i.name,
            group: g.name,
            level: i.level,
            position: i.position,
          }))),
        };
        return JSON.stringify(midiStructure, null, 2);
      
      default:
        return '';
    }
  };

  const handleExport = (format: ExportFormat) => {
    const content = generateExport(format.id);
    const baseFilename = (doc.meta.title || 'untitled').replace(/[^\w\-]+/g, '_');
    const filename = `${baseFilename}_${format.id}.${format.extension}`;
    
    downloadFile(
      content, 
      filename, 
      format.extension === 'json' ? 'application/json' : 'text/plain'
    );
    toast.success(`Downloaded ${filename}`);
  };

  const handleExportAll = () => {
    exportFormats.forEach((format) => handleExport(format));
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 gap-2 bg-white/5 border-white/10 hover:bg-white/10"
          data-testid="button-open-export"
        >
          <Download className="w-4 h-4" />
          Export
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md bg-card border-white/10">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="w-5 h-5 text-primary" />
            Export Project
          </DialogTitle>
          <DialogDescription>
            Download your project in various formats
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-2">
          {exportFormats.map((format) => {
            const content = generateExport(format.id);
            return (
              <div
                key={format.id}
                className="p-3 rounded-lg border border-white/10 bg-black/20 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center text-primary">
                    {format.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-white">{format.name}</h4>
                    <p className="text-[10px] text-white/50">{format.description}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7"
                    onClick={() => copyToClipboard(content, format.id)}
                    data-testid={`button-copy-${format.id}`}
                  >
                    {copied === format.id ? (
                      <Check className="w-3 h-3 text-green-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7"
                    onClick={() => handleExport(format)}
                    data-testid={`button-download-${format.id}`}
                  >
                    <Download className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
        
        <Button 
          className="w-full mt-2" 
          onClick={handleExportAll}
          data-testid="button-export-all"
        >
          <Download className="w-4 h-4 mr-2" />
          Download All Formats
        </Button>
      </DialogContent>
    </Dialog>
  );
}
