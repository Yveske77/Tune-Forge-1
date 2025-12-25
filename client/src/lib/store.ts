import { create } from 'zustand';

export type LaneType = 'energy' | 'density' | 'brightness' | 'vocals';

export interface Instrument {
  id: string;
  name: string;
  category: 'drums' | 'bass' | 'chord' | 'lead' | 'vocal' | 'fx';
  role: string;
}

export interface Section {
  id: string;
  name: string;
  length: number; // in bars (approx)
  lanes: Record<LaneType, number>; // 0-100 value
  activeInstruments: string[]; // IDs of active instruments
}

export interface TrackState {
  sections: Section[];
  instruments: Instrument[];
}

interface AppState {
  // Global
  activeTrack: 'A' | 'B';
  currentProjectId: number | null;
  currentProjectName: string;
  tracks: {
    A: TrackState;
    B: TrackState;
  };
  genre: {
    main: string;
    sub: string;
    era: string;
    region: string;
  };
  
  // Actions
  setActiveTrack: (track: 'A' | 'B') => void;
  setCurrentProject: (id: number | null, name: string) => void;
  updateSection: (track: 'A' | 'B', sectionId: string, updates: Partial<Section>) => void;
  updateLane: (track: 'A' | 'B', sectionId: string, lane: LaneType, value: number) => void;
  addSection: (track: 'A' | 'B') => void;
  removeSection: (track: 'A' | 'B', sectionId: string) => void;
  setGenre: (updates: Partial<AppState['genre']>) => void;
  toggleInstrument: (track: 'A' | 'B', sectionId: string, instrumentId: string) => void;
  loadProject: (tracks: { A: TrackState; B: TrackState }, genre: AppState['genre']) => void;
  resetToDefault: () => void;
}

const DEFAULT_SECTIONS: Section[] = [
  { id: '1', name: 'Intro', length: 4, lanes: { energy: 20, density: 30, brightness: 40, vocals: 0 }, activeInstruments: ['pad-1'] },
  { id: '2', name: 'Verse 1', length: 8, lanes: { energy: 40, density: 40, brightness: 50, vocals: 80 }, activeInstruments: ['kick-1', 'bass-1', 'voc-1'] },
  { id: '3', name: 'Pre-Chorus', length: 4, lanes: { energy: 60, density: 50, brightness: 70, vocals: 70 }, activeInstruments: ['kick-1', 'bass-1', 'voc-1', 'syn-1'] },
  { id: '4', name: 'Chorus', length: 8, lanes: { energy: 90, density: 80, brightness: 90, vocals: 100 }, activeInstruments: ['kick-1', 'snare-1', 'bass-1', 'voc-1', 'syn-1', 'pad-1'] },
  { id: '5', name: 'Outro', length: 4, lanes: { energy: 30, density: 20, brightness: 40, vocals: 0 }, activeInstruments: ['pad-1'] },
];

const DEFAULT_INSTRUMENTS: Instrument[] = [
  { id: 'voc-1', name: 'Lead Vocal', category: 'vocal', role: 'Front, Dry' },
  { id: 'kick-1', name: 'Kick Drum', category: 'drums', role: 'Punchy' },
  { id: 'snare-1', name: 'Snare', category: 'drums', role: 'Tight' },
  { id: 'bass-1', name: 'Sub Bass', category: 'bass', role: 'Center' },
  { id: 'pad-1', name: 'Atmosphere', category: 'chord', role: 'Wide' },
  { id: 'syn-1', name: 'Arp Synth', category: 'lead', role: 'Moving' },
];

const DEFAULT_GENRE = {
  main: 'Electronic',
  sub: 'Deep House',
  era: '2016',
  region: 'UK'
};

const getDefaultState = () => ({
  activeTrack: 'A' as const,
  currentProjectId: null,
  currentProjectName: 'Untitled Project',
  tracks: {
    A: {
      sections: DEFAULT_SECTIONS,
      instruments: DEFAULT_INSTRUMENTS,
    },
    B: {
      sections: JSON.parse(JSON.stringify(DEFAULT_SECTIONS)),
      instruments: DEFAULT_INSTRUMENTS,
    }
  },
  genre: DEFAULT_GENRE,
});

export const useStore = create<AppState>((set) => ({
  ...getDefaultState(),

  setActiveTrack: (track) => set({ activeTrack: track }),
  
  setCurrentProject: (id, name) => set({ currentProjectId: id, currentProjectName: name }),

  updateSection: (track, sectionId, updates) => set((state) => ({
    tracks: {
      ...state.tracks,
      [track]: {
        ...state.tracks[track],
        sections: state.tracks[track].sections.map(s => 
          s.id === sectionId ? { ...s, ...updates } : s
        )
      }
    }
  })),

  updateLane: (track, sectionId, lane, value) => set((state) => ({
    tracks: {
      ...state.tracks,
      [track]: {
        ...state.tracks[track],
        sections: state.tracks[track].sections.map(s => 
          s.id === sectionId ? { 
            ...s, 
            lanes: { ...s.lanes, [lane]: value } 
          } : s
        )
      }
    }
  })),

  addSection: (track) => set((state) => {
    const newId = Math.random().toString(36).substr(2, 9);
    return {
      tracks: {
        ...state.tracks,
        [track]: {
          ...state.tracks[track],
          sections: [...state.tracks[track].sections, {
            id: newId,
            name: 'New Section',
            length: 4,
            lanes: { energy: 50, density: 50, brightness: 50, vocals: 50 },
            activeInstruments: []
          }]
        }
      }
    };
  }),

  removeSection: (track, sectionId) => set((state) => ({
    tracks: {
      ...state.tracks,
      [track]: {
        ...state.tracks[track],
        sections: state.tracks[track].sections.filter(s => s.id !== sectionId)
      }
    }
  })),

  setGenre: (updates) => set((state) => ({ genre: { ...state.genre, ...updates } })),

  toggleInstrument: (track, sectionId, instrumentId) => set((state) => ({
    tracks: {
      ...state.tracks,
      [track]: {
        ...state.tracks[track],
        sections: state.tracks[track].sections.map(s => {
          if (s.id !== sectionId) return s;
          const isActive = s.activeInstruments.includes(instrumentId);
          return {
            ...s,
            activeInstruments: isActive 
              ? s.activeInstruments.filter(id => id !== instrumentId)
              : [...s.activeInstruments, instrumentId]
          };
        })
      }
    }
  })),

  loadProject: (tracks, genre) => set({ tracks, genre }),

  resetToDefault: () => set(getDefaultState()),
}));
