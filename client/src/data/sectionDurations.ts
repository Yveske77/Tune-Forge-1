export interface SectionDurationRecommendation {
  type: string;
  minBars: number;
  maxBars: number;
  defaultBars: number;
  description: string;
}

export interface GenreDurationProfile {
  genre: string;
  sections: Record<string, SectionDurationRecommendation>;
  avgBpm: number;
}

export const sectionDurationsByGenre: Record<string, GenreDurationProfile> = {
  'Deep House': {
    genre: 'Deep House',
    avgBpm: 122,
    sections: {
      'Intro': { type: 'Intro', minBars: 16, maxBars: 32, defaultBars: 16, description: 'Gradual element introduction, filtered kick' },
      'Verse': { type: 'Verse', minBars: 16, maxBars: 32, defaultBars: 16, description: 'Main groove establishment' },
      'Pre-Chorus': { type: 'Pre-Chorus', minBars: 8, maxBars: 16, defaultBars: 8, description: 'Tension build, filter sweeps' },
      'Chorus': { type: 'Chorus', minBars: 16, maxBars: 32, defaultBars: 32, description: 'Full energy drop with melodic lead' },
      'Bridge': { type: 'Bridge', minBars: 16, maxBars: 32, defaultBars: 16, description: 'Breakdown, stripped elements' },
      'Outro': { type: 'Outro', minBars: 16, maxBars: 32, defaultBars: 16, description: 'Gradual fadeout for mixing' },
    },
  },
  'Melodic Techno': {
    genre: 'Melodic Techno',
    avgBpm: 128,
    sections: {
      'Intro': { type: 'Intro', minBars: 16, maxBars: 64, defaultBars: 32, description: 'Hypnotic loop build' },
      'Verse': { type: 'Verse', minBars: 32, maxBars: 64, defaultBars: 32, description: 'Driving groove, layered percussion' },
      'Pre-Chorus': { type: 'Pre-Chorus', minBars: 8, maxBars: 16, defaultBars: 16, description: 'Rising tension, synth swells' },
      'Chorus': { type: 'Chorus', minBars: 32, maxBars: 64, defaultBars: 32, description: 'Peak energy, melodic payoff' },
      'Bridge': { type: 'Bridge', minBars: 16, maxBars: 32, defaultBars: 16, description: 'Atmospheric breakdown' },
      'Outro': { type: 'Outro', minBars: 16, maxBars: 32, defaultBars: 32, description: 'Loop for DJ mixing' },
    },
  },
  'Pop': {
    genre: 'Pop',
    avgBpm: 115,
    sections: {
      'Intro': { type: 'Intro', minBars: 4, maxBars: 8, defaultBars: 8, description: 'Hook teaser or atmospheric setup' },
      'Verse': { type: 'Verse', minBars: 8, maxBars: 16, defaultBars: 16, description: 'Story/narrative development' },
      'Pre-Chorus': { type: 'Pre-Chorus', minBars: 4, maxBars: 8, defaultBars: 8, description: 'Emotional lift to chorus' },
      'Chorus': { type: 'Chorus', minBars: 8, maxBars: 16, defaultBars: 16, description: 'Main hook, memorable melody' },
      'Bridge': { type: 'Bridge', minBars: 4, maxBars: 8, defaultBars: 8, description: 'Contrast section, key change possible' },
      'Outro': { type: 'Outro', minBars: 4, maxBars: 8, defaultBars: 8, description: 'Final hook repetition or fade' },
    },
  },
  'Hip-Hop': {
    genre: 'Hip-Hop',
    avgBpm: 90,
    sections: {
      'Intro': { type: 'Intro', minBars: 4, maxBars: 8, defaultBars: 8, description: 'Beat drop or atmospheric intro' },
      'Verse': { type: 'Verse', minBars: 16, maxBars: 24, defaultBars: 16, description: 'Rap verse, full lyrics' },
      'Pre-Chorus': { type: 'Pre-Chorus', minBars: 4, maxBars: 8, defaultBars: 4, description: 'Optional transition' },
      'Chorus': { type: 'Chorus', minBars: 8, maxBars: 16, defaultBars: 8, description: 'Hook, catchy and repetitive' },
      'Bridge': { type: 'Bridge', minBars: 8, maxBars: 16, defaultBars: 8, description: 'Beat switch or breakdown' },
      'Outro': { type: 'Outro', minBars: 4, maxBars: 8, defaultBars: 8, description: 'Tag or fade' },
    },
  },
  'Trap': {
    genre: 'Trap',
    avgBpm: 140,
    sections: {
      'Intro': { type: 'Intro', minBars: 4, maxBars: 8, defaultBars: 4, description: 'Dark atmosphere, 808 tease' },
      'Verse': { type: 'Verse', minBars: 16, maxBars: 24, defaultBars: 16, description: 'Rapid-fire flow, hi-hat rolls' },
      'Pre-Chorus': { type: 'Pre-Chorus', minBars: 4, maxBars: 8, defaultBars: 4, description: 'Quick lift' },
      'Chorus': { type: 'Chorus', minBars: 8, maxBars: 16, defaultBars: 8, description: 'Hook with melodic ad-libs' },
      'Bridge': { type: 'Bridge', minBars: 8, maxBars: 16, defaultBars: 8, description: 'Tempo/feel change' },
      'Outro': { type: 'Outro', minBars: 4, maxBars: 8, defaultBars: 4, description: 'Quick end or fade' },
    },
  },
  'R&B': {
    genre: 'R&B',
    avgBpm: 75,
    sections: {
      'Intro': { type: 'Intro', minBars: 4, maxBars: 8, defaultBars: 8, description: 'Smooth, atmospheric entry' },
      'Verse': { type: 'Verse', minBars: 16, maxBars: 24, defaultBars: 16, description: 'Intimate storytelling' },
      'Pre-Chorus': { type: 'Pre-Chorus', minBars: 4, maxBars: 8, defaultBars: 8, description: 'Building emotion' },
      'Chorus': { type: 'Chorus', minBars: 8, maxBars: 16, defaultBars: 16, description: 'Melodic, soulful hook' },
      'Bridge': { type: 'Bridge', minBars: 8, maxBars: 16, defaultBars: 8, description: 'Emotional peak, key change' },
      'Outro': { type: 'Outro', minBars: 8, maxBars: 16, defaultBars: 8, description: 'Vocal runs, fade' },
    },
  },
  'Rock': {
    genre: 'Rock',
    avgBpm: 125,
    sections: {
      'Intro': { type: 'Intro', minBars: 4, maxBars: 16, defaultBars: 8, description: 'Riff or drum intro' },
      'Verse': { type: 'Verse', minBars: 8, maxBars: 16, defaultBars: 16, description: 'Dynamic verse, storytelling' },
      'Pre-Chorus': { type: 'Pre-Chorus', minBars: 4, maxBars: 8, defaultBars: 8, description: 'Building intensity' },
      'Chorus': { type: 'Chorus', minBars: 8, maxBars: 16, defaultBars: 16, description: 'Power chorus, anthemic' },
      'Bridge': { type: 'Bridge', minBars: 8, maxBars: 16, defaultBars: 16, description: 'Solo section or contrast' },
      'Outro': { type: 'Outro', minBars: 4, maxBars: 16, defaultBars: 8, description: 'Big ending or fade' },
    },
  },
  'Ambient': {
    genre: 'Ambient',
    avgBpm: 60,
    sections: {
      'Intro': { type: 'Intro', minBars: 16, maxBars: 64, defaultBars: 32, description: 'Slow emergence from silence' },
      'Verse': { type: 'Verse', minBars: 32, maxBars: 128, defaultBars: 64, description: 'Main textural exploration' },
      'Pre-Chorus': { type: 'Pre-Chorus', minBars: 8, maxBars: 32, defaultBars: 16, description: 'Subtle transition' },
      'Chorus': { type: 'Chorus', minBars: 16, maxBars: 64, defaultBars: 32, description: 'Peak intensity, layered textures' },
      'Bridge': { type: 'Bridge', minBars: 16, maxBars: 64, defaultBars: 32, description: 'New texture introduction' },
      'Outro': { type: 'Outro', minBars: 16, maxBars: 64, defaultBars: 32, description: 'Slow dissolution' },
    },
  },
  'EDM': {
    genre: 'EDM',
    avgBpm: 128,
    sections: {
      'Intro': { type: 'Intro', minBars: 8, maxBars: 16, defaultBars: 16, description: 'Energy tease, atmospheric' },
      'Verse': { type: 'Verse', minBars: 16, maxBars: 32, defaultBars: 16, description: 'Buildup phase' },
      'Pre-Chorus': { type: 'Pre-Chorus', minBars: 8, maxBars: 16, defaultBars: 16, description: 'Riser, snare builds' },
      'Chorus': { type: 'Chorus', minBars: 16, maxBars: 32, defaultBars: 32, description: 'Drop - maximum energy' },
      'Bridge': { type: 'Bridge', minBars: 8, maxBars: 16, defaultBars: 16, description: 'Breakdown, vocal chops' },
      'Outro': { type: 'Outro', minBars: 8, maxBars: 16, defaultBars: 16, description: 'Final drop or fade' },
    },
  },
  'Cinematic': {
    genre: 'Cinematic',
    avgBpm: 90,
    sections: {
      'Intro': { type: 'Intro', minBars: 8, maxBars: 32, defaultBars: 16, description: 'Tension build, mysterious' },
      'Verse': { type: 'Verse', minBars: 16, maxBars: 32, defaultBars: 16, description: 'Rising action' },
      'Pre-Chorus': { type: 'Pre-Chorus', minBars: 8, maxBars: 16, defaultBars: 8, description: 'Pre-climax tension' },
      'Chorus': { type: 'Chorus', minBars: 8, maxBars: 16, defaultBars: 16, description: 'Epic climax, full orchestra' },
      'Bridge': { type: 'Bridge', minBars: 8, maxBars: 16, defaultBars: 8, description: 'Calm before storm' },
      'Outro': { type: 'Outro', minBars: 8, maxBars: 16, defaultBars: 8, description: 'Resolution or cliffhanger' },
    },
  },
};

