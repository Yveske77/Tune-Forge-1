import React, { useMemo, useState } from 'react'
import { compileToSuno } from '../compiler/suno'
import { compileToUdio } from '../compiler/udio'
import { compileToGenericLLM } from '../compiler/generic'
import { computeLengths } from '../utils/validator'
import { usePromptStore } from '../store'

export default function PreviewPanel({ onCopyPrompt, onDownloadAssets }){
  const doc = usePromptStore(s => s.doc)
  const [format, setFormat] = useState("suno")

  const compiled = useMemo(() => {
    if(format === "udio") return compileToUdio(doc)
    if(format === "generic") return compileToGenericLLM(doc)
    return compileToSuno(doc)
  }, [doc, format])

  const lyrics = useMemo(() => (doc.lyrics?.text || "").trim() || "(no lyrics provided)", [doc])
  const lens = useMemo(() => computeLengths(doc, format === "suno" ? compiled : "", lyrics), [doc, compiled, lyrics, format])

  return (
    <div className="panel">
      <div className="row" style={{justifyContent:'space-between'}}>
        <div>
          <h2>Output</h2>
          <div className="sub">Live preview. Pick your export target.</div>
        </div>
        <div className="row">
          <select value={format} onChange={(e)=>setFormat(e.target.value)} style={{width:170}}>
            <option value="suno">Suno format</option>
            <option value="udio">Udio format</option>
            <option value="generic">Generic LLM brief</option>
          </select>
          <button className="btn small" type="button" onClick={() => onCopyPrompt(compiled)}>Copy</button>
          <button className="btn small" type="button" onClick={() => onDownloadAssets(compiled, lyrics)}>Download</button>
        </div>
      </div>

      <div className="hr"></div>

      <div className="label">Generated</div>
      <div className="out">{compiled || "(empty)"}</div>

      {format === "suno" ? (
        <div className="row" style={{marginTop:10}}>
          <span className="pill">Style: {lens.styleLen}/4500</span>
          <span className="pill">Lyrics: {lens.lyricsLen}/5000</span>
          <span className="pill">{lens.within ? "Within typical limits" : "Over recommended limits"}</span>
        </div>
      ) : (
        <div className="muted small" style={{marginTop:10}}>
          Length meter shown for Suno only (since other formats don’t share the same hard caps).
        </div>
      )}

      <div className="label" style={{marginTop:12}}>Lyrics</div>
      <div className="out">{lyrics}</div>
    </div>
  )
}
