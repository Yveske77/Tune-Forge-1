import React from 'react'
import TagPicker from './TagPicker'
import { usePromptStore } from '../store'
import dict from '../data/dictionaries.json'

export default function ArchitecturePanel(){
  const doc = usePromptStore(s => s.doc)
  const setArchitecture = usePromptStore(s => s.setArchitecture)
  const a = doc.architecture

  return (
    <div className="section">
      <div className="label">Architecture (hard params → [ ])</div>
      <div className="two">
        <div>
          <div className="muted small" style={{marginBottom:6}}>Tempo (BPM)</div>
          <input
            type="text"
            value={a.tempoBpm ?? ""}
            onChange={(e)=> {
              const v = e.target.value.replace(/[^0-9]/g,'')
              setArchitecture({tempoBpm: v ? Number(v) : null})
            }}
            placeholder="120"
          />
        </div>
        <div>
          <div className="muted small" style={{marginBottom:6}}>Key</div>
          <input
            type="text"
            value={a.key ?? ""}
            onChange={(e)=>setArchitecture({key:e.target.value})}
            placeholder="C Minor"
          />
        </div>
      </div>

      <div className="two" style={{marginTop:10}}>
        <div>
          <div className="muted small" style={{marginBottom:6}}>Time Signature</div>
          <select value={a.timeSignature ?? "4/4"} onChange={(e)=>setArchitecture({timeSignature:e.target.value})}>
            {["4/4","3/4","6/8","5/4","7/8"].map(x=><option key={x}>{x}</option>)}
          </select>
        </div>
        <div>
          <div className="muted small" style={{marginBottom:6}}>Global Instruments (suggestions)</div>
          <input
            type="text"
            value={(a.structureDefaults?.globalInstruments || []).join(", ")}
            onChange={(e)=>{
              const arr = e.target.value.split(",").map(s=>s.trim()).filter(Boolean)
              setArchitecture({structureDefaults:{...a.structureDefaults, globalInstruments: arr}})
            }}
            placeholder="drums, bass, pads"
          />
        </div>
      </div>

      <div className="hr"></div>

      <TagPicker
        label="Genres / Vibe (max 3)"
        options={dict.genres}
        selected={a.genreTags || []}
        max={3}
        onChange={(tags)=>setArchitecture({genreTags: tags})}
        placeholder="Type a genre (Pop, R&B, Lo-Fi...)"
      />
    </div>
  )
}
