export const genreSubgenres: Record<string, string[]> = {
  'Pop': [
    'Synthpop', 'Electropop', 'Dream Pop', 'Indie Pop', 'Art Pop', 'Hyperpop', 
    'Bubblegum Pop', 'Dance Pop', 'Power Pop', 'Bedroom Pop', 'Dark Pop', 'Tropical Pop'
  ],
  'Electropop': ['Synthpop', 'Electro-Pop', 'Futurepop', 'Dance Pop'],
  'Synthpop': ['Dark Synthpop', 'Minimal Synth', 'Coldwave', 'New Wave'],
  'Rock': [
    'Alternative Rock', 'Indie Rock', 'Post-Rock', 'Punk Rock', 'Hard Rock', 
    'Classic Rock', 'Garage Rock', 'Shoegaze', 'Grunge', 'Brit Rock', 'Psychedelic Rock'
  ],
  'Alternative Rock': ['Post-Grunge', 'Britpop', 'Art Rock', 'Math Rock'],
  'Indie Rock': ['Bedroom Rock', 'Jangle Pop', 'Noise Rock', 'Post-Punk Revival'],
  'Metal': [
    'Heavy Metal', 'Thrash Metal', 'Death Metal', 'Black Metal', 'Metalcore', 
    'Djent', 'Nu Metal', 'Symphonic Metal', 'Prog Metal', 'Power Metal', 'Doom Metal'
  ],
  'Heavy Metal': ['NWOBHM', 'Speed Metal', 'Hair Metal'],
  'Hip-Hop': [
    'Trap', 'Drill', 'Boom Bap', 'Cloud Rap', 'Lo-Fi Hip-Hop', 'G-Funk', 
    'UK Rap', 'Conscious Rap', 'Mumble Rap', 'Crunk', 'Southern Hip-Hop', 'East Coast'
  ],
  'Trap': ['Melodic Trap', 'Hard Trap', 'Phonk', 'UK Drill', 'Dark Trap'],
  'Rap': ['Lyrical Rap', 'Gangsta Rap', 'Horrorcore', 'Political Rap'],
  'R&B': [
    'Neo-Soul', 'Contemporary R&B', 'Alt R&B', 'Quiet Storm', 'New Jack Swing',
    'PBR&B', 'Trapsoul', 'Funk R&B'
  ],
  'Electronic': [
    'House', 'Techno', 'Trance', 'Dubstep', 'Drum & Bass', 'Breakbeat',
    'Electro', 'IDM', 'Ambient', 'Downtempo', 'Synthwave', 'Future Bass'
  ],
  'House': [
    'Deep House', 'Tech House', 'Progressive House', 'Melodic House', 'Afro House',
    'Tropical House', 'Future House', 'Bass House', 'Disco House', 'Minimal House'
  ],
  'Deep House': ['Melodic Deep House', 'Afro Deep House', 'Organic House'],
  'Tech House': ['Minimal Tech', 'Groovy Tech', 'Peak Time Tech'],
  'Techno': [
    'Minimal Techno', 'Melodic Techno', 'Industrial Techno', 'Acid Techno',
    'Detroit Techno', 'Berlin Techno', 'Hard Techno', 'Dub Techno'
  ],
  'Trance': [
    'Progressive Trance', 'Psytrance', 'Uplifting Trance', 'Vocal Trance',
    'Tech Trance', 'Goa Trance', 'Hard Trance'
  ],
  'Dubstep': ['Brostep', 'Melodic Dubstep', 'Riddim', 'Future Garage', 'UK Dubstep'],
  'Drum & Bass': ['Liquid DnB', 'Neurofunk', 'Jump Up', 'Jungle', 'Atmospheric DnB'],
  'EDM': [
    'Big Room', 'Festival House', 'Electro House', 'Progressive', 'Future Bounce',
    'Hardstyle', 'Melbourne Bounce'
  ],
  'Ambient': [
    'Dark Ambient', 'Space Ambient', 'Drone', 'New Age', 'Ambient Techno',
    'Ethereal', 'Healing Ambient'
  ],
  'Synthwave': ['Retrowave', 'Darksynth', 'Outrun', 'Chillwave', 'Vaporwave'],
  'Lo-Fi': ['Lo-Fi Hip-Hop', 'Lo-Fi House', 'Chillhop', 'Study Beats'],
  'Jazz': [
    'Smooth Jazz', 'Bebop', 'Cool Jazz', 'Jazz Fusion', 'Acid Jazz',
    'Nu Jazz', 'Latin Jazz', 'Free Jazz'
  ],
  'Classical': [
    'Orchestral', 'Chamber Music', 'Neoclassical', 'Minimalist', 'Romantic',
    'Baroque', 'Contemporary Classical'
  ],
  'Country': [
    'Modern Country', 'Country Pop', 'Americana', 'Outlaw Country', 'Bluegrass',
    'Country Rock', 'Alt-Country'
  ],
  'Folk': [
    'Indie Folk', 'Folk Rock', 'Contemporary Folk', 'Acoustic Folk', 'Celtic Folk',
    'Nordic Folk', 'Neofolk'
  ],
  'Latin': [
    'Reggaeton', 'Latin Pop', 'Salsa', 'Bachata', 'Cumbia', 'Dembow',
    'Latin Trap', 'Regional Mexican'
  ],
  'Soul': ['Neo-Soul', 'Classic Soul', 'Blue-Eyed Soul', 'Northern Soul', 'Philly Soul'],
  'Funk': ['P-Funk', 'Electro-Funk', 'Funk Rock', 'Boogie', 'Go-Go'],
  'Reggae': ['Roots Reggae', 'Dancehall', 'Dub', 'Lovers Rock', 'Ragga'],
  'World': ['Afrobeats', 'K-Pop', 'J-Pop', 'Bollywood', 'Celtic', 'Middle Eastern'],
  'Cinematic': [
    'Epic Orchestral', 'Trailer Music', 'Film Score', 'Dark Cinematic',
    'Adventure Score', 'Emotional Score', 'Action Score'
  ],
};

