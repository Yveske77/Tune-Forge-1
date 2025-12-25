import React from 'react'
import { usePromptStore } from '../store'

export default function LyricsPanel(){
  const doc = usePromptStore(s => s.doc)
  const setLyrics = usePromptStore(s => s.setLyrics)

  return (
    <div className="section">
      <div className="label">Lyrics</div>
      <div className="sub">Raw draft. Keep meaning; polish later.</div>

      <textarea value={doc.lyrics?.text || ""} onChange={(e)=>setLyrics(e.target.value)}
        placeholder="Paste your lyrics or draft ideas..." />
    </div>
  )
}
