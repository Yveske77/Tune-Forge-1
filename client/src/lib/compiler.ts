import type { Document } from './store';

const joinClean = (arr: string[] | undefined, sep = ', '): string =>
  (arr || []).map((s) => String(s).trim()).filter(Boolean).join(sep);

const bracket = (s: string): string => `[${s}]`;
const parens = (s: string): string => (s ? `(${s})` : '');
const normalizeSpace = (s: string): string => String(s || '').replace(/\s+/g, ' ').trim();

function buildHeader(doc: Document): string {
  const a = doc.architecture;
  const m = doc.meta;
  const tags: string[] = [];

  if (m.modelVersion) tags.push(bracket(`MODEL: ${m.modelVersion}`));
  if (a.tempoBpm) tags.push(bracket(`Tempo: ${a.tempoBpm} BPM`));
  if (a.key) tags.push(bracket(`Key: ${a.key}`));
  if (a.timeSignature) tags.push(bracket(`Time: ${a.timeSignature}`));

  const genres = joinClean(a.genreTags);
  if (genres) tags.push(bracket(`Genres: ${genres}`));
  
  if (a.subgenre) tags.push(bracket(`Subgenre: ${a.subgenre}`));
  
  const microtags = joinClean(a.microtags);
  if (microtags) tags.push(parens(microtags));

  if (m.language) tags.push(bracket(`Language: ${m.language}`));
  if (m.voiceType) tags.push(bracket(`Voice: ${m.voiceType}`));
  if (m.title) tags.push(bracket(`Title: ${m.title}`));

  return tags.join(' ');
}

function buildGlobalNuance(doc: Document): string {
  const n = doc.nuance;
  const mix = joinClean(n.mix);
  const fx = joinClean(n.fx);
  const vocal = joinClean(n.vocalTone);

  const chunks: string[] = [];
  if (mix) chunks.push(`mix: ${mix}`);
  if (fx) chunks.push(`fx: ${fx}`);
  if (vocal) chunks.push(`vocal: ${vocal}`);
  return chunks.length ? parens(chunks.join('; ')) : '';
}

function buildLayers(doc: Document): string {
  const layers = doc.layers;
  const inst = (layers.instruments || []).flatMap((g) => (g.items || []).map((it) => it.name));
  const voc = (layers.voices || []).flatMap((g) => (g.items || []).map((it) => it.name));
  const uniq = (arr: string[]): string[] => Array.from(new Set(arr.map((s) => String(s).trim()).filter(Boolean)));
  const instStr = uniq(inst).slice(0, 12).join(', ');
  const vocStr = uniq(voc).slice(0, 8).join(', ');
  const tags: string[] = [];
  if (instStr) tags.push(bracket(`Instruments: ${instStr}`));
  if (vocStr) tags.push(bracket(`Voices: ${vocStr}`));
  return tags.join(' ');
}

function buildLaneHints(doc: Document): string {
  const lanes = doc.lanes;
  const parts: string[] = [];
  if (typeof lanes.energy === 'number') parts.push(`energy ${lanes.energy}`);
  if (typeof lanes.density === 'number') parts.push(`density ${lanes.density}`);
  if (typeof lanes.brightness === 'number') parts.push(`brightness ${lanes.brightness}`);
  if (typeof lanes.vocalPresence === 'number') parts.push(`vocal ${lanes.vocalPresence}`);
  return parts.length ? bracket(`Arc: ${parts.join(', ')}`) : '';
}

function buildSectionLayerHints(doc: Document, secId: string): string {
  const sla = doc.sectionLayerAutomation || {};
  const entry = sla[secId] || {};
  const layers = doc.layers;
  
  const pick = (kind: 'instruments' | 'voices') => {
    const groups = kind === 'instruments' ? layers.instruments : layers.voices;
    const kk = entry[kind] || {};
    
    // Collect all items with their effective levels (automation override or default)
    const allItems: { name: string; level: number; position?: string }[] = [];
    
    for (const group of groups || []) {
      for (const item of group.items || []) {
        const key = `${group.id}::${item.name}`;
        const automation = kk[key];
        
        // Use automation level if set, otherwise use default from layer definition
        const level = automation?.level !== undefined ? automation.level : (item.level || 0);
        const position = automation?.position;
        
        if (level > 0) {
          allItems.push({ name: item.name, level, position });
        }
      }
    }
    
    // Sort by level descending and take top items
    allItems.sort((a, b) => b.level - a.level);
    return allItems.slice(0, 4);
  };
  
  const inst = pick('instruments');
  const voc = pick('voices');
  const bits: string[] = [];
  
  if (voc.length) {
    const vtxt = voc.map((v) => (v.position ? `${v.name} ${v.position}` : v.name)).join(', ');
    bits.push(`voices: ${vtxt}`);
  }
  if (inst.length) {
    const itxt = inst.map((i) => (i.position ? `${i.name} ${i.position}` : i.name)).join(', ');
    bits.push(`instruments: ${itxt}`);
  }
  return bits.length ? parens(bits.join(' | ')) : '';
}

function buildArrangement(doc: Document): string {
  const arr = doc.arrangementTracks[doc.activeVariant] || [];
  return arr.map((sec) => {
    const label = normalizeSpace(sec.label || sec.type || 'Section');
    const content = normalizeSpace(sec.content || '');
    const mods = joinClean(sec.modifiers);
    const emph = joinClean(sec.emphasis, ' ');
    const layerHints = buildSectionLayerHints(doc, sec.id);

    const head = content ? `${label}: ${content}` : `${label}`;
    const tag = bracket(head);
    const modStr = mods ? ` ${parens(mods)}` : '';
    const emphStr = emph ? ` ${emph}` : '';
    const layerStr = layerHints ? ` ${layerHints}` : '';
    return `${tag}${modStr}${emphStr}${layerStr}`.trim();
  }).join(' ');
}

function buildDynamicVars(doc: Document): string {
  const vars = doc.dynamicVars || {};
  const keys = Object.keys(vars);
  if (!keys.length) return '';

  const payload = keys
    .map((k) => `${k}=${String(vars[k]).trim()}`)
    .filter(Boolean)
    .join(', ');

  return payload ? ` ${bracket(`Vars: {${payload}}`)}` : '';
}

export function compileToSuno(doc: Document): string {
  const header = buildHeader(doc);
  const globalNuance = buildGlobalNuance(doc);
  const laneHints = buildLaneHints(doc);
  const layers = buildLayers(doc);
  const arrangement = buildArrangement(doc);
  const dyn = buildDynamicVars(doc);

  return normalizeSpace([header, laneHints, layers, globalNuance, arrangement, dyn].filter(Boolean).join(' '));
}

export function getLyricsText(doc: Document): string {
  return (doc.lyrics?.text || '').trim() || '(no lyrics provided)';
}
