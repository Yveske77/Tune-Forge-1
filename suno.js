const joinClean = (arr, sep = ", ") =>
  (arr || []).map(s => String(s).trim()).filter(Boolean).join(sep)

const bracket = (s) => `[${s}]`
const parens = (s) => (s ? `(${s})` : "")
const normalizeSpace = (s) => String(s || "").replace(/\s+/g, " ").trim()

function buildHeader(doc){
  const a = doc.architecture || {}
  const m = doc.meta || {}
  const tags = []

  if (m.modelVersion) tags.push(bracket(`MODEL: ${m.modelVersion}`))
  if (a.tempoBpm) tags.push(bracket(`Tempo: ${a.tempoBpm} BPM`))
  if (a.key) tags.push(bracket(`Key: ${a.key}`))
  if (a.timeSignature) tags.push(bracket(`Time: ${a.timeSignature}`))

  const genres = joinClean(a.genreTags)
  if (genres) tags.push(bracket(`Genres: ${genres}`))

  if (m.language) tags.push(bracket(`Language: ${m.language}`))
  if (m.voiceType) tags.push(bracket(`Voice: ${m.voiceType}`))
  if (m.title) tags.push(bracket(`Title: ${m.title}`))

  return tags.join(" ")
}

function buildGlobalNuance(doc){
  const n = doc.nuance || {}
  const mix = joinClean(n.mix)
  const fx = joinClean(n.fx)
  const vocal = joinClean(n.vocalTone)

  const chunks = []
  if (mix) chunks.push(`mix: ${mix}`)
  if (fx) chunks.push(`fx: ${fx}`)
  if (vocal) chunks.push(`vocal: ${vocal}`)
  return chunks.length ? parens(chunks.join("; ")) : ""
}

function buildLayers(doc){
  const layers = doc.layers || {}
  const inst = (layers.instruments||[]).flatMap(g => (g.items||[]).map(it => it.name))
  const voc = (layers.voices||[]).flatMap(g => (g.items||[]).map(it => it.name))
  const uniq = (arr) => Array.from(new Set(arr.map(s=>String(s).trim()).filter(Boolean)))
  const instStr = uniq(inst).slice(0, 12).join(", ")
  const vocStr = uniq(voc).slice(0, 8).join(", ")
  const tags = []
  if(instStr) tags.push(bracket(`Instruments: ${instStr}`))
  if(vocStr) tags.push(bracket(`Voices: ${vocStr}`))
  return tags.join(" ")
}

function buildLaneHints(doc){
  const lanes = doc.lanes || {}
  const parts = []
  if(typeof lanes.energy === "number") parts.push(`energy ${lanes.energy}`)
  if(typeof lanes.density === "number") parts.push(`density ${lanes.density}`)
  if(typeof lanes.brightness === "number") parts.push(`brightness ${lanes.brightness}`)
  if(typeof lanes.vocalPresence === "number") parts.push(`vocal ${lanes.vocalPresence}`)
  return parts.length ? bracket(`Arc: ${parts.join(", ")}`) : ""
}

function buildSectionLayerHints(doc, sec){
  const sla = doc.sectionLayerAutomation || {}
  const entry = sla[sec.id] || {}
  const pick = (kind) => {
    const kk = entry[kind] || {}
    const items = Object.keys(kk).map(k => {
      const v = kk[k] || {}
      const nm = k.split("::").slice(1).join("::")
      return { name: nm, level: typeof v.level === "number" ? v.level : 0, position: v.position }
    }).filter(x => x.level > 0)
    items.sort((a,b)=>b.level-a.level)
    return items.slice(0, 4)
  }
  const inst = pick("instruments")
  const voc = pick("voices")
  const bits = []
  if(voc.length){
    const vtxt = voc.map(v => v.position ? `${v.name} ${v.position}` : v.name).join(", ")
    bits.push(`voices: ${vtxt}`)
  }
  if(inst.length){
    const itxt = inst.map(i => i.position ? `${i.name} ${i.position}` : i.name).join(", ")
    bits.push(`instruments: ${itxt}`)
  }
  return bits.length ? paren(bits.join(" | ")) : ""
}

function buildArrangement(doc){
  const arr = doc.arrangement || []
  return arr.map(sec => {
    const label = normalizeSpace(sec.label || sec.type || "Section")
    const content = normalizeSpace(sec.content || "")
    const mods = joinClean(sec.modifiers)
    const emph = joinClean(sec.emphasis, " ")

    const head = content ? `${label}: ${content}` : `${label}`
    const tag = bracket(head)
    const modStr = mods ? ` ${parens(mods)}` : ""
    const emphStr = emph ? ` ${emph}` : ""
    return `${tag}${modStr}${emphStr}`.trim()
  }).join(" ")
}

function buildDynamicVars(doc){
  const vars = doc.dynamicVars || {}
  const keys = Object.keys(vars || {})
  if (!keys.length) return ""

  const payload = keys
    .map(k => `${k}=${String(vars[k]).trim()}`)
    .filter(Boolean)
    .join(", ")

  return payload ? ` ${bracket(`Vars: {${payload}}`)}` : ""
}

export function compileToSuno(doc){
  const header = buildHeader(doc)
  const globalNuance = buildGlobalNuance(doc)
  const laneHints = buildLaneHints(doc)
  const layers = buildLayers(doc)
  const arrangement = buildArrangement(doc)
  const dyn = buildDynamicVars(doc)

  return normalizeSpace([header, laneHints, layers, globalNuance, arrangement, dyn].filter(Boolean).join(" "))
}
