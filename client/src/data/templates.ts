import type { Architecture, Lanes, Section, LayerGroup } from '@/lib/store';

export interface SubgenreTemplate {
  id: string;
  name: string;
  description: string;
  category: 'Electronic' | 'Pop' | 'Rock' | 'Hip-Hop' | 'Ambient' | 'Cinematic';
  architecture: Partial<Architecture>;
  lanes: Lanes;
  suggestedSections: Pick<Section, 'type' | 'label' | 'content'>[];
  instrumentGroups: LayerGroup[];
  nuancePresets: {
    mix: string[];
    fx: string[];
    vocalTone: string[];
  };
}

export const subgenreTemplates: SubgenreTemplate[] = [
  {
    id: 'melodic-deep-house',
    name: 'Melodic Deep House',
    description: 'Warm, melodic house with emotional progressions and subtle vocals',
    category: 'Electronic',
    architecture: {
      tempoBpm: 122,
      key: 'A Min',
      timeSignature: '4/4',
      genreTags: ['Deep House', 'Melodic House'],
      subgenre: 'Melodic Deep House',
    },
    lanes: { energy: 55, density: 50, brightness: 60, vocalPresence: 40 },
    suggestedSections: [
      { type: 'Intro', label: 'Intro', content: 'Atmospheric pads, filtered kick' },
      { type: 'Verse', label: 'Build 1', content: 'Add bassline, arpeggiated synths' },
      { type: 'Chorus', label: 'Drop 1', content: 'Full energy, melodic lead, driving groove' },
      { type: 'Bridge', label: 'Breakdown', content: 'Strip back, emotional piano, vocals' },
      { type: 'Chorus', label: 'Drop 2', content: 'Peak energy, layered synths' },
      { type: 'Outro', label: 'Outro', content: 'Gradual fadeout, ambient textures' },
    ],
    instrumentGroups: [
      { id: 'drums', name: 'Drums', items: [
        { name: 'Deep Kick', level: 80, position: 'center' },
        { name: 'Shuffled Hats', level: 60, position: 'wide' },
        { name: 'Clap/Snare', level: 55, position: 'center' },
      ]},
      { id: 'bass', name: 'Bass', items: [
        { name: 'Sub Bass', level: 75, position: 'center' },
        { name: 'Warm Bass', level: 65, position: 'center' },
      ]},
      { id: 'synths', name: 'Synths', items: [
        { name: 'Pad', level: 50, position: 'wide' },
        { name: 'Arpeggio', level: 55, position: 'front' },
        { name: 'Lead', level: 60, position: 'front' },
      ]},
    ],
    nuancePresets: {
      mix: ['warm', 'spacious', 'punchy low-end'],
      fx: ['reverb-heavy', 'sidechain compression', 'subtle delay'],
      vocalTone: ['ethereal', 'processed', 'chopped'],
    },
  },
  {
    id: 'synthwave',
    name: 'Synthwave / Retrowave',
    description: '80s-inspired electronic with analog synths and driving beats',
    category: 'Electronic',
    architecture: {
      tempoBpm: 118,
      key: 'F# Min',
      timeSignature: '4/4',
      genreTags: ['Synthwave', 'Electro'],
      subgenre: 'Synthwave',
    },
    lanes: { energy: 70, density: 65, brightness: 75, vocalPresence: 30 },
    suggestedSections: [
      { type: 'Intro', label: 'Intro', content: 'Analog synth sweep, drum machine' },
      { type: 'Verse', label: 'Verse 1', content: 'Pulsing bassline, arpeggios' },
      { type: 'Chorus', label: 'Chorus', content: 'Big synth lead, power chords' },
      { type: 'Verse', label: 'Verse 2', content: 'Add layers, driving energy' },
      { type: 'Bridge', label: 'Solo', content: 'Guitar solo or synth solo' },
      { type: 'Chorus', label: 'Final Chorus', content: 'Maximum energy, all layers' },
    ],
    instrumentGroups: [
      { id: 'drums', name: 'Drums', items: [
        { name: 'Gated Reverb Snare', level: 80, position: 'center' },
        { name: 'Electronic Kick', level: 75, position: 'center' },
        { name: 'Toms', level: 50, position: 'wide' },
      ]},
      { id: 'synths', name: 'Synths', items: [
        { name: 'Analog Lead', level: 70, position: 'front' },
        { name: 'Saw Pad', level: 60, position: 'wide' },
        { name: 'Arpeggiator', level: 65, position: 'front' },
      ]},
      { id: 'bass', name: 'Bass', items: [
        { name: 'Analog Bass', level: 75, position: 'center' },
      ]},
    ],
    nuancePresets: {
      mix: ['bright', 'punchy', '80s aesthetic'],
      fx: ['gated reverb', 'chorus', 'analog warmth'],
      vocalTone: ['vocoder', 'robotic', 'clean'],
    },
  },
  {
    id: 'lo-fi-hip-hop',
    name: 'Lo-Fi Hip Hop',
    description: 'Chill beats with vinyl texture and jazzy samples',
    category: 'Hip-Hop',
    architecture: {
      tempoBpm: 85,
      key: 'D Min',
      timeSignature: '4/4',
      genreTags: ['Lo-Fi', 'Hip-Hop'],
      subgenre: 'Lo-Fi Hip Hop',
    },
    lanes: { energy: 35, density: 40, brightness: 45, vocalPresence: 15 },
    suggestedSections: [
      { type: 'Intro', label: 'Intro', content: 'Vinyl crackle, ambient sounds' },
      { type: 'Verse', label: 'Loop A', content: 'Main sample, drums, bass' },
      { type: 'Chorus', label: 'Loop B', content: 'Variation with added keys' },
      { type: 'Verse', label: 'Loop A2', content: 'Return to main loop' },
      { type: 'Outro', label: 'Outro', content: 'Fade with ambient textures' },
    ],
    instrumentGroups: [
      { id: 'drums', name: 'Drums', items: [
        { name: 'Dusty Kick', level: 65, position: 'center' },
        { name: 'Vinyl Snare', level: 55, position: 'center' },
        { name: 'Shaker', level: 40, position: 'wide' },
      ]},
      { id: 'melodic', name: 'Melodic', items: [
        { name: 'Jazz Piano', level: 60, position: 'front' },
        { name: 'Rhodes', level: 55, position: 'wide' },
        { name: 'Muted Guitar', level: 45, position: 'back' },
      ]},
      { id: 'bass', name: 'Bass', items: [
        { name: 'Warm Sub', level: 60, position: 'center' },
      ]},
    ],
    nuancePresets: {
      mix: ['dusty', 'warm', 'lo-fi'],
      fx: ['vinyl noise', 'tape saturation', 'bit-crush'],
      vocalTone: ['sampled', 'pitched', 'ambient'],
    },
  },
  {
    id: 'epic-cinematic',
    name: 'Epic Cinematic',
    description: 'Orchestral epic with modern hybrid elements',
    category: 'Cinematic',
    architecture: {
      tempoBpm: 90,
      key: 'C Min',
      timeSignature: '4/4',
      genreTags: ['Cinematic', 'Orchestral'],
      subgenre: 'Epic Trailer',
    },
    lanes: { energy: 80, density: 75, brightness: 70, vocalPresence: 25 },
    suggestedSections: [
      { type: 'Intro', label: 'Tension Build', content: 'Low strings, distant percussion' },
      { type: 'Verse', label: 'Theme Intro', content: 'Main theme statement, building' },
      { type: 'Chorus', label: 'Epic Peak', content: 'Full orchestra, brass fanfare' },
      { type: 'Bridge', label: 'Breakdown', content: 'Emotional piano, choir' },
      { type: 'Chorus', label: 'Final Climax', content: 'Maximum impact, all forces' },
      { type: 'Outro', label: 'Resolution', content: 'Triumphant ending' },
    ],
    instrumentGroups: [
      { id: 'orchestra', name: 'Orchestra', items: [
        { name: 'Strings Ensemble', level: 80, position: 'wide' },
        { name: 'French Horns', level: 75, position: 'back' },
        { name: 'Brass Section', level: 70, position: 'center' },
      ]},
      { id: 'percussion', name: 'Percussion', items: [
        { name: 'Taiko Drums', level: 85, position: 'center' },
        { name: 'Cymbals', level: 60, position: 'wide' },
        { name: 'Snare Rolls', level: 65, position: 'front' },
      ]},
      { id: 'choir', name: 'Choir', items: [
        { name: 'Epic Choir', level: 70, position: 'back' },
      ]},
    ],
    nuancePresets: {
      mix: ['massive', 'cinematic', 'impactful'],
      fx: ['hall reverb', 'compression', 'low-end rumble'],
      vocalTone: ['choral', 'powerful', 'latin text'],
    },
  },
  {
    id: 'indie-pop',
    name: 'Indie Pop',
    description: 'Catchy melodies with organic instrumentation and quirky production',
    category: 'Pop',
    architecture: {
      tempoBpm: 115,
      key: 'G Maj',
      timeSignature: '4/4',
      genreTags: ['Indie Pop', 'Dream Pop'],
      subgenre: 'Indie Pop',
    },
    lanes: { energy: 55, density: 50, brightness: 65, vocalPresence: 75 },
    suggestedSections: [
      { type: 'Intro', label: 'Intro', content: 'Guitar riff, light drums' },
      { type: 'Verse', label: 'Verse 1', content: 'Intimate vocal, sparse arrangement' },
      { type: 'Pre-Chorus', label: 'Pre-Chorus', content: 'Building energy, add synths' },
      { type: 'Chorus', label: 'Chorus', content: 'Full band, catchy hook' },
      { type: 'Verse', label: 'Verse 2', content: 'More layers than V1' },
      { type: 'Bridge', label: 'Bridge', content: 'Key change, emotional peak' },
      { type: 'Chorus', label: 'Final Chorus', content: 'Double chorus, gang vocals' },
    ],
    instrumentGroups: [
      { id: 'guitars', name: 'Guitars', items: [
        { name: 'Jangly Electric', level: 65, position: 'wide' },
        { name: 'Acoustic Strum', level: 55, position: 'front' },
      ]},
      { id: 'drums', name: 'Drums', items: [
        { name: 'Organic Kit', level: 60, position: 'center' },
        { name: 'Tambourine', level: 40, position: 'wide' },
      ]},
      { id: 'synths', name: 'Synths', items: [
        { name: 'Warm Pad', level: 45, position: 'back' },
        { name: 'Glockenspiel', level: 35, position: 'front' },
      ]},
    ],
    nuancePresets: {
      mix: ['organic', 'bright', 'intimate'],
      fx: ['light reverb', 'tape warmth', 'subtle compression'],
      vocalTone: ['breathy', 'doubled', 'harmonized'],
    },
  },
  {
    id: 'ambient-drone',
    name: 'Ambient / Drone',
    description: 'Atmospheric soundscapes with evolving textures',
    category: 'Ambient',
    architecture: {
      tempoBpm: 60,
      key: 'E Min',
      timeSignature: '4/4',
      genreTags: ['Ambient', 'Electronic'],
      subgenre: 'Ambient Drone',
    },
    lanes: { energy: 25, density: 30, brightness: 50, vocalPresence: 10 },
    suggestedSections: [
      { type: 'Intro', label: 'Emergence', content: 'Slowly fading in textures' },
      { type: 'Verse', label: 'Evolution A', content: 'Main drone, subtle movement' },
      { type: 'Chorus', label: 'Peak', content: 'Additional layers, harmonic shift' },
      { type: 'Verse', label: 'Evolution B', content: 'New textures, slow morph' },
      { type: 'Outro', label: 'Dissolution', content: 'Gradual fade, spacious end' },
    ],
    instrumentGroups: [
      { id: 'pads', name: 'Pads', items: [
        { name: 'Granular Pad', level: 70, position: 'wide' },
        { name: 'String Drone', level: 55, position: 'back' },
      ]},
      { id: 'textures', name: 'Textures', items: [
        { name: 'Field Recording', level: 40, position: 'wide' },
        { name: 'Noise Wash', level: 35, position: 'back' },
      ]},
    ],
    nuancePresets: {
      mix: ['spacious', 'ethereal', 'immersive'],
      fx: ['long reverb', 'granular processing', 'modulation'],
      vocalTone: ['wordless', 'processed', 'ghostly'],
    },
  },
];

export const templateCategories = ['Electronic', 'Pop', 'Rock', 'Hip-Hop', 'Ambient', 'Cinematic'] as const;
