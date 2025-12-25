import React, { useMemo } from 'react';
import { useStore } from '@/lib/store';
import { compileToSuno, getLyricsText } from '@/lib/compiler';
import { Copy, Wand2, Music2, FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function PromptPreview() {
  const doc = useStore((s) => s.doc);
  
  const compiledPrompt = useMemo(() => compileToSuno(doc), [doc]);
  const lyrics = useMemo(() => getLyricsText(doc), [doc]);

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(compiledPrompt);
      toast.success('Prompt copied to clipboard');
    } catch {
      downloadText('prompt.txt', compiledPrompt);
      toast.info('Downloaded as file (clipboard blocked)');
    }
  };

  const copyLyrics = async () => {
    try {
      await navigator.clipboard.writeText(lyrics);
      toast.success('Lyrics copied to clipboard');
    } catch {
      downloadText('lyrics.txt', lyrics);
      toast.info('Downloaded as file (clipboard blocked)');
    }
  };

  const downloadText = (filename: string, text: string) => {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const downloadAll = () => {
    const base = (doc.meta.title || 'song-assets').replace(/[^\w\-]+/g, '_');
    downloadText(`${base}_prompt.txt`, compiledPrompt);
    downloadText(`${base}_lyrics.txt`, lyrics);
    toast.success('Downloaded prompt and lyrics');
  };

  const charCount = compiledPrompt.length;
  const isLong = charCount > 500;

  return (
    <div className="h-full flex flex-col glass-card rounded-lg overflow-hidden" data-testid="prompt-preview">
      <div className="h-12 border-b border-white/5 flex items-center px-4 justify-between bg-black/20">
        <h2 className="text-sm font-medium tracking-wider text-muted-foreground uppercase font-mono flex items-center gap-2">
          <Wand2 className="w-4 h-4 text-primary" />
          Compiler Output
        </h2>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${isLong ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'}`}>
            {charCount} chars
          </span>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={copyPrompt} data-testid="button-copy-prompt">
            <Copy className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex-1 p-4 bg-black/40 overflow-auto font-mono text-sm leading-relaxed text-emerald-400/90 selection:bg-emerald-900/50">
        <pre className="whitespace-pre-wrap" data-testid="text-compiled-prompt">{compiledPrompt}</pre>
      </div>

      {/* Lyrics Preview */}
      <div className="border-t border-white/5">
        <div className="h-8 flex items-center px-4 justify-between bg-black/30">
          <span className="text-[10px] font-mono text-white/40 uppercase flex items-center gap-1">
            <FileText className="w-3 h-3" /> Lyrics
          </span>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={copyLyrics}>
            <Copy className="w-3 h-3" />
          </Button>
        </div>
        <div className="px-4 py-2 max-h-24 overflow-y-auto text-xs text-white/50 font-mono">
          {lyrics.slice(0, 200)}{lyrics.length > 200 ? '...' : ''}
        </div>
      </div>
      
      <div className="p-4 border-t border-white/5 bg-black/20 space-y-2">
        <Button 
          className="w-full bg-primary hover:bg-primary/90 text-white font-bold tracking-wide shadow-[0_0_20px_rgba(124,58,237,0.3)]"
          onClick={copyPrompt}
          data-testid="button-generate-copy"
        >
          <Music2 className="w-4 h-4 mr-2" /> COPY PROMPT
        </Button>
        <Button 
          variant="outline" 
          className="w-full bg-white/5 border-white/10 hover:bg-white/10"
          onClick={downloadAll}
          data-testid="button-download-all"
        >
          <Download className="w-4 h-4 mr-2" /> Download All Assets
        </Button>
      </div>
    </div>
  );
}
