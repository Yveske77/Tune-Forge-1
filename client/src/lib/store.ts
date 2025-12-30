import { create } from 'zustand';

// Types
export type LaneType = 'energy' | 'density' | 'brightness' | 'vocalPresence';

export interface LayerItem {
  name: string;
  level: number;
  position?: 'front' | 'center' | 'back' | 'wide' | 'mono';
}

export interface LayerGroup {
  id: string;
  name: string;
  items: LayerItem[];
}

export interface SectionLayers {
  instruments: LayerItem[];
  voices: LayerItem[];
}

export interface Section {
  id: string;
  type: string;
  label: string;
  content: string;
  modifiers: string[];
  emphasis: string[];
  tension: number;
  bars: number;
  lanes?: Record<LaneType, number>;
  layers?: SectionLayers;
}

export interface Meta {
  target: 'suno' | 'udio' | 'generic';
  modelVersion: string;
  title: string;
  language: string;
  voiceType: string;
}

export interface Architecture {
  tempoBpm: number;
  key: string;
  timeSignature: string;
  genreTags: string[];
  subgenre?: string;
  microtags?: string[];
}

export interface Nuance {
  mix: string[];
  fx: string[];
  vocalTone: string[];
}

export interface Lanes {
  energy: number;
  density: number;
  brightness: number;
  vocalPresence: number;
}

export interface Layers {
  instruments: LayerGroup[];
  voices: LayerGroup[];
}

export interface PaintUI {
  enabled: boolean;
  mode: 'lane' | 'layer';
  laneKey: LaneType;
  kind: 'instruments' | 'voices';
  groupId: string;
  itemName: string;
  snap: boolean;
}

export interface Document {
  meta: Meta;
  architecture: Architecture;
  nuance: Nuance;
  activeVariant: 'A' | 'B';
  arrangementVariants: {
    A: { name: string; enabled: boolean };
    B: { name: string; enabled: boolean };
  };
  lanes: Lanes;
  layers: Layers;
  arrangementTracks: {
    A: Section[];
    B: Section[];
  };
  /** @deprecated Use section.layers instead - per-section layer arrays are now the canonical source */
  sectionLayerAutomation: Record<string, Record<string, Record<string, { level?: number; position?: string }>>>;
  dynamicVars: Record<string, string>;
  lyrics: {
    mode: 'draft' | 'final';
    text: string;
  };
  ui: {
    paint: PaintUI;
  };
}

interface AppState {
  // Project management
  currentProjectId: number | null;
  currentProjectName: string;
  
  // Document
  doc: Document;
  
  // Actions
  setCurrentProject: (id: number | null, name: string) => void;
  setDoc: (updater: ((doc: Document) => Document) | Document) => void;
  setMeta: (patch: Partial<Meta>) => void;
  setArchitecture: (patch: Partial<Architecture>) => void;
  setNuance: (patch: Partial<Nuance>) => void;
  setLanes: (patch: Partial<Lanes>) => void;
  setLyrics: (text: string) => void;
  
  // Variant management
  setActiveVariant: (v: 'A' | 'B') => void;
  toggleVariantEnabled: (v: 'A' | 'B') => void;
  cloneVariantFromA: () => void;
  
  // Section management
  addSection: (section: Section) => void;
  updateSection: (id: string, patch: Partial<Section>) => void;
  removeSection: (id: string) => void;
  reorderSections: (orderedIds: string[]) => void;
  setSectionLaneValue: (sectionId: string, laneKey: LaneType, value: number) => void;
  
  // Section layer management
  addSectionLayerItem: (sectionId: string, kind: 'instruments' | 'voices', item: LayerItem) => void;
  removeSectionLayerItem: (sectionId: string, kind: 'instruments' | 'voices', itemName: string) => void;
  updateSectionLayerItem: (sectionId: string, kind: 'instruments' | 'voices', itemName: string, patch: Partial<LayerItem>) => void;
  copyPaletteToSection: (sectionId: string) => void;
  
  // Layer automation (legacy - for migration)
  setLayerAutomation: (sectionId: string, kind: 'instruments' | 'voices', groupId: string, itemName: string, patch: { level?: number; position?: string }) => void;
  
