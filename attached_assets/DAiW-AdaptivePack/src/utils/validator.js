const hasPromptSyntax = (s) => /\[[^\]]+\]|\([^\)]+\)|\{[^\}]+\}/.test(String(s||""))

const setHas = (arr, needle) => (arr||[]).some(x => String(x).toLowerCase().includes(String(needle).toLowerCase()))

// Very simple genre "families" to warn about extreme blends.
const GENRE_FAMILY = [
  {name:"Classical/Cinematic", keys:["classical","orchestral","cinematic","film score","opera","baroque","chamber","choral"]},
  {name:"Hip-Hop", keys:["hip-hop","rap","trap","drill","boom bap","g-funk"]},
  {name:"Electronic/EDM", keys:["edm","house","techno","trance","dubstep","drum & bass","dnb","hardstyle","electro"]},
  {name:"Rock/Metal", keys:["rock","metal","punk","shoegaze","hard rock","djent","metalcore"]},
  {name:"Acoustic/Folk/Country", keys:["folk","country","americana","bluegrass","singer-songwriter","acoustic"]},
  {name:"Latin/Afro/World", keys:["latin","reggaeton","salsa","bossa","afro","afrobeats","amapiano","world","middle eastern","bollywood"]},
  {name:"Lo-Fi/Ambient", keys:["lo-fi","ambient","downtempo","chillwave","vaporwave","trip-hop","drone","soundscape"]}
]

function detectFamilies(genres){
  const hits = new Set()
  for(const g of (genres||[])){
    const gl = String(g).toLowerCase()
    for(const fam of GENRE_FAMILY){
      if(fam.keys.some(k => gl.includes(k))) hits.add(fam.name)
    }
  }
  return Array.from(hits)
}

export function validateDoc(doc){
  const issues = []
  const a = doc.architecture || {}
  const m = doc.meta || {}
  const n = doc.nuance || {}
  const arr = doc.arrangement || []

  // Genres max 3
  const g = (a.genreTags || []).length
  if(g === 0) issues.push({level:"warn", code:"NO_GENRES", message:"Pick at least one genre/vibe."})
  if(g > 3) issues.push({level:"error", code:"TOO_MANY_GENRES", message:"Genres exceed max 3 (UI should enforce)."})
  if(g === 3) issues.push({level:"info", code:"MAX_GENRES", message:"Using 3 genres — keep it coherent."})

  // Genre coherence (soft warning)
  const fams = detectFamilies(a.genreTags||[])
  if(fams.length >= 3){
    issues.push({level:"warn", code:"GENRE_SPREAD", message:`Your genres span many families (${fams.join(", ")}). This can work, but expect muddy results unless you specify a clear anchor.`})
  }

  // Arrangement required
  if(arr.length === 0) issues.push({level:"error", code:"NO_ARRANGEMENT", message:"Add at least one section in Arrangement."})

  // Basic hard params
  if(a.tempoBpm && (a.tempoBpm < 40 || a.tempoBpm > 220)) issues.push({level:"warn", code:"TEMPO_RANGE", message:"Tempo looks unusual (outside 40–220 BPM)."})
  if(m.title && m.title.length > 80) issues.push({level:"warn", code:"TITLE_LONG", message:"Title is very long; consider shortening."})

  // Prevent raw syntax in fields
  const checkFields = [
    ["arrangement.content", arr.map(s=>s.content).join("\n")],
    ["arrangement.label", arr.map(s=>s.label).join("\n")],
    ["meta.title", m.title],
  ]
  for(const [name, val] of checkFields){
    if(hasPromptSyntax(val)){
      issues.push({level:"warn", code:"RAW_SYNTAX_IN_FIELD", message:`Detected bracket/paren/brace syntax inside ${name}. Keep raw syntax in Preview only.`})
      break
    }
  }

  // Compatibility warnings (nuance)
  const fx = n.fx || []
  const mix = n.mix || []
  const vocal = n.vocalTone || []

  if(setHas(mix,"crystal clear") && (setHas(fx,"vinyl") || setHas(mix,"lo-fi") )){
    issues.push({level:"warn", code:"CLARITY_CONFLICT", message:"You selected both 'crystal clear' and lo-fi/vinyl noise. If that’s intentional, great — otherwise pick one sonic direction."})
  }
  if(setHas(mix,"radio compressed") && setHas(fx,"huge reverb")){
    issues.push({level:"info", code:"MIX_FX_TENSION", message:"Radio compression + huge reverb can smear vocals. Works for vibe, but watch intelligibility."})
  }
  if(setHas(vocal,"whispered") && setHas(mix,"club-ready")){
    issues.push({level:"info", code:"VOCAL_MIX_TENSION", message:"Whispered vocals + club-ready mix can get buried. Consider 'dry upfront vocal' or reduce density in verses."})
  }

  // Curly brace usage logging hint
  const dv = doc.dynamicVars || {}
  if(Object.keys(dv).length){
    issues.push({level:"info", code:"DYNAMIC_VARS", message:"Dynamic vars present: curly braces are placeholders; weighting semantics may change in future models."})
  }

  // Nuance emptiness
  if(!(mix||[]).length && !(fx||[]).length && !(vocal||[]).length){
    issues.push({level:"info", code:"NO_NUANCE", message:"No nuance modifiers selected — prompt will be more generic."})
  }

  return issues
}

export function computeLengths(doc, compiledPrompt, lyricsText){
  const styleLen = (compiledPrompt || "").length
  const lyricsLen = (lyricsText || "").length
  const within = styleLen <= 4500 && lyricsLen <= 5000
  return { styleLen, lyricsLen, within }
}