export const moodDurationModifiers: Record<string, { multiplier: number; description: string }> = {
  'energetic': { multiplier: 0.8, description: 'Faster pacing, shorter sections for high energy' },
  'relaxed': { multiplier: 1.3, description: 'Longer sections for a laid-back feel' },
  'building': { multiplier: 1.2, description: 'Extended builds for tension' },
  'aggressive': { multiplier: 0.7, description: 'Punchy, short sections for impact' },
  'melancholic': { multiplier: 1.4, description: 'Drawn out for emotional weight' },
  'euphoric': { multiplier: 0.9, description: 'Quick transitions to peak moments' },
  'hypnotic': { multiplier: 1.5, description: 'Extended loops for trance-like state' },
  'intimate': { multiplier: 1.1, description: 'Slightly longer for personal connection' },
};

export function getRecommendedDuration(
  genre: string,
  sectionType: string,
  mood?: string
): SectionDurationRecommendation | null {
  let profile = sectionDurationsByGenre[genre];
  
  if (!profile) {
    profile = sectionDurationsByGenre['Pop'];
    if (!profile) return null;
  }
  
  const section = profile.sections[sectionType];
  if (!section) return null;
  
  if (mood && moodDurationModifiers[mood]) {
    const modifier = moodDurationModifiers[mood];
    const adjustedBars = Math.round(section.defaultBars * modifier.multiplier);
    const clampedBars = Math.max(section.minBars, Math.min(section.maxBars, adjustedBars));
    return {
      ...section,
      defaultBars: clampedBars,
      description: `${section.description} (${modifier.description})`,
    };
  }
  
  return section;
}

export function getAvailableGenres(): string[] {
  return Object.keys(sectionDurationsByGenre);
}
