import React from 'react'
import { usePromptStore } from '../store'

export default function MetaPanel(){
  const doc = usePromptStore(s => s.doc)
  const setMeta = usePromptStore(s => s.setMeta)

  return (
    <div className="section">
      <div className="label">Meta</div>
      <div className="two">
        <div>
          <div className="muted small" style={{marginBottom:6}}>Model Version</div>
          <select value={doc.meta.modelVersion} onChange={(e)=>setMeta({modelVersion:e.target.value})}>
            <option value="v4.5">v4.5 (Standard)</option>
            <option value="v5">v5 (Extended)</option>
          </select>
        </div>
        <div>
          <div className="muted small" style={{marginBottom:6}}>Voice Type</div>
          <select value={doc.meta.voiceType} onChange={(e)=>setMeta({voiceType:e.target.value})}>
            <option>Adult Male</option>
            <option>Adult Female</option>
            <option>Duet</option>
          </select>
        </div>
      </div>

      <div className="two" style={{marginTop:10}}>
        <div>
          <div className="muted small" style={{marginBottom:6}}>Primary Language</div>
          <select value={doc.meta.language} onChange={(e)=>setMeta({language:e.target.value})}>
            {["English","French","German","Spanish","Italian","Portuguese","Hindi","Japanese","Korean","Chinese","Manual Entry"].map(l=>(
              <option key={l}>{l}</option>
            ))}
          </select>
        </div>
        <div>
          <div className="muted small" style={{marginBottom:6}}>Title (optional)</div>
          <input type="text" value={doc.meta.title} onChange={(e)=>setMeta({title:e.target.value})} placeholder="e.g., Tu Cartonnes" />
        </div>
      </div>
    </div>
  )
}
