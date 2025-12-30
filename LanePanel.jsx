import React from 'react'
import { usePromptStore } from '../store'

function LaneSlider({label, value, onChange}){
  return (
    <div className="kpi" style={{flexDirection:'column', alignItems:'stretch', gap:8}}>
      <div className="row" style={{justifyContent:'space-between'}}>
        <div style={{fontWeight:800}}>{label}</div>
        <span className="pill">{value}</span>
      </div>
      <input type="range" min="0" max="100" value={value} onChange={(e)=>onChange(Number(e.target.value))} />
    </div>
  )
}

export default function LanePanel(){
  const doc = usePromptStore(s => s.doc)
  const setDoc = usePromptStore(s => s.setDoc)
  const lanes = doc.lanes || {energy:60,density:55,brightness:50,vocalPresence:65}

  const setLane = (key, val) => setDoc(d => ({...d, lanes: {...(d.lanes||{}), [key]: val}}))

  return (
    <div className="section">
      <div className="label">Macro Lanes</div>
      <div className="sub">Global “shape” controls. Sections can override (toggle overrides inside each section card).</div>

      <div className="two" style={{marginTop:10}}>
        <LaneSlider label="Energy" value={lanes.energy ?? 60} onChange={(v)=>setLane("energy", v)} />
        <LaneSlider label="Density" value={lanes.density ?? 55} onChange={(v)=>setLane("density", v)} />
        <LaneSlider label="Brightness" value={lanes.brightness ?? 50} onChange={(v)=>setLane("brightness", v)} />
        <LaneSlider label="Vocal presence" value={lanes.vocalPresence ?? 65} onChange={(v)=>setLane("vocalPresence", v)} />
      </div>
    </div>
  )
}
