import React, { useMemo, useState } from 'react'
import { usePromptStore } from '../store'

export default function DynamicVarsPanel(){
  const doc = usePromptStore(s => s.doc)
  const setDynamicVar = usePromptStore(s => s.setDynamicVar)
  const dv = doc.dynamicVars || {}
  const keys = Object.keys(dv)

  const [k, setK] = useState("")
  const [v, setV] = useState("")
  const canAdd = useMemo(() => k.trim() && v.trim(), [k, v])

  return (
    <div className="section">
      <div className="label">Dynamic Vars (reserved → { })</div>
      <div className="muted small">Placeholders / experiments. Compiler emits them in a single [Vars: {...}] tag.</div>

      <div className="row" style={{marginTop:10}}>
        <input type="text" value={k} onChange={(e)=>setK(e.target.value)} placeholder="key (e.g., chorus_intensity)" />
        <input type="text" value={v} onChange={(e)=>setV(e.target.value)} placeholder="value (e.g., high)" />
        <button className="btn small" type="button" disabled={!canAdd} onClick={() => { setDynamicVar(k.trim(), v.trim()); setK(''); setV('') }}>
          Add
        </button>
      </div>

      <div className="row" style={{marginTop:10}}>
        {keys.length ? keys.map(key => (
          <button key={key} className="chip on" type="button" onClick={() => setDynamicVar(key, "")} title="Remove">
            {key}={dv[key]} ✕
          </button>
        )) : <span className="muted small">No dynamic vars.</span>}
      </div>
    </div>
  )
}
