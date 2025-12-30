import { create } from 'zustand'
import { loadJSON, saveJSON } from './utils/storage'
import { uid } from './utils/id'

const LS_PROFILE = "suno_prompt_profile_v1"
const LS_HISTORY = "suno_prompt_history_v1"
const LS_DOC = "suno_prompt_doc_v1"

const HISTORY_LIMIT = 5

function normalizeDoc(doc){
  // Migration: if arrangementTracks missing, create and put current arrangement into A.
  const hasTracks = doc && doc.arrangementTracks && typeof doc.arrangementTracks === "object"
  if(!hasTracks){
    const arr = Array.isArray(doc?.arrangement) ? doc.arrangement : []
    doc = { ...doc, arrangementTracks: { A: arr, B: [] }, activeVariant: doc.activeVariant || "A" }
  }
  // Ensure A exists
  const tracks = { A: [], B: [], ...(doc.arrangementTracks||{}) }
  // If A empty but legacy arrangement exists, seed it
  if((tracks.A||[]).length === 0 && Array.isArray(doc.arrangement) && doc.arrangement.length){
    tracks.A = doc.arrangement
  }
  return { ...doc, arrangementTracks: tracks, activeVariant: doc.activeVariant || "A" }
}

function defaultDoc(){
  return {
    meta: {
      target: "suno",
      modelVersion: "v5",
      title: "",
      language: "French",
      voiceType: "Adult Male",
    },
    architecture: {
      tempoBpm: 120,
      key: "C Minor",
      timeSignature: "4/4",
      genreTags: ["Romantic"],
      structureDefaults: {
        globalInstruments: ["drums","bass","pads"],
        globalVocal: "gritty baritone",
      }
    },
    nuance: {
      mix: ["clean vocals","tight low end"],
      fx: ["plate reverb","sidechain pump"],
      vocalTone: ["intimate","whispered"],
    },
    activeVariant: "A",
    arrangementVariants: {
      A: { name: "Main", enabled: true },
      B: { name: "Alt", enabled: false }
    },
    ui: { paint: { enabled: false, mode: 'lane', laneKey: 'energy', kind: 'instruments', groupId: '', itemName: '', snap: true } },
    lanes: {
      energy: 60,
      density: 55,
      brightness: 50,
      vocalPresence: 65
    },
    sectionLayerAutomation: {},
    layers: {
      instruments: [
        { id: uid("grp"), name: "Drums", items: [{name:"kick", level:80, position:"center"}, {name:"hi-hats", level:55, position:"wide"}] },
        { id: uid("grp"), name: "Bass", items: [{name:"sub bass", level:75, position:"center"}] },
      ],
      voices: [
        { id: uid("vgrp"), name: "Lead Vocal", items: [{name:"adult male baritone", level:75, position:"front"}] }
      ]
    },
    arrangementTracks: {
      A: [],
      B: []
    },
    arrangement: [
      {
        id: uid("sec"),
        type: "Intro",
        label: "Intro",
        content: "pad arpeggio, soft piano",
        modifiers: ["calm","atmospheric"],
        emphasis: [],
        tension: 20,
      },
      {
        id: uid("sec"),
        type: "Verse",
        label: "Verse 1",
        content: "minimal piano, intimate vocal",
        modifiers: ["moody","brooding"],
        emphasis: [],
        tension: 45,
      },
      {
        id: uid("sec"),
        type: "Chorus",
        label: "Chorus",
        content: "anthemic vocal, wide synths",
        modifiers: ["bright","driving"],
        emphasis: ["*EXPLOSIVE*"],
        tension: 85,
      },
    ],
    dynamicVars: {},
    lyrics: {
      mode: "draft",
      text: ""
    }
  }
}

function clampGenres(genres){
  const uniq = Array.from(new Set((genres||[]).map(g=>String(g).trim()).filter(Boolean)))
  return uniq.slice(0,3)
}

