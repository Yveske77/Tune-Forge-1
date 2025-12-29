import React, { useState, useMemo } from 'react';
import { useStore } from '@/lib/store';
import { compileToSuno } from '@/lib/compiler';
import { Music, Zap, Copy, Check, ChevronDown, Plus, Trash2, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const GENRES = [
  'Pop', 'Rock', 'Hip Hop', 'R&B', 'Electronic', 'Jazz', 'Classical', 'Country',
  'Folk', 'Indie', 'Metal', 'Punk', 'Soul', 'Funk', 'Reggae', 'Blues',
  'House', 'Techno', 'Ambient', 'Lo-Fi', 'Synthwave', 'Disco', 'Gospel', 'Latin'
];

const MOODS = [
  'Happy', 'Sad', 'Energetic', 'Calm', 'Dark', 'Uplifting', 'Melancholic', 'Aggressive',
  'Romantic', 'Nostalgic', 'Dreamy', 'Intense', 'Peaceful', 'Rebellious', 'Mysterious', 'Euphoric'
];

const KEYS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const SCALES = ['Major', 'Minor', 'Dorian', 'Mixolydian', 'Phrygian'];

const SECTION_TYPES = ['Intro', 'Verse', 'Pre-Chorus', 'Chorus', 'Bridge', 'Outro', 'Instrumental', 'Break'];

function uid(): string {
  return `sec_${Date.now()}_${Math.floor(Math.random() * 1e6)}`;
}

export default function Home() {
  const doc = useStore((s) => s.doc);
  const setMeta = useStore((s) => s.setMeta);
  const setArchitecture = useStore((s) => s.setArchitecture);
  const setNuance = useStore((s) => s.setNuance);
  const setLanes = useStore((s) => s.setLanes);
  const setLyrics = useStore((s) => s.setLyrics);
  const addSection = useStore((s) => s.addSection);
  const updateSection = useStore((s) => s.updateSection);
  const removeSection = useStore((s) => s.removeSection);
  const getActiveArrangement = useStore((s) => s.getActiveArrangement);
  
  const sections = getActiveArrangement();
  const compiledPrompt = useMemo(() => compileToSuno(doc), [doc]);
  
  const [copied, setCopied] = useState(false);
  
  const selectedGenres = doc.architecture.genreTags;
  const selectedMoods = doc.nuance.vocalTone;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(compiledPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleGenre = (genre: string) => {
    const updated = selectedGenres.includes(genre)
      ? selectedGenres.filter(g => g !== genre)
      : [...selectedGenres, genre].slice(0, 3);
    setArchitecture({ genreTags: updated });
  };

  const toggleMood = (mood: string) => {
    const updated = selectedMoods.includes(mood)
      ? selectedMoods.filter(m => m !== mood)
      : [...selectedMoods, mood].slice(0, 3);
    setNuance({ vocalTone: updated });
  };

  const handleAddSection = () => {
    addSection({
      id: uid(),
      type: 'Verse',
      label: `Verse ${sections.filter(s => s.type === 'Verse').length + 1}`,
      content: '',
      modifiers: [],
      emphasis: [],
      tension: 50,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/25">
              <Music className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">DAiW</h1>
              <p className="text-xs text-white/50">Musical Intention Engine</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Select value={doc.meta.target} onValueChange={(v: any) => setMeta({ target: v })}>
              <SelectTrigger className="w-32 bg-white/5 border-white/10" data-testid="select-platform">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="suno">Suno</SelectItem>
                <SelectItem value="udio">Udio</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-12 gap-6">
          
          <div className="col-span-3 space-y-6">
            <Card className="p-5 bg-white/5 border-white/10">
              <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-4">Genre</h2>
              <div className="flex flex-wrap gap-2">
                {GENRES.slice(0, 12).map(genre => (
                  <Badge
                    key={genre}
                    variant={selectedGenres.includes(genre) ? "default" : "outline"}
                    className={cn(
                      "cursor-pointer transition-all",
                      selectedGenres.includes(genre) 
                        ? "bg-violet-500 hover:bg-violet-600" 
                        : "hover:bg-white/10"
                    )}
                    onClick={() => toggleGenre(genre)}
                    data-testid={`badge-genre-${genre.toLowerCase()}`}
                  >
                    {genre}
                  </Badge>
                ))}
              </div>
            </Card>

            <Card className="p-5 bg-white/5 border-white/10">
              <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-4">Mood</h2>
              <div className="flex flex-wrap gap-2">
                {MOODS.slice(0, 8).map(mood => (
                  <Badge
                    key={mood}
                    variant={selectedMoods.includes(mood) ? "default" : "outline"}
                    className={cn(
                      "cursor-pointer transition-all",
                      selectedMoods.includes(mood) 
                        ? "bg-fuchsia-500 hover:bg-fuchsia-600" 
                        : "hover:bg-white/10"
                    )}
                    onClick={() => toggleMood(mood)}
                    data-testid={`badge-mood-${mood.toLowerCase()}`}
                  >
                    {mood}
                  </Badge>
                ))}
              </div>
            </Card>

            <Card className="p-5 bg-white/5 border-white/10">
              <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-4">Music Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-white/50 mb-2 block">Tempo (BPM)</label>
                  <div className="flex items-center gap-3">
                    <Slider
                      value={[doc.architecture.tempoBpm]}
                      onValueChange={([v]) => setArchitecture({ tempoBpm: v })}
                      min={60}
                      max={180}
                      step={1}
                      className="flex-1"
                      data-testid="slider-tempo"
                    />
                    <span className="text-sm font-mono text-white w-10">{doc.architecture.tempoBpm}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-white/50 mb-2 block">Key</label>
                    <Select 
                      value={doc.architecture.key.split(' ')[0]} 
                      onValueChange={(v) => setArchitecture({ key: `${v} ${doc.architecture.key.split(' ')[1] || 'Major'}` })}
                    >
                      <SelectTrigger className="bg-white/5 border-white/10" data-testid="select-key">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {KEYS.map(k => <SelectItem key={k} value={k}>{k}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-xs text-white/50 mb-2 block">Scale</label>
                    <Select 
                      value={doc.architecture.key.split(' ')[1] || 'Major'} 
                      onValueChange={(v) => setArchitecture({ key: `${doc.architecture.key.split(' ')[0]} ${v}` })}
                    >
                      <SelectTrigger className="bg-white/5 border-white/10" data-testid="select-scale">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SCALES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-white/50 mb-2 block">Energy</label>
                  <Slider
                    value={[doc.lanes.energy]}
                    onValueChange={([v]) => setLanes({ energy: v })}
                    min={0}
                    max={100}
                    className="w-full"
                    data-testid="slider-energy"
                  />
                </div>
              </div>
            </Card>
          </div>

          <div className="col-span-5 space-y-4">
            <Card className="p-5 bg-white/5 border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wider">Song Structure</h2>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={handleAddSection}
                  className="gap-1"
                  data-testid="button-add-section"
                >
                  <Plus className="w-4 h-4" /> Add Section
                </Button>
              </div>

              <div className="space-y-3">
                {sections.map((section, idx) => (
                  <div 
                    key={section.id}
                    className="group p-4 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-all"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <GripVertical className="w-4 h-4 text-white/30" />
                      <Select 
                        value={section.type} 
                        onValueChange={(v) => updateSection(section.id, { type: v, label: v })}
                      >
                        <SelectTrigger className="w-32 bg-white/5 border-white/10" data-testid={`select-section-type-${idx}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {SECTION_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <Input
                        value={section.label}
                        onChange={(e) => updateSection(section.id, { label: e.target.value })}
                        className="flex-1 bg-white/5 border-white/10"
                        placeholder="Section label..."
                        data-testid={`input-section-label-${idx}`}
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => removeSection(section.id)}
                        className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300"
                        data-testid={`button-remove-section-${idx}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <Textarea
                      value={section.content}
                      onChange={(e) => updateSection(section.id, { content: e.target.value })}
                      placeholder="Lyrics or description for this section..."
                      className="bg-white/5 border-white/10 min-h-[80px] resize-none"
                      data-testid={`textarea-section-content-${idx}`}
                    />
                  </div>
                ))}

                {sections.length === 0 && (
                  <div className="text-center py-12 text-white/40">
                    <Music className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No sections yet. Click "Add Section" to start building your song.</p>
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-5 bg-white/5 border-white/10">
              <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-4">Full Lyrics</h2>
              <Textarea
                value={doc.lyrics.text}
                onChange={(e) => setLyrics(e.target.value)}
                placeholder="Paste or write your complete lyrics here..."
                className="bg-white/5 border-white/10 min-h-[200px] resize-y font-mono text-sm"
                data-testid="textarea-lyrics"
              />
            </Card>
          </div>

          <div className="col-span-4">
            <Card className="p-5 bg-white/5 border-white/10 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wider">Generated Prompt</h2>
                <Button 
                  size="sm" 
                  onClick={handleCopy}
                  className="gap-2"
                  data-testid="button-copy-prompt"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
              </div>

              <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-white/80 whitespace-pre-wrap max-h-[500px] overflow-y-auto" data-testid="text-compiled-prompt">
                {compiledPrompt || 'Your prompt will appear here as you build your song...'}
              </div>

              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between text-xs text-white/50">
                  <span>Characters: {compiledPrompt.length}</span>
                  <span className={compiledPrompt.length > 4500 ? 'text-red-400' : 'text-green-400'}>
                    {compiledPrompt.length > 4500 ? 'Over limit' : 'Within limit'}
                  </span>
                </div>
              </div>
            </Card>
          </div>
          
        </div>
      </main>
    </div>
  );
}
