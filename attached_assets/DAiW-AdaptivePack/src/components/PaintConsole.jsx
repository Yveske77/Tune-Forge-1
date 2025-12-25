import React, { useMemo } from 'react'
import dict from '../data/dictionaries.json'
import { usePromptStore } from '../store'

export default function PaintConsole(){
  const doc = usePromptStore(s => s.doc)
  const setPaintUI = usePromptStore(s => s.setPaintUI)

  const paint = doc.ui?.paint || { enabled:false, mode:'lane', laneKey:'energy', kind:'instruments', groupId:'', itemName:'', snap:true }
  const layers = doc.layers || { instruments: [], voices: [] }
  const lanes = [
    {key:'energy', label:'Energy'},
    {key:'density', label:'Density'},
    {key:'brightness', label:'Brightness'},
    {key:'vocalPresence', label:'Vocal presence'},
  ]

  const groups = layers[paint.kind] || []
  const itemsForGroup = useMemo(() => {
    const g = groups.find(x => x.id === paint.groupId)
    return g?.items || []
  }, [groups, paint.groupId])

  return (
    <div className="section">
      <div className="label">Paint Console</div>
      <div className="sub">Turn on paint mode and draw values directly on the tube timeline (pointer = brush).</div>

      <div className="row" style={{marginTop:10, justifyContent:'space-between'}}>
        <div className="row">
          <button className={'chip ' + (paint.enabled ? 'on' : '')} type="button"
            onClick={()=>setPaintUI({ enabled: !paint.enabled })}>
            {paint.enabled ? 'Paint ON' : 'Paint OFF'}
          </button>
          <button className={'chip ' + (paint.mode==='lane' ? 'on' : '')} type="button" onClick={()=>setPaintUI({ mode:'lane' })}>Lanes</button>
          <button className={'chip ' + (paint.mode==='layer' ? 'on' : '')} type="button" onClick={()=>setPaintUI({ mode:'layer' })}>Layers</button>
          <button className={'chip ' + (paint.snap ? 'on' : '')} type="button" onClick={()=>setPaintUI({ snap: !paint.snap })}>
            {paint.snap ? 'Snap' : 'Smooth'}
          </button>
        </div>
        <span className="pill">Tip: drag across the tube</span>
      </div>

      {paint.mode === 'lane' ? (
        <div className="row" style={{marginTop:12}}>
          <span className="pill">Lane</span>
          <select value={paint.laneKey} onChange={(e)=>setPaintUI({ laneKey: e.target.value })} style={{flex:1}}>
            {lanes.map(l => <option key={l.key} value={l.key}>{l.label}</option>)}
          </select>
        </div>
      ) : (
        <div style={{marginTop:12, display:'flex', flexDirection:'column', gap:10}}>
          <div className="row">
            <span className="pill">Kind</span>
            <select value={paint.kind} onChange={(e)=>setPaintUI({ kind: e.target.value, groupId:'', itemName:'' })} style={{flex:1}}>
              <option value="instruments">Instruments</option>
              <option value="voices">Voices</option>
            </select>
          </div>

          <div className="row">
            <span className="pill">Group</span>
            <select value={paint.groupId} onChange={(e)=>setPaintUI({ groupId: e.target.value, itemName:'' })} style={{flex:1}}>
              <option value="">Select group...</option>
              {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
            </select>
          </div>

          <div className="row">
            <span className="pill">Item</span>
            <select value={paint.itemName} onChange={(e)=>setPaintUI({ itemName: e.target.value })} style={{flex:1}}>
              <option value="">Select item...</option>
              {itemsForGroup.map(it => <option key={it.name} value={it.name}>{it.name}</option>)}
            </select>
          </div>

          <div className="muted small">Painting sets <b>level</b> (0–100). Position stays as last set in Layer Automation.</div>
        </div>
      )}
    </div>
  )
}