export const usePromptStore = create((set, get) => ({
  // transient UI preview state (never persisted)
  preview: { active:false, block:null, hoverIndex:null, mode:null, computed:null, cursor:null },

  getActiveArrangement: () => {
    const d = get().doc
    const v = d.activeVariant || "A"
    return (d.arrangementTracks?.[v] || d.arrangement || [])
  },

  doc: loadJSON(LS_DOC, defaultDoc()),

  setDoc: (updater) => set((s) => {
    const next = typeof updater === "function" ? updater(s.doc) : updater
    saveJSON(LS_DOC, next)
    return { doc: next }
  }),

  setMeta: (patch) => get().setDoc(doc => ({...doc, meta: {...doc.meta, ...patch}})),



  insertSectionAtIndexActiveVariant: (index, section) => set(state => {
    const doc = normalizeDoc(state.doc)
    const v = doc.activeVariant || "A"
    const tracks = { ...(doc.arrangementTracks||{}) }
    const arr = [ ...(tracks[v]||[]) ]
    const i = Math.max(0, Math.min(arr.length, Number(index ?? arr.length)))
    arr.splice(i, 0, section)
    tracks[v] = arr
    const next = { ...doc, arrangementTracks: tracks, arrangement: arr }
    persist(next)
    return { ...state, doc: next }
  }),
  replaceSectionAtIndexActiveVariant: (index, section) => set(state => {
    const doc = normalizeDoc(state.doc)
    const v = doc.activeVariant || "A"
    const tracks = { ...(doc.arrangementTracks||{}) }
    const arr = [ ...(tracks[v]||[]) ]
    const i = Math.max(0, Math.min(arr.length-1, Number(index ?? 0)))
    if(arr.length === 0){
      arr.push(section)
    } else {
      arr[i] = section
    }
    tracks[v] = arr
    const next = { ...doc, arrangementTracks: tracks, arrangement: arr }
    persist(next)
    return { ...state, doc: next }
  }),

  startBlockPreview: (block) => set(state => ({
    ...state,
    preview: { active:true, block, hoverIndex:null, mode:null, computed:null, cursor:null }
  })),
  updateBlockPreview: (hoverIndex, mode, computed) => set(state => ({
    ...state,
    preview: { ...(state.preview||{}), active:true, hoverIndex, mode, computed, cursor: computed?.cursor ?? state.preview?.cursor ?? null }
  })),
  cancelBlockPreview: () => set(state => ({ ...state, preview: { active:false, block:null, hoverIndex:null, mode:null, computed:null, cursor:null } })),
  setLayerAutomation: (sectionId, kind, groupId, itemName, patch) => set(state => {
    const doc = normalizeDoc(state.doc)
    const sla = { ...(doc.sectionLayerAutomation || {}) }
    const sec = { ...(sla[sectionId] || {}) }
    const kk = { ...(sec[kind] || {}) } // kind: instruments|voices
    const key = `${groupId}::${itemName}`
    kk[key] = { ...(kk[key] || {}), ...patch }
    sec[kind] = kk
    sla[sectionId] = sec
    const next = { ...doc, sectionLayerAutomation: sla }
    persist(next)
    return { ...state, doc: next }
  }),
  clearLayerAutomationForSection: (sectionId) => set(state => {
    const doc = normalizeDoc(state.doc)
    const sla = { ...(doc.sectionLayerAutomation || {}) }
    delete sla[sectionId]
    const next = { ...doc, sectionLayerAutomation: sla }
    persist(next)
    return { ...state, doc: next }
  }),
  setActiveVariant: (variantKey) => set(state => {
    const doc = normalizeDoc(state.doc)
    const v = (variantKey === "B" ? "B" : "A")
    const next = { ...doc, activeVariant: v }
    persist(next)
    return { ...state, doc: next }
  }),
  toggleVariantEnabled: (variantKey) => set(state => {
    const doc = normalizeDoc(state.doc)
    const v = (variantKey === "B" ? "B" : "A")
    const cur = doc.arrangementVariants?.[v]?.enabled ?? (v==="A")
    const next = {
      ...doc,
      arrangementVariants: {
        ...(doc.arrangementVariants||{}),
        [v]: { ...(doc.arrangementVariants?.[v]||{}), enabled: !cur }
      }
    }
    persist(next)
    return { ...state, doc: next }
  }),
  cloneVariantFromA: () => set(state => {
    const doc = normalizeDoc(state.doc)
    const a = doc.arrangementTracks?.A || []
    const next = {
      ...doc,
      arrangementTracks: { ...(doc.arrangementTracks||{}), B: JSON.parse(JSON.stringify(a)) }
    }
    persist(next)
    return { ...state, doc: next }
  }),
  addSectionToActiveVariant: (section) => set(state => {
    const doc = normalizeDoc(state.doc)
    const v = doc.activeVariant || "A"
    const tracks = { ...(doc.arrangementTracks||{}) }
    tracks[v] = [ ...(tracks[v]||[]), section ]
    const next = { ...doc, arrangementTracks: tracks, arrangement: tracks[v] }
    persist(next)
    return { ...state, doc: next }
  }),

  setSectionLaneValue: (sectionId, laneKey, value) => set(state => {
    const doc = normalizeDoc(state.doc)
    const v = doc.activeVariant || "A"
    const tracks = { ...(doc.arrangementTracks||{}) }
    tracks[v] = (tracks[v]||[]).map(s => {
      if(s.id !== sectionId) return s
      const lanes = { ...(s.lanes || {}) }
      lanes[laneKey] = value
      return { ...s, lanes }
    })
    const next = { ...doc, arrangementTracks: tracks, arrangement: tracks[v] }
    persist(next)
    return { ...state, doc: next }
  }),
  setPaintUI: (patch) => set(state => {
    const doc = normalizeDoc(state.doc)
    const ui = { ...(doc.ui||{}), paint: { ...(doc.ui?.paint||{}), ...(patch||{}) } }
    const next = { ...doc, ui }
    persist(next)
    return { ...state, doc: next }
  }),
  updateSectionInActiveVariant: (id, patch) => set(state => {
    const doc = normalizeDoc(state.doc)
    const v = doc.activeVariant || "A"
    const tracks = { ...(doc.arrangementTracks||{}) }
    tracks[v] = (tracks[v]||[]).map(s => s.id === id ? { ...s, ...patch } : s)
    const next = { ...doc, arrangementTracks: tracks, arrangement: tracks[v] }
    persist(next)
    return { ...state, doc: next }
  }),
  removeSectionFromActiveVariant: (id) => set(state => {
    const doc = normalizeDoc(state.doc)
    const v = doc.activeVariant || "A"
    const tracks = { ...(doc.arrangementTracks||{}) }
    tracks[v] = (tracks[v]||[]).filter(s => s.id !== id)
    const next = { ...doc, arrangementTracks: tracks, arrangement: tracks[v] }
    persist(next)
    return { ...state, doc: next }
  }),
  reorderActiveVariant: (orderIds) => set(state => {
    const doc = normalizeDoc(state.doc)
    const v = doc.activeVariant || "A"
    const tracks = { ...(doc.arrangementTracks||{}) }
    const map = new Map((tracks[v]||[]).map(s => [s.id, s]))
    tracks[v] = orderIds.map(id => map.get(id)).filter(Boolean)
    const next = { ...doc, arrangementTracks: tracks, arrangement: tracks[v] }
    persist(next)
    return { ...state, doc: next }
  }),
  setArchitecture: (patch) => get().setDoc(doc => {
    const next = {...doc, architecture: {...doc.architecture, ...patch}}
    if(patch.genreTags) next.architecture.genreTags = clampGenres(patch.genreTags)
    return next
  }),
  setNuance: (patch) => get().setDoc(doc => ({...doc, nuance: {...doc.nuance, ...patch}})),
  setLyrics: (text) => get().setDoc(doc => ({...doc, lyrics: {...doc.lyrics, text}})),

  addSection: (section) => get().setDoc(doc => ({...doc, arrangement: [...doc.arrangement, section]})),
  updateSection: (id, patch) => get().setDoc(doc => ({
    ...doc,
    arrangement: doc.arrangement.map(s => s.id === id ? {...s, ...patch} : s)
  })),
  removeSection: (id) => get().setDoc(doc => ({
    ...doc,
    arrangement: doc.arrangement.filter(s => s.id !== id)
  })),
  reorderSections: (orderedIds) => get().setDoc(doc => {
    const map = new Map(doc.arrangement.map(s => [s.id, s]))
    const next = orderedIds.map(id => map.get(id)).filter(Boolean)
    return {...doc, arrangement: next}
  }),

  setDynamicVar: (key, value) => get().setDoc(doc => {
    const dv = {...(doc.dynamicVars||{})}
    if(value === null || value === undefined || String(value).trim() === "") delete dv[key]
    else dv[key] = String(value)
    return {...doc, dynamicVars: dv}
  }),

  saveProfile: () => saveJSON(LS_PROFILE, get().doc),
  loadProfile: () => {
    const prof = loadJSON(LS_PROFILE, null)
    if(prof) get().setDoc(prof)
  },
  getProfile: () => loadJSON(LS_PROFILE, null),

  pushHistory: (item) => {
    const hist = loadJSON(LS_HISTORY, [])
    const next = [item, ...hist].slice(0, HISTORY_LIMIT)
    saveJSON(LS_HISTORY, next)
    return next
  },
  getHistory: () => loadJSON(LS_HISTORY, []),
  clearHistory: () => saveJSON(LS_HISTORY, []),

  exportProject: () => get().doc,
  importProject: (payload) => {
    if(payload && typeof payload === "object" && payload.meta && payload.architecture){
      get().setDoc(payload)
      return true
    }
    return false
  },
}))

export const HISTORY_LIMIT = HISTORY_LIMIT
