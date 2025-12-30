import React, { useMemo } from 'react'
import { usePromptStore, HISTORY_LIMIT } from '../store'
import { compileToSuno } from '../compiler/suno'
import { compileToUdio } from '../compiler/udio'
import { compileToGenericLLM } from '../compiler/generic'

function downloadText(filename, text){
  const blob = new Blob([text], {type:"text/plain;charset=utf-8"})
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url; a.download = filename
  document.body.appendChild(a); a.click(); a.remove()
  URL.revokeObjectURL(url)
}
function downloadJSON(filename, obj){
  const blob = new Blob([JSON.stringify(obj, null, 2)], {type:"application/json"})
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url; a.download = filename
  document.body.appendChild(a); a.click(); a.remove()
  URL.revokeObjectURL(url)
}

export default function ExportPanel({ compiledPrompt, lyrics, toast }){
  const doc = usePromptStore(s => s.doc)
  const saveProfile = usePromptStore(s => s.saveProfile)
  const loadProfile = usePromptStore(s => s.loadProfile)
  const getProfile = usePromptStore(s => s.getProfile)
  const pushHistory = usePromptStore(s => s.pushHistory)
  const getHistory = usePromptStore(s => s.getHistory)
  const clearHistory = usePromptStore(s => s.clearHistory)
  const importProject = usePromptStore(s => s.importProject)
  const setDoc = usePromptStore(s => s.setDoc)

  const profileExists = !!getProfile()
  const history = getHistory()

  const base = useMemo(() => (doc.meta.title || "song-assets").replace(/[^\w\-]+/g,"_"), [doc.meta.title])

  const doGenerateAndSave = () => {
    const item = { createdAt: new Date().toISOString(), title: doc.meta.title || null, doc, compiledPrompt, lyrics }
    const next = pushHistory(item)
    toast?.(`Saved to history (${Math.min(next.length, HISTORY_LIMIT)}/${HISTORY_LIMIT})`)
  }

  const exportProjectFile = () => { downloadJSON(`${base}_project.json`, doc); toast?.("Exported project JSON") }

  const importProjectFile = async (file) => {
    const text = await file.text()
    let obj = null
    try { obj = JSON.parse(text) } catch {}
    const ok = importProject(obj)
    toast?.(ok ? "Imported project" : "Invalid project file")
  }

  const downloadAssets = () => {
    downloadText(`${base}_prompt.txt`, compiledPrompt || "")
    downloadText(`${base}_lyrics.txt`, lyrics || "")
    downloadJSON(`${base}_metadata.json`, {
      app: "Suno Modular Prompt Generator",
      createdAt: new Date().toISOString(),
      ...doc.meta,
      architecture: doc.architecture,
      nuance: doc.nuance,
      arrangement: doc.arrangement,
      dynamicVars: doc.dynamicVars,
      prompt: compiledPrompt,
      lyrics
    })
    toast?.("Downloaded assets (3 files)")
  }

  return (
    <div className="panel">
      <h2>Projects</h2>
      <div className="sub">Profile defaults, history, import/export. Local-only.</div>
      <div className="hr"></div>

      <div className="row">
        <button className="btn primary" type="button" onClick={doGenerateAndSave}>Generate & Save</button>
        <button className="btn" type="button" onClick={downloadAssets}>Download Assets</button>
      </div>

      <div className="hr"></div>

      <div className="row">
        <button className="btn small" type="button" onClick={() => { saveProfile(); toast?.("Saved profile defaults") }}>
          Save Profile Defaults
        </button>
        <button className="btn small" type="button" disabled={!profileExists} onClick={() => { loadProfile(); toast?.("Loaded profile defaults") }}>
          Load Profile Defaults
        </button>
      </div>

      <div className="hr"></div>

      <div className="row">
        <button className="btn small" type="button" onClick={exportProjectFile}>Export Project JSON</button>
        <label className="btn small" style={{cursor:'pointer'}}>
          Import Project JSON
          <input type="file" accept="application/json" hidden onChange={(e)=>{
            const f = e.target.files?.[0]
            if(f) importProjectFile(f)
            e.target.value = ""
          }} />
        </label>
        <button className="btn small danger" type="button" onClick={() => { clearHistory(); toast?.("History cleared") }}>
          Clear History
        </button>
      </div>

      <div className="hr"></div>

      <div className="label">History (click to load)</div>
      <div className="row">
        {history?.length ? history.slice(0, HISTORY_LIMIT).map((h, idx) => (
          <button key={idx} className="chip" type="button" onClick={() => { setDoc(h.doc); toast?.("Loaded from history") }}
            title={h.createdAt}>
            #{idx+1} · {h.title || "Untitled"} · {(h.createdAt||"").slice(0,19).replace("T"," ")}
          </button>
        )) : <span className="muted small">No history yet.</span>}
      </div>
    </div>
  )
}
