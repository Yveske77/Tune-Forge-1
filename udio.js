const joinClean = (arr, sep = ", ") =>
  (arr || []).map(s => String(s).trim()).filter(Boolean).join(sep)

const normalize = (s) => String(s||"").replace(/\s+/g," ").trim()

/**
 * Udio-style output: more natural-language, fewer explicit bracket tags.
 * Still includes section labels as plain headings.
 */
export function compileToUdio(doc){
  const a = doc.architecture || {}
  const m = doc.meta || {}
  const n = doc.nuance || {}
  const arr = doc.arrangement || []

  const headerBits = []
  if(a.genreTags?.length) headerBits.push(`Genres: ${joinClean(a.genreTags)}`)
  if(a.tempoBpm) headerBits.push(`Tempo: ${a.tempoBpm} BPM`)
  if(a.key) headerBits.push(`Key: ${a.key}`)
  if(a.timeSignature) headerBits.push(`Time: ${a.timeSignature}`)
  if(m.language) headerBits.push(`Language: ${m.language}`)
  if(m.voiceType) headerBits.push(`Voice: ${m.voiceType}`)
  if(m.title) headerBits.push(`Title: ${m.title}`)

  const nuanceBits = []
  if(n.mix?.length) nuanceBits.push(`Mix: ${joinClean(n.mix)}`)
  if(n.fx?.length) nuanceBits.push(`FX: ${joinClean(n.fx)}`)
  if(n.vocalTone?.length) nuanceBits.push(`Vocal tone: ${joinClean(n.vocalTone)}`)

  const sections = arr.map(sec => {
    const label = normalize(sec.label || sec.type || "Section")
    const content = normalize(sec.content || "")
    const mods = joinClean(sec.modifiers)
    const emph = joinClean(sec.emphasis, " ")
    const line = [content, mods ? `(${mods})` : "", emph].filter(Boolean).join(" ")
    return `${label}: ${line}`.trim()
  }).join("\n")

  return normalize([
    headerBits.length ? headerBits.join(" · ") : "",
    nuanceBits.length ? nuanceBits.join(" · ") : "",
    sections
  ].filter(Boolean).join("\n\n"))
}