export const songStructurePresets: { id: string; name: string; sections: { type: string; label: string; bars: number }[] }[] = [
  {
    id: 'pop-standard',
    name: 'Pop Standard (Verse-Chorus)',
    sections: [
      { type: 'Intro', label: 'Intro', bars: 8 },
      { type: 'Verse', label: 'Verse 1', bars: 16 },
      { type: 'Pre-Chorus', label: 'Pre-Chorus', bars: 8 },
      { type: 'Chorus', label: 'Chorus', bars: 16 },
      { type: 'Verse', label: 'Verse 2', bars: 16 },
      { type: 'Pre-Chorus', label: 'Pre-Chorus', bars: 8 },
      { type: 'Chorus', label: 'Chorus', bars: 16 },
      { type: 'Bridge', label: 'Bridge', bars: 8 },
      { type: 'Chorus', label: 'Final Chorus', bars: 16 },
      { type: 'Outro', label: 'Outro', bars: 8 },
    ],
  },
  {
    id: 'edm-drop',
    name: 'EDM (Build-Drop)',
    sections: [
      { type: 'Intro', label: 'Intro', bars: 16 },
      { type: 'Verse', label: 'Build 1', bars: 16 },
      { type: 'Chorus', label: 'Drop 1', bars: 32 },
      { type: 'Bridge', label: 'Breakdown', bars: 16 },
      { type: 'Verse', label: 'Build 2', bars: 16 },
      { type: 'Chorus', label: 'Drop 2', bars: 32 },
      { type: 'Outro', label: 'Outro', bars: 16 },
    ],
  },
  {
    id: 'hip-hop-classic',
    name: 'Hip-Hop Classic',
    sections: [
      { type: 'Intro', label: 'Intro', bars: 8 },
      { type: 'Verse', label: 'Verse 1', bars: 16 },
      { type: 'Chorus', label: 'Hook', bars: 8 },
      { type: 'Verse', label: 'Verse 2', bars: 16 },
      { type: 'Chorus', label: 'Hook', bars: 8 },
      { type: 'Verse', label: 'Verse 3', bars: 16 },
      { type: 'Chorus', label: 'Hook', bars: 8 },
      { type: 'Outro', label: 'Outro', bars: 8 },
    ],
  },
  {
    id: 'rock-anthem',
    name: 'Rock Anthem',
    sections: [
      { type: 'Intro', label: 'Intro Riff', bars: 8 },
      { type: 'Verse', label: 'Verse 1', bars: 16 },
      { type: 'Chorus', label: 'Chorus', bars: 16 },
      { type: 'Verse', label: 'Verse 2', bars: 16 },
      { type: 'Chorus', label: 'Chorus', bars: 16 },
      { type: 'Bridge', label: 'Solo', bars: 16 },
      { type: 'Chorus', label: 'Final Chorus', bars: 16 },
      { type: 'Outro', label: 'Outro', bars: 8 },
    ],
  },
  {
    id: 'ballad',
    name: 'Ballad / Slow Song',
    sections: [
      { type: 'Intro', label: 'Intro', bars: 8 },
      { type: 'Verse', label: 'Verse 1', bars: 16 },
      { type: 'Verse', label: 'Verse 2', bars: 16 },
      { type: 'Chorus', label: 'Chorus', bars: 16 },
      { type: 'Verse', label: 'Verse 3', bars: 16 },
      { type: 'Chorus', label: 'Chorus', bars: 16 },
      { type: 'Bridge', label: 'Bridge', bars: 8 },
      { type: 'Chorus', label: 'Final Chorus', bars: 16 },
      { type: 'Outro', label: 'Outro', bars: 8 },
    ],
  },
  {
    id: 'aaba',
    name: 'AABA (Jazz Standard)',
    sections: [
      { type: 'Intro', label: 'Intro', bars: 4 },
      { type: 'Verse', label: 'A Section', bars: 8 },
      { type: 'Verse', label: 'A Section', bars: 8 },
      { type: 'Bridge', label: 'B Section', bars: 8 },
      { type: 'Verse', label: 'A Section', bars: 8 },
      { type: 'Outro', label: 'Outro', bars: 4 },
    ],
  },
  {
    id: 'progressive',
    name: 'Progressive / Epic',
    sections: [
      { type: 'Intro', label: 'Ambient Intro', bars: 16 },
      { type: 'Verse', label: 'Part I', bars: 32 },
      { type: 'Chorus', label: 'Theme A', bars: 16 },
      { type: 'Bridge', label: 'Interlude', bars: 16 },
      { type: 'Verse', label: 'Part II', bars: 32 },
      { type: 'Chorus', label: 'Theme B', bars: 16 },
      { type: 'Bridge', label: 'Solo/Breakdown', bars: 32 },
      { type: 'Chorus', label: 'Final Theme', bars: 16 },
      { type: 'Outro', label: 'Epic Outro', bars: 16 },
    ],
  },
  {
    id: 'trap-modern',
    name: 'Modern Trap',
    sections: [
      { type: 'Intro', label: 'Intro', bars: 4 },
      { type: 'Chorus', label: 'Hook', bars: 8 },
      { type: 'Verse', label: 'Verse 1', bars: 16 },
      { type: 'Chorus', label: 'Hook', bars: 8 },
      { type: 'Verse', label: 'Verse 2', bars: 16 },
      { type: 'Chorus', label: 'Hook', bars: 8 },
      { type: 'Bridge', label: 'Bridge', bars: 8 },
      { type: 'Chorus', label: 'Hook', bars: 8 },
      { type: 'Outro', label: 'Outro', bars: 4 },
    ],
  },
  {
    id: 'minimal-loop',
    name: 'Minimal / Loop-Based',
    sections: [
      { type: 'Intro', label: 'Intro', bars: 8 },
      { type: 'Verse', label: 'Loop A', bars: 16 },
      { type: 'Chorus', label: 'Loop B', bars: 16 },
      { type: 'Verse', label: 'Loop A (Var)', bars: 16 },
      { type: 'Chorus', label: 'Loop B (Var)', bars: 16 },
      { type: 'Outro', label: 'Outro', bars: 8 },
    ],
  },
  {
    id: 'cinematic',
    name: 'Cinematic / Trailer',
    sections: [
      { type: 'Intro', label: 'Tension Build', bars: 16 },
      { type: 'Verse', label: 'Rising Action', bars: 16 },
      { type: 'Chorus', label: 'Impact 1', bars: 8 },
      { type: 'Bridge', label: 'Calm Before Storm', bars: 8 },
      { type: 'Verse', label: 'Escalation', bars: 16 },
      { type: 'Chorus', label: 'Main Impact', bars: 16 },
      { type: 'Outro', label: 'Resolution', bars: 8 },
    ],
  },
  {
    id: 'ambient-journey',
    name: 'Ambient Journey',
    sections: [
      { type: 'Intro', label: 'Emergence', bars: 32 },
      { type: 'Verse', label: 'Drift', bars: 64 },
      { type: 'Bridge', label: 'Transition', bars: 16 },
      { type: 'Verse', label: 'Exploration', bars: 64 },
      { type: 'Outro', label: 'Fade', bars: 32 },
    ],
  },
  {
    id: 'verse-chorus-simple',
    name: 'Simple Verse-Chorus',
    sections: [
      { type: 'Intro', label: 'Intro', bars: 8 },
      { type: 'Verse', label: 'Verse 1', bars: 16 },
      { type: 'Chorus', label: 'Chorus', bars: 16 },
      { type: 'Verse', label: 'Verse 2', bars: 16 },
      { type: 'Chorus', label: 'Chorus', bars: 16 },
      { type: 'Outro', label: 'Outro', bars: 8 },
    ],
  },
];
