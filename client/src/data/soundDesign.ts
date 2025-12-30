export interface SoundQuality {
  id: string;
  name: string;
  description: string;
  emotionalImpact: string;
}

export const timbreOptions: SoundQuality[] = [
  { id: 'airy', name: 'Airy', description: 'Light, open, and spacious sound with high frequencies', emotionalImpact: 'Ethereal, dreamy, floating' },
  { id: 'warm', name: 'Warm', description: 'Rich mid-low frequencies, smooth and inviting', emotionalImpact: 'Comforting, intimate, nostalgic' },
  { id: 'bright', name: 'Bright', description: 'Emphasized high frequencies, crisp and clear', emotionalImpact: 'Energetic, optimistic, alert' },
  { id: 'dark', name: 'Dark', description: 'Reduced highs, heavy low-mids', emotionalImpact: 'Mysterious, brooding, intense' },
  { id: 'metallic', name: 'Metallic', description: 'Sharp, resonant, bell-like harmonics', emotionalImpact: 'Industrial, cold, futuristic' },
  { id: 'woody', name: 'Woody', description: 'Natural, organic resonance like acoustic instruments', emotionalImpact: 'Earthy, authentic, grounded' },
  { id: 'glassy', name: 'Glassy', description: 'Crystalline, pure, with clean overtones', emotionalImpact: 'Pristine, delicate, fragile' },
  { id: 'gritty', name: 'Gritty', description: 'Rough edges, distorted harmonics', emotionalImpact: 'Raw, aggressive, powerful' },
  { id: 'hollow', name: 'Hollow', description: 'Emphasized mids with scooped frequencies', emotionalImpact: 'Distant, empty, haunting' },
  { id: 'full', name: 'Full', description: 'Balanced across all frequencies, rich', emotionalImpact: 'Complete, satisfying, powerful' },
  { id: 'nasal', name: 'Nasal', description: 'Concentrated mid-range, slightly pinched', emotionalImpact: 'Quirky, vintage, character' },
  { id: 'breathy', name: 'Breathy', description: 'Air and breath audible in the sound', emotionalImpact: 'Intimate, vulnerable, human' },
];

export const textureOptions: SoundQuality[] = [
  { id: 'dry', name: 'Dry', description: 'No reverb or effects, direct and close', emotionalImpact: 'Immediate, intimate, raw' },
  { id: 'wet', name: 'Wet', description: 'Heavy reverb and spatial effects', emotionalImpact: 'Spacious, dreamy, atmospheric' },
  { id: 'clean', name: 'Clean', description: 'Pure signal, no distortion or saturation', emotionalImpact: 'Pristine, professional, polished' },
  { id: 'saturated', name: 'Saturated', description: 'Warm harmonic distortion, tape-like', emotionalImpact: 'Vintage, warm, characterful' },
  { id: 'distorted', name: 'Distorted', description: 'Heavy clipping and harmonic content', emotionalImpact: 'Aggressive, powerful, intense' },
  { id: 'lo-fi', name: 'Lo-Fi', description: 'Degraded quality, bitcrushed, filtered', emotionalImpact: 'Nostalgic, dreamy, imperfect' },
  { id: 'granular', name: 'Granular', description: 'Broken into particles, glitchy textures', emotionalImpact: 'Experimental, otherworldly, fragmented' },
  { id: 'smooth', name: 'Smooth', description: 'Gentle transitions, no harsh edges', emotionalImpact: 'Calming, sophisticated, refined' },
  { id: 'choppy', name: 'Choppy', description: 'Gated, rhythmic interruptions', emotionalImpact: 'Energetic, urgent, dynamic' },
  { id: 'layered', name: 'Layered', description: 'Multiple textures stacked together', emotionalImpact: 'Rich, complex, immersive' },
  { id: 'sparse', name: 'Sparse', description: 'Minimal elements, lots of space', emotionalImpact: 'Minimal, contemplative, focused' },
  { id: 'dense', name: 'Dense', description: 'Many overlapping elements, thick', emotionalImpact: 'Overwhelming, intense, powerful' },
];

export const emotionalArcDescriptors: Record<string, Record<string, string>> = {
  energy: {
    '0-20': 'Tranquil stillness - a meditative, almost silent state',
    '21-40': 'Gentle calm - subtle movement, peaceful undertow',
    '41-60': 'Balanced momentum - steady drive, comfortable pace',
    '61-80': 'Rising intensity - building excitement, driving force',
    '81-100': 'Peak euphoria - explosive energy, maximum impact',
  },
  density: {
    '0-20': 'Minimalist space - sparse arrangement, focused elements',
    '21-40': 'Breathing room - selective layering, clear separation',
    '41-60': 'Balanced texture - full but not crowded, cohesive blend',
    '61-80': 'Rich tapestry - complex layers, interweaving parts',
    '81-100': 'Wall of sound - dense saturation, overwhelming presence',
  },
  brightness: {
    '0-20': 'Deep shadows - dark, murky, heavy atmosphere',
    '21-40': 'Muted tones - subdued highs, warm and soft',
    '41-60': 'Natural balance - clear but not harsh, comfortable',
    '61-80': 'Crystalline clarity - open highs, airy presence',
    '81-100': 'Blazing brilliance - intense highs, shimmering energy',
  },
  vocalPresence: {
    '0-20': 'Instrumental focus - voice as distant texture',
    '21-40': 'Subtle vocals - background harmonies, whispered hints',
    '41-60': 'Balanced voice - clear but not dominant, integrated',
    '61-80': 'Vocal forward - lead voice prominent, emotive delivery',
    '81-100': 'Voice as instrument - commanding presence, raw emotion',
  },
};

export function getEmotionalDescriptor(lane: string, value: number): string {
  const descriptors = emotionalArcDescriptors[lane];
  if (!descriptors) return '';
  
  if (value <= 20) return descriptors['0-20'];
  if (value <= 40) return descriptors['21-40'];
  if (value <= 60) return descriptors['41-60'];
  if (value <= 80) return descriptors['61-80'];
  return descriptors['81-100'];
}

export const soundDesignPresets: { id: string; name: string; timbre: string; texture: string; description: string }[] = [
  { id: 'ethereal-dream', name: 'Ethereal Dream', timbre: 'airy', texture: 'wet', description: 'Floating, spacious soundscape' },
  { id: 'vintage-warmth', name: 'Vintage Warmth', timbre: 'warm', texture: 'saturated', description: 'Nostalgic analog character' },
  { id: 'modern-clean', name: 'Modern Clean', timbre: 'bright', texture: 'clean', description: 'Polished, professional pop sound' },
  { id: 'dark-industrial', name: 'Dark Industrial', timbre: 'metallic', texture: 'distorted', description: 'Aggressive, mechanical edge' },
  { id: 'organic-acoustic', name: 'Organic Acoustic', timbre: 'woody', texture: 'dry', description: 'Natural, intimate feel' },
  { id: 'lo-fi-chill', name: 'Lo-Fi Chill', timbre: 'warm', texture: 'lo-fi', description: 'Relaxed, imperfect charm' },
  { id: 'cinematic-epic', name: 'Cinematic Epic', timbre: 'full', texture: 'layered', description: 'Grand, orchestral scope' },
  { id: 'experimental-glitch', name: 'Experimental Glitch', timbre: 'glassy', texture: 'granular', description: 'Fragmented, otherworldly' },
];
