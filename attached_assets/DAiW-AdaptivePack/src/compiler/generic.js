const joinClean = (arr, sep = ", ") =>
  (arr || []).map(s => String(s).trim()).filter(Boolean).join(sep)

const normalize = (s) => String(s||"").replace(/\s+/g," ").trim()

/**
 * Generic LLM prompt: explains the hierarchy and provides the compiled intent.
 */
export function compileToGenericLLM(doc){
  const a = doc.architecture || {}
  const m = doc.meta || {}
  const n = doc.nuance || {}
  const arr = doc.arrangement || []
  const dv = doc.dynamicVars || {}

  const lines = []
  lines.push("Create a song following this structured brief. Keep it coherent and musical.")
  lines.push("")
  lines.push("Hard parameters:")
  if(a.genreTags?.length) lines.push(`- Genres/vibe: ${joinClean(a.genreTags)}`)
  if(a.tempoBpm) lines.push(`- Tempo: ${a.tempoBpm} BPM`)
  if(a.key) lines.push(`- Key: ${a.key}`)
  if(a.timeSignature) lines.push(`- Time signature: ${a.timeSignature}`)
  if(m.language) lines.push(`- Language: ${m.language}`)
  if(m.voiceType) lines.push(`- Voice: ${m.voiceType}`)
  if(m.title) lines.push(`- Title: ${m.title}`)

  lines.push("")
  lines.push("Production & nuance:")
  if(n.vocalTone?.length) lines.push(`- Vocal tone: ${joinClean(n.vocalTone)}`)
  if(n.mix?.length) lines.push(`- Mix: ${joinClean(n.mix)}`)
  if(n.fx?.length) lines.push(`- FX: ${joinClean(n.fx)}`)

  lines.push("")
  lines.push("Arrangement (in order):")
  arr.forEach((sec, i) => {
    const label = normalize(sec.label || sec.type || `Section ${i+1}`)
    const content = normalize(sec.content || "")
    const mods = joinClean(sec.modifiers)
    const emph = joinClean(sec.emphasis, " ")
    lines.push(`- ${label}${content ? `: ${content}` : ""}${mods ? ` | modifiers: ${mods}` : ""}${emph ? ` | emphasis: ${emph}` : ""}`)
  })

  const dvKeys = Object.keys(dv||{})
  if(dvKeys.length){
    lines.push("")
    lines.push("Dynamic variables (placeholders):")
    dvKeys.forEach(k => lines.push(`- ${k}: ${String(dv[k])}`))
  }

  return lines.join("\n")
}
