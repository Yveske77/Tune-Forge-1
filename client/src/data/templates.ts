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
  {
    id: 'melodic-techno',
    name: 'Melodic Techno',
    description: 'Hypnotic, driving beats with emotional melodic elements',
    category: 'Electronic',
    architecture: {
      tempoBpm: 128,
      key: 'A Min',
      timeSignature: '4/4',
      genreTags: ['Techno', 'Electronic'],
      subgenre: 'Melodic Techno',
    },
    lanes: { energy: 70, density: 60, brightness: 55, vocalPresence: 25 },
    suggestedSections: [
      { type: 'Intro', label: 'Intro', content: 'Atmospheric pads, kick fading in' },
      { type: 'Verse', label: 'Build 1', content: 'Add percussion, arpeggios' },
      { type: 'Chorus', label: 'Peak 1', content: 'Full groove, melodic lead' },
      { type: 'Bridge', label: 'Breakdown', content: 'Strip to pads, tension build' },
      { type: 'Chorus', label: 'Peak 2', content: 'Maximum energy, all layers' },
      { type: 'Outro', label: 'Outro', content: 'Gradual elements removal' },
    ],
    instrumentGroups: [
      { id: 'drums', name: 'Drums', items: [
        { name: 'Punchy Kick', level: 85, position: 'center' },
        { name: 'Hi-Hats', level: 55, position: 'wide' },
        { name: 'Clap', level: 60, position: 'center' },
      ]},
      { id: 'synths', name: 'Synths', items: [
        { name: 'Driving Arp', level: 65, position: 'front' },
        { name: 'Atmospheric Pad', level: 50, position: 'back' },
        { name: 'Melodic Lead', level: 60, position: 'front' },
      ]},
      { id: 'bass', name: 'Bass', items: [
        { name: 'Analog Bass', level: 75, position: 'center' },
      ]},
    ],
    nuancePresets: {
      mix: ['hypnotic', 'driving', 'emotional'],
      fx: ['sidechain', 'reverb tails', 'delay throws'],
      vocalTone: ['processed', 'chopped', 'ethereal'],
    },
  },
  {
    id: 'future-bass',
    name: 'Future Bass',
    description: 'Colorful synths, wobbly chords, and energetic drops',
    category: 'Electronic',
    architecture: {
      tempoBpm: 150,
      key: 'C Maj',
      timeSignature: '4/4',
      genreTags: ['Future Bass', 'EDM'],
      subgenre: 'Future Bass',
    },
    lanes: { energy: 75, density: 70, brightness: 80, vocalPresence: 60 },
    suggestedSections: [
      { type: 'Intro', label: 'Intro', content: 'Vocal chops, atmospheric build' },
      { type: 'Verse', label: 'Verse', content: 'Stripped back, vocal focus' },
      { type: 'Pre-Chorus', label: 'Build', content: 'Rising tension, snare rolls' },
      { type: 'Chorus', label: 'Drop', content: 'Wobbly chords, full energy' },
      { type: 'Bridge', label: 'Bridge', content: 'Emotional breakdown' },
      { type: 'Chorus', label: 'Final Drop', content: 'Extended drop, layered' },
    ],
    instrumentGroups: [
      { id: 'synths', name: 'Synths', items: [
        { name: 'Supersaw Chord', level: 80, position: 'wide' },
        { name: 'Wobble Bass', level: 75, position: 'center' },
        { name: 'Pluck Lead', level: 65, position: 'front' },
      ]},
      { id: 'drums', name: 'Drums', items: [
        { name: 'Hard Kick', level: 80, position: 'center' },
        { name: 'Snare', level: 70, position: 'center' },
        { name: 'Hi-Hats', level: 50, position: 'wide' },
      ]},
    ],
    nuancePresets: {
      mix: ['bright', 'punchy', 'wide'],
      fx: ['sidechain heavy', 'vocal chops', 'white noise risers'],
      vocalTone: ['pitched', 'chopped', 'euphoric'],
    },
  },
  {
    id: 'drum-and-bass',
    name: 'Liquid Drum & Bass',
    description: 'Fast-paced breakbeats with soulful melodies',
    category: 'Electronic',
    architecture: {
      tempoBpm: 174,
      key: 'F Min',
      timeSignature: '4/4',
      genreTags: ['Drum & Bass', 'Electronic'],
      subgenre: 'Liquid DnB',
    },
    lanes: { energy: 65, density: 60, brightness: 65, vocalPresence: 45 },
    suggestedSections: [
      { type: 'Intro', label: 'Intro', content: 'Atmospheric pads, subtle drums' },
      { type: 'Verse', label: 'Verse', content: 'Full drums, rolling bass' },
      { type: 'Chorus', label: 'Chorus', content: 'Melodic lead, emotional peak' },
      { type: 'Bridge', label: 'Breakdown', content: 'Half-time feel, vocals' },
      { type: 'Chorus', label: 'Drop', content: 'Full energy return' },
      { type: 'Outro', label: 'Outro', content: 'Drums fade, ambient end' },
    ],
    instrumentGroups: [
      { id: 'drums', name: 'Drums', items: [
        { name: 'Breakbeat', level: 80, position: 'center' },
        { name: 'Sub Kick', level: 70, position: 'center' },
      ]},
      { id: 'bass', name: 'Bass', items: [
        { name: 'Reese Bass', level: 75, position: 'center' },
        { name: 'Sub Bass', level: 70, position: 'center' },
      ]},
      { id: 'synths', name: 'Synths', items: [
        { name: 'Warm Pad', level: 55, position: 'wide' },
        { name: 'Piano', level: 50, position: 'front' },
      ]},
    ],
    nuancePresets: {
      mix: ['warm', 'rolling', 'soulful'],
      fx: ['reverb', 'delay', 'subtle distortion'],
      vocalTone: ['soulful', 'pitched', 'sampled'],
    },
  },
  {
    id: 'trap-beats',
    name: 'Modern Trap',
    description: 'Hard-hitting 808s with crisp hi-hats and dark melodies',
    category: 'Hip-Hop',
    architecture: {
      tempoBpm: 140,
      key: 'D Min',
      timeSignature: '4/4',
      genreTags: ['Trap', 'Hip-Hop'],
      subgenre: 'Trap',
    },
    lanes: { energy: 60, density: 55, brightness: 50, vocalPresence: 70 },
    suggestedSections: [
      { type: 'Intro', label: 'Intro', content: 'Dark melody, sparse drums' },
      { type: 'Chorus', label: 'Hook', content: 'Catchy hook, full beat' },
      { type: 'Verse', label: 'Verse 1', content: 'Rap verse, rolling hi-hats' },
      { type: 'Chorus', label: 'Hook', content: 'Hook return' },
      { type: 'Verse', label: 'Verse 2', content: 'Second verse, beat switch' },
      { type: 'Bridge', label: 'Bridge', content: 'Melodic bridge, softer' },
      { type: 'Chorus', label: 'Hook', content: 'Final hook' },
    ],
    instrumentGroups: [
      { id: 'drums', name: 'Drums', items: [
        { name: '808 Bass', level: 90, position: 'center' },
        { name: 'Trap Snare', level: 75, position: 'center' },
        { name: 'Hi-Hat Rolls', level: 65, position: 'wide' },
      ]},
      { id: 'synths', name: 'Synths', items: [
        { name: 'Dark Pad', level: 50, position: 'back' },
        { name: 'Bell Melody', level: 55, position: 'front' },
      ]},
    ],
    nuancePresets: {
      mix: ['dark', 'punchy', 'hard-hitting'],
      fx: ['distortion', 'reverb throws', 'gross beat'],
      vocalTone: ['aggressive', 'autotuned', 'doubled'],
    },
  },
  {
    id: 'rnb-slow-jam',
    name: 'R&B Slow Jam',
    description: 'Smooth, sensual R&B with lush harmonies',
    category: 'Pop',
    architecture: {
      tempoBpm: 70,
      key: 'Eb Maj',
      timeSignature: '4/4',
      genreTags: ['R&B', 'Soul'],
      subgenre: 'Contemporary R&B',
    },
    lanes: { energy: 40, density: 45, brightness: 55, vocalPresence: 85 },
    suggestedSections: [
      { type: 'Intro', label: 'Intro', content: 'Soft keys, ambient texture' },
      { type: 'Verse', label: 'Verse 1', content: 'Intimate vocal, minimal beat' },
      { type: 'Pre-Chorus', label: 'Pre-Chorus', content: 'Building, harmonies enter' },
      { type: 'Chorus', label: 'Chorus', content: 'Full arrangement, hook' },
      { type: 'Verse', label: 'Verse 2', content: 'More groove, ad-libs' },
      { type: 'Bridge', label: 'Bridge', content: 'Key change, climax' },
      { type: 'Chorus', label: 'Outro Chorus', content: 'Fade with harmonies' },
    ],
    instrumentGroups: [
      { id: 'keys', name: 'Keys', items: [
        { name: 'Rhodes', level: 60, position: 'center' },
        { name: 'Strings', level: 45, position: 'wide' },
      ]},
      { id: 'drums', name: 'Drums', items: [
        { name: 'Laid-back Kit', level: 50, position: 'center' },
        { name: 'Finger Snaps', level: 40, position: 'wide' },
      ]},
      { id: 'bass', name: 'Bass', items: [
        { name: 'Smooth Bass', level: 55, position: 'center' },
      ]},
    ],
    nuancePresets: {
      mix: ['warm', 'intimate', 'lush'],
      fx: ['plate reverb', 'subtle delay', 'vinyl warmth'],
      vocalTone: ['breathy', 'harmonized', 'soulful'],
    },
  },
  {
    id: 'rock-alternative',
    name: 'Alternative Rock',
    description: 'Dynamic guitars with emotional vocals',
    category: 'Rock',
    architecture: {
      tempoBpm: 125,
      key: 'E Min',
      timeSignature: '4/4',
      genreTags: ['Alternative Rock', 'Rock'],
      subgenre: 'Alternative Rock',
    },
    lanes: { energy: 65, density: 60, brightness: 60, vocalPresence: 70 },
    suggestedSections: [
      { type: 'Intro', label: 'Intro', content: 'Clean guitar, building' },
      { type: 'Verse', label: 'Verse 1', content: 'Quiet dynamics, building' },
      { type: 'Chorus', label: 'Chorus', content: 'Full distortion, powerful' },
      { type: 'Verse', label: 'Verse 2', content: 'More intensity than V1' },
      { type: 'Chorus', label: 'Chorus', content: 'Full band, anthemic' },
      { type: 'Bridge', label: 'Bridge', content: 'Breakdown, building to peak' },
      { type: 'Chorus', label: 'Final Chorus', content: 'Maximum energy' },
    ],
    instrumentGroups: [
      { id: 'guitars', name: 'Guitars', items: [
        { name: 'Distorted Lead', level: 75, position: 'front' },
        { name: 'Rhythm Guitar', level: 70, position: 'wide' },
        { name: 'Clean Arpeggio', level: 50, position: 'wide' },
      ]},
      { id: 'drums', name: 'Drums', items: [
        { name: 'Live Kit', level: 70, position: 'center' },
      ]},
      { id: 'bass', name: 'Bass', items: [
        { name: 'Rock Bass', level: 65, position: 'center' },
      ]},
    ],
    nuancePresets: {
      mix: ['raw', 'dynamic', 'powerful'],
      fx: ['room reverb', 'guitar distortion', 'compression'],
      vocalTone: ['emotional', 'raw', 'harmonized'],
    },
  },
  {
    id: 'dark-synth',
    name: 'Darksynth / Cyberpunk',
    description: 'Aggressive, dark electronic with industrial influences',
    category: 'Electronic',
    architecture: {
      tempoBpm: 130,
      key: 'B Min',
      timeSignature: '4/4',
      genreTags: ['Synthwave', 'Electronic'],
      subgenre: 'Darksynth',
    },
    lanes: { energy: 80, density: 75, brightness: 55, vocalPresence: 20 },
    suggestedSections: [
      { type: 'Intro', label: 'Intro', content: 'Dark drones, tension' },
      { type: 'Verse', label: 'Build', content: 'Mechanical rhythm, rising' },
      { type: 'Chorus', label: 'Assault', content: 'Full aggressive attack' },
      { type: 'Bridge', label: 'Interlude', content: 'Eerie calm, dystopian' },
      { type: 'Chorus', label: 'Final Assault', content: 'Maximum aggression' },
      { type: 'Outro', label: 'Outro', content: 'Decay into darkness' },
    ],
    instrumentGroups: [
      { id: 'synths', name: 'Synths', items: [
        { name: 'Aggressive Lead', level: 80, position: 'front' },
        { name: 'Industrial Pad', level: 65, position: 'wide' },
        { name: 'Distorted Arp', level: 70, position: 'wide' },
      ]},
      { id: 'drums', name: 'Drums', items: [
        { name: 'Hard Kick', level: 85, position: 'center' },
        { name: 'Industrial Snare', level: 75, position: 'center' },
      ]},
      { id: 'bass', name: 'Bass', items: [
        { name: 'Distorted Bass', level: 80, position: 'center' },
      ]},
    ],
    nuancePresets: {
      mix: ['aggressive', 'dark', 'industrial'],
      fx: ['heavy distortion', 'bitcrushing', 'dark reverb'],
      vocalTone: ['distorted', 'robotic', 'screamed'],
    },
  },
  {
    id: 'chillhop',
    name: 'Chillhop / Study Beats',
    description: 'Relaxed hip-hop beats perfect for focus',
    category: 'Hip-Hop',
    architecture: {
      tempoBpm: 90,
      key: 'G Min',
      timeSignature: '4/4',
      genreTags: ['Lo-Fi', 'Hip-Hop'],
      subgenre: 'Chillhop',
    },
    lanes: { energy: 30, density: 35, brightness: 50, vocalPresence: 10 },
    suggestedSections: [
      { type: 'Intro', label: 'Intro', content: 'Ambient sounds, vinyl' },
      { type: 'Verse', label: 'Main Loop', content: 'Core beat, piano sample' },
      { type: 'Chorus', label: 'Hook', content: 'Melodic variation' },
      { type: 'Verse', label: 'Loop B', content: 'New sample, same vibe' },
      { type: 'Outro', label: 'Outro', content: 'Fade with ambient' },
    ],
    instrumentGroups: [
      { id: 'drums', name: 'Drums', items: [
        { name: 'Dusty Kit', level: 55, position: 'center' },
        { name: 'Shaker', level: 35, position: 'wide' },
      ]},
      { id: 'keys', name: 'Keys', items: [
        { name: 'Jazzy Piano', level: 50, position: 'center' },
        { name: 'Rhodes', level: 45, position: 'wide' },
      ]},
      { id: 'bass', name: 'Bass', items: [
        { name: 'Mellow Bass', level: 50, position: 'center' },
      ]},
    ],
    nuancePresets: {
      mix: ['warm', 'dusty', 'cozy'],
      fx: ['vinyl crackle', 'tape saturation', 'lo-fi filter'],
      vocalTone: ['sampled', 'chopped', 'ambient'],
    },
  },
  {
    id: 'psytrance',
    name: 'Psytrance',
    description: 'High-energy trance with psychedelic elements',
    category: 'Electronic',
    architecture: {
      tempoBpm: 145,
      key: 'D Min',
      timeSignature: '4/4',
      genreTags: ['Psytrance', 'Trance'],
      subgenre: 'Psytrance',
    },
    lanes: { energy: 85, density: 75, brightness: 70, vocalPresence: 15 },
    suggestedSections: [
      { type: 'Intro', label: 'Intro', content: 'Trippy textures, building kick' },
      { type: 'Verse', label: 'Build 1', content: 'Add bassline, acid lines' },
      { type: 'Chorus', label: 'Peak 1', content: 'Full psychedelic assault' },
      { type: 'Bridge', label: 'Breakdown', content: 'Cosmic textures, fx' },
      { type: 'Verse', label: 'Build 2', content: 'Rising tension' },
      { type: 'Chorus', label: 'Peak 2', content: 'Ultimate peak energy' },
      { type: 'Outro', label: 'Outro', content: 'Spacey fadeout' },
    ],
    instrumentGroups: [
      { id: 'drums', name: 'Drums', items: [
        { name: 'Psy Kick', level: 90, position: 'center' },
        { name: 'Offbeat Hats', level: 60, position: 'wide' },
      ]},
      { id: 'bass', name: 'Bass', items: [
        { name: 'Rolling Bass', level: 85, position: 'center' },
        { name: 'Acid Line', level: 70, position: 'center' },
      ]},
      { id: 'synths', name: 'Synths', items: [
        { name: 'Trippy Lead', level: 65, position: 'front' },
        { name: 'Cosmic Pad', level: 50, position: 'back' },
      ]},
    ],
    nuancePresets: {
      mix: ['hypnotic', 'psychedelic', 'powerful'],
      fx: ['heavy delay', 'flanger', 'phaser'],
      vocalTone: ['alien', 'processed', 'chanted'],
    },
  },
  {
    id: 'acoustic-folk',
    name: 'Acoustic Folk',
    description: 'Warm, organic acoustic instrumentation',
    category: 'Pop',
    architecture: {
      tempoBpm: 105,
      key: 'C Maj',
      timeSignature: '4/4',
      genreTags: ['Folk', 'Acoustic'],
      subgenre: 'Indie Folk',
    },
    lanes: { energy: 45, density: 40, brightness: 60, vocalPresence: 80 },
    suggestedSections: [
      { type: 'Intro', label: 'Intro', content: 'Fingerpicked guitar' },
      { type: 'Verse', label: 'Verse 1', content: 'Storytelling, minimal' },
      { type: 'Chorus', label: 'Chorus', content: 'Full strum, harmonies' },
      { type: 'Verse', label: 'Verse 2', content: 'Add mandolin/banjo' },
      { type: 'Bridge', label: 'Bridge', content: 'Instrumental break' },
      { type: 'Chorus', label: 'Final Chorus', content: 'Gang vocals, full band' },
      { type: 'Outro', label: 'Outro', content: 'Return to solo guitar' },
    ],
    instrumentGroups: [
      { id: 'strings', name: 'Strings', items: [
        { name: 'Acoustic Guitar', level: 70, position: 'center' },
        { name: 'Mandolin', level: 50, position: 'wide' },
        { name: 'Banjo', level: 45, position: 'wide' },
      ]},
      { id: 'percussion', name: 'Percussion', items: [
        { name: 'Stomp/Clap', level: 55, position: 'center' },
        { name: 'Tambourine', level: 40, position: 'wide' },
      ]},
    ],
    nuancePresets: {
      mix: ['organic', 'warm', 'intimate'],
      fx: ['room reverb', 'light compression', 'natural'],
      vocalTone: ['sincere', 'harmonized', 'storytelling'],
    },
  },
];

export const templateCategories = ['Electronic', 'Pop', 'Rock', 'Hip-Hop', 'Ambient', 'Cinematic'] as const;