  // Paint UI
  setPaintUI: (patch: Partial<PaintUI>) => void;
  
  // Dynamic vars
  setDynamicVar: (key: string, value: string | null) => void;
  
  // Layer management
  addLayerGroup: (kind: 'instruments' | 'voices', group: LayerGroup) => void;
  updateLayerItem: (kind: 'instruments' | 'voices', groupId: string, itemIndex: number, patch: Partial<LayerItem>) => void;
  
  // Project persistence
  loadDocument: (doc: Document) => void;
  resetToDefault: () => void;
  getActiveArrangement: () => Section[];
}

function uid(prefix: string = 'id'): string {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1e6)}`;
}

function defaultDocument(): Document {
  return {
    meta: {
      target: 'suno',
      modelVersion: 'v5',
      title: '',
      language: 'English',
      voiceType: 'Adult Male',
    },
    architecture: {
      tempoBpm: 120,
      key: 'C Minor',
      timeSignature: '4/4',
      genreTags: ['Electronic', 'Deep House'],
      subgenre: 'Melodic Deep House',
      microtags: ['sidechain pump', 'warm pads'],
    },
    nuance: {
      mix: ['clean vocals', 'tight low end', 'wide stereo'],
      fx: ['plate reverb', 'sidechain pump'],
      vocalTone: ['intimate', 'warm'],
    },
    activeVariant: 'A',
    arrangementVariants: {
      A: { name: 'Main', enabled: true },
      B: { name: 'Alt', enabled: false },
    },
    lanes: {
      energy: 60,
      density: 55,
      brightness: 50,
      vocalPresence: 65,
    },
    layers: {
      instruments: [
        { id: uid('grp'), name: 'Drums', items: [{ name: 'kick', level: 80, position: 'center' }, { name: 'hi-hats', level: 55, position: 'wide' }] },
        { id: uid('grp'), name: 'Bass', items: [{ name: 'sub bass', level: 75, position: 'center' }] },
        { id: uid('grp'), name: 'Synths', items: [{ name: 'synth pad', level: 60, position: 'wide' }, { name: 'arp synth', level: 50, position: 'center' }] },
      ],
      voices: [
        { id: uid('vgrp'), name: 'Lead Vocal', items: [{ name: 'adult male baritone', level: 75, position: 'front' }] },
      ],
    },
    arrangementTracks: {
      A: [
        { id: uid('sec'), type: 'Intro', label: 'Intro', content: 'pad arpeggio, soft textures', modifiers: ['calm', 'atmospheric'], emphasis: [], tension: 20, bars: 8 },
        { id: uid('sec'), type: 'Verse', label: 'Verse 1', content: 'minimal groove, intimate vocal', modifiers: ['moody', 'intimate'], emphasis: [], tension: 45, bars: 16 },
        { id: uid('sec'), type: 'Pre-Chorus', label: 'Pre-Chorus', content: 'rising tension, filtered builds', modifiers: ['rising tension', 'bright'], emphasis: [], tension: 65, bars: 8 },
        { id: uid('sec'), type: 'Chorus', label: 'Chorus', content: 'full energy, wide synths, anthemic vocal', modifiers: ['anthemic', 'explosive'], emphasis: ['*EXPLOSIVE*'], tension: 90, bars: 16 },
        { id: uid('sec'), type: 'Outro', label: 'Outro', content: 'fade out, echoed vocal', modifiers: ['atmospheric', 'calm'], emphasis: [], tension: 25, bars: 8 },
      ],
      B: [],
    },
    sectionLayerAutomation: {},
    dynamicVars: {},
    lyrics: {
      mode: 'draft',
      text: '',
    },
    ui: {
      paint: {
        enabled: false,
        mode: 'lane',
        laneKey: 'energy',
        kind: 'instruments',
        groupId: '',
        itemName: '',
        snap: true,
      },
    },
  };
}

export const useStore = create<AppState>((set, get) => ({
  currentProjectId: null,
  currentProjectName: 'Untitled Project',
  doc: defaultDocument(),

  setCurrentProject: (id, name) => set({ currentProjectId: id, currentProjectName: name }),

  setDoc: (updater) => set((s) => ({
    doc: typeof updater === 'function' ? updater(s.doc) : updater,
  })),

  setMeta: (patch) => set((s) => ({
    doc: { ...s.doc, meta: { ...s.doc.meta, ...patch } },
  })),

  setArchitecture: (patch) => set((s) => ({
    doc: {
      ...s.doc,
      architecture: {
        ...s.doc.architecture,
        ...patch,
        genreTags: patch.genreTags ? Array.from(new Set(patch.genreTags)).slice(0, 3) : s.doc.architecture.genreTags,
      },
    },
  })),

  setNuance: (patch) => set((s) => ({
    doc: { ...s.doc, nuance: { ...s.doc.nuance, ...patch } },
  })),

  setLanes: (patch) => set((s) => ({
    doc: { ...s.doc, lanes: { ...s.doc.lanes, ...patch } },
  })),

  setLyrics: (text) => set((s) => ({
    doc: { ...s.doc, lyrics: { ...s.doc.lyrics, text } },
  })),

  setActiveVariant: (v) => set((s) => ({
    doc: { ...s.doc, activeVariant: v },
  })),

  toggleVariantEnabled: (v) => set((s) => ({
    doc: {
      ...s.doc,
      arrangementVariants: {
        ...s.doc.arrangementVariants,
        [v]: { ...s.doc.arrangementVariants[v], enabled: !s.doc.arrangementVariants[v].enabled },
      },
    },
  })),

  cloneVariantFromA: () => set((s) => ({
    doc: {
      ...s.doc,
      arrangementTracks: {
        ...s.doc.arrangementTracks,
        B: JSON.parse(JSON.stringify(s.doc.arrangementTracks.A)),
      },
    },
  })),

  addSection: (section) => set((s) => {
    const v = s.doc.activeVariant;
    return {
      doc: {
        ...s.doc,
        arrangementTracks: {
          ...s.doc.arrangementTracks,
          [v]: [...s.doc.arrangementTracks[v], section],
        },
      },
    };
  }),

  updateSection: (id, patch) => set((s) => {
    const v = s.doc.activeVariant;
    return {
      doc: {
        ...s.doc,
        arrangementTracks: {
          ...s.doc.arrangementTracks,
          [v]: s.doc.arrangementTracks[v].map((sec) => (sec.id === id ? { ...sec, ...patch } : sec)),
        },
      },
    };
  }),

  removeSection: (id) => set((s) => {
    const v = s.doc.activeVariant;
    return {
      doc: {
        ...s.doc,
        arrangementTracks: {
          ...s.doc.arrangementTracks,
          [v]: s.doc.arrangementTracks[v].filter((sec) => sec.id !== id),
        },
      },
    };
  }),

  reorderSections: (orderedIds) => set((s) => {
    const v = s.doc.activeVariant;
    const map = new Map(s.doc.arrangementTracks[v].map((sec) => [sec.id, sec]));
    const reordered = orderedIds.map((id) => map.get(id)).filter(Boolean) as Section[];
    return {
      doc: {
        ...s.doc,
        arrangementTracks: {
          ...s.doc.arrangementTracks,
          [v]: reordered,
        },
      },
    };
  }),

  setSectionLaneValue: (sectionId, laneKey, value) => set((s) => {
    const v = s.doc.activeVariant;
    return {
      doc: {
        ...s.doc,
        arrangementTracks: {
          ...s.doc.arrangementTracks,
          [v]: s.doc.arrangementTracks[v].map((sec) => {
            if (sec.id !== sectionId) return sec;
            return { ...sec, lanes: { ...(sec.lanes || s.doc.lanes), [laneKey]: value } };
          }),
        },
      },
    };
  }),

  addSectionLayerItem: (sectionId, kind, item) => set((s) => {
    const v = s.doc.activeVariant;
    return {
      doc: {
        ...s.doc,
        arrangementTracks: {
          ...s.doc.arrangementTracks,
          [v]: s.doc.arrangementTracks[v].map((sec) => {
            if (sec.id !== sectionId) return sec;
            const currentLayers = sec.layers || { instruments: [], voices: [] };
            const currentItems = currentLayers[kind] || [];
            if (currentItems.some(i => i.name === item.name)) return sec;
            return { 
              ...sec, 
              layers: { 
                ...currentLayers, 
                [kind]: [...currentItems, item] 
              } 
            };
          }),
        },
      },
    };
  }),

  removeSectionLayerItem: (sectionId, kind, itemName) => set((s) => {
    const v = s.doc.activeVariant;
    return {
      doc: {
        ...s.doc,
        arrangementTracks: {
          ...s.doc.arrangementTracks,
          [v]: s.doc.arrangementTracks[v].map((sec) => {
            if (sec.id !== sectionId) return sec;
            const currentLayers = sec.layers || { instruments: [], voices: [] };
            return { 
              ...sec, 
              layers: { 
                ...currentLayers, 
                [kind]: (currentLayers[kind] || []).filter(i => i.name !== itemName) 
              } 
            };
          }),
        },
      },
    };
  }),

  updateSectionLayerItem: (sectionId, kind, itemName, patch) => set((s) => {
    const v = s.doc.activeVariant;
    return {
      doc: {
        ...s.doc,
        arrangementTracks: {
          ...s.doc.arrangementTracks,
          [v]: s.doc.arrangementTracks[v].map((sec) => {
            if (sec.id !== sectionId) return sec;
            const currentLayers = sec.layers || { instruments: [], voices: [] };
            return { 
              ...sec, 
              layers: { 
                ...currentLayers, 
                [kind]: (currentLayers[kind] || []).map(i => 
                  i.name === itemName ? { ...i, ...patch } : i
                ) 
              } 
            };
          }),
        },
      },
    };
  }),

  copyPaletteToSection: (sectionId) => set((s) => {
    const v = s.doc.activeVariant;
    const palette = s.doc.layers;
    const instruments = palette.instruments.flatMap(g => g.items);
    const voices = palette.voices.flatMap(g => g.items);
    return {
      doc: {
        ...s.doc,
        arrangementTracks: {
          ...s.doc.arrangementTracks,
          [v]: s.doc.arrangementTracks[v].map((sec) => {
            if (sec.id !== sectionId) return sec;
            return { 
              ...sec, 
              layers: { instruments, voices } 
            };
          }),
        },
      },
    };
  }),

  /** @deprecated Use updateSectionLayerItem instead - per-section layers are now the canonical source */
  setLayerAutomation: (sectionId, kind, groupId, itemName, patch) => set((s) => {
    const sla = { ...s.doc.sectionLayerAutomation };
    const sec = { ...(sla[sectionId] || {}) };
    const kk = { ...(sec[kind] || {}) };
    const key = `${groupId}::${itemName}`;
    kk[key] = { ...(kk[key] || {}), ...patch };
    sec[kind] = kk;
    sla[sectionId] = sec;
    return { doc: { ...s.doc, sectionLayerAutomation: sla } };
  }),

  setPaintUI: (patch) => set((s) => ({
    doc: { ...s.doc, ui: { ...s.doc.ui, paint: { ...s.doc.ui.paint, ...patch } } },
  })),

  setDynamicVar: (key, value) => set((s) => {
    const dv = { ...s.doc.dynamicVars };
    if (value === null || value === undefined || String(value).trim() === '') {
      delete dv[key];
    } else {
      dv[key] = String(value);
    }
    return { doc: { ...s.doc, dynamicVars: dv } };
  }),

  addLayerGroup: (kind, group) => set((s) => ({
    doc: {
      ...s.doc,
      layers: {
        ...s.doc.layers,
        [kind]: [...s.doc.layers[kind], group],
      },
    },
  })),

  updateLayerItem: (kind, groupId, itemIndex, patch) => set((s) => ({
    doc: {
      ...s.doc,
      layers: {
        ...s.doc.layers,
        [kind]: s.doc.layers[kind].map((g) => {
          if (g.id !== groupId) return g;
          return {
            ...g,
            items: g.items.map((item, idx) => (idx === itemIndex ? { ...item, ...patch } : item)),
          };
        }),
      },
    },
  })),

  loadDocument: (doc) => set({ doc }),

  resetToDefault: () => set({
    currentProjectId: null,
    currentProjectName: 'Untitled Project',
    doc: defaultDocument(),
  }),

  getActiveArrangement: () => {
    const s = get();
    return s.doc.arrangementTracks[s.doc.activeVariant];
  },
}));

export { uid };
