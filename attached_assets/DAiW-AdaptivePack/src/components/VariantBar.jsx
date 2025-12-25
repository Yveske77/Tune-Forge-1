import React from 'react'
import { usePromptStore } from '../store'

export default function VariantBar(){
  const doc = usePromptStore(s => s.doc)
  const setActiveVariant = usePromptStore(s => s.setActiveVariant)
  const toggleVariantEnabled = usePromptStore(s => s.toggleVariantEnabled)
  const cloneVariantFromA = usePromptStore(s => s.cloneVariantFromA)

  const active = doc.activeVariant || "A"
  const Aon = doc.arrangementVariants?.A?.enabled ?? true
  const Bon = doc.arrangementVariants?.B?.enabled ?? false

  return (
    <div className="section">
      <div className="label">Arrangement Overlays</div>
      <div className="sub">Edit one track, view overlays. A is your “main universe”. B is an alternate cut.</div>

      <div className="row" style={{marginTop:10, justifyContent:'space-between'}}>
        <div className="row">
          <button className={'chip ' + (active==="A" ? 'on' : '')} type="button" onClick={()=>setActiveVariant("A")}>Edit A</button>
          <button className={'chip ' + (active==="B" ? 'on' : '')} type="button" onClick={()=>setActiveVariant("B")}>Edit B</button>
          <span className="pill">Overlay display</span>
          <button className={'chip ' + (Aon ? 'on' : '')} type="button" onClick={()=>toggleVariantEnabled("A")}>A</button>
          <button className={'chip ' + (Bon ? 'on' : '')} type="button" onClick={()=>toggleVariantEnabled("B")}>B</button>
        </div>

        <button className="btn small" type="button" onClick={cloneVariantFromA}>Clone A → B</button>
      </div>
    </div>
  )
}
