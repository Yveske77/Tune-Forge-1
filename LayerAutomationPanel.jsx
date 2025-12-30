import React, { useMemo, useState } from 'react'
import dict from '../data/dictionaries.json'
import { usePromptStore } from '../store'

const POS = dict.mixPositions || ["front","center","back","wide","mono"]
const POS_TO_NUM = { front: 90, center: 60, back: 30, wide: 70, mono: 50 }

function getSecList(doc){
  const v = doc.activeVariant || "A"
  return (doc.arrangementTracks?.[v] || doc.arrangement || [])
}

function itemKey(groupId, name){ return `${groupId}::${name}` }

export default function LayerAutomationPanel(){
  const doc = usePromptStore(s => s.doc)
  const setLayerAutomation = usePromptStore(s => s.setLayerAutomation)
  const clearLayerAutomationForSection = usePromptStore(s => s.clearLayerAutomationForSection)

  const sections = useMemo(() => getSecList(doc), [doc])
  const layers = doc.layers || { instruments: [], voices: [] }
  const sla = doc.sectionLayerAutomation || {}

  const [openSection, setOpenSection] = useState(sections[0]?.id || "")

  const sec = sections.find(s => s.id === openSection)

  const renderKind = (kind) => {
    const groups = layers[kind] || []
    if(!groups.length) return <div className="muted small">No {kind} groups.</div>

    return (
      <div className="cardlist" style={{marginTop:10}}>
        {groups.map(g => (
          <div key={g.id} className="sectionCard" style={{background:'rgba(14,15,22,.55)'}}>
            <div className="row" style={{justifyContent:'space-between'}}>
              <div style={{fontWeight:900}}>{g.name}</div>
              <span className="pill">{kind}</span>
            </div>
            <div className="cardlist" style={{marginTop:10}}>
              {(g.items||[]).map(it => {
                const k = itemKey(g.id, it.name)
                const cur = (sla[openSection]?.[kind] || {})[k] || {}
                const level = (typeof cur.level === "number") ? cur.level : (it.level ?? 70)
                const position = cur.position || it.position || "center"
                return (
                  <div key={it.name} className="kpi" style={{alignItems:'flex-start'}}>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:800}}>{it.name}</div>
                      <div className="row" style={{marginTop:8}}>
                        <span className="pill">Level</span>
                        <input type="range" min="0" max="100" value={level}
                          onChange={(e)=>setLayerAutomation(openSection, kind, g.id, it.name, {level:Number(e.target.value)})}
                          style={{flex:1}} />
                        <span className="pill">{level}</span>
                      </div>
                      <div className="row" style={{marginTop:8}}>
                        <span className="pill">Position</span>
                        {POS.map(p => (
                          <button key={p} className={'chip' + (position===p ? ' on' : '')} type="button"
                            onClick={()=>setLayerAutomation(openSection, kind, g.id, it.name, {position:p})}>{p}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    )
  }

  if(!sections.length){
    return (
      <div className="section">
        <div className="label">Layer Automation</div>
        <div className="sub">Add sections first.</div>
      </div>
    )
  }

  return (
    <div className="section">
      <div className="label">Layer Automation</div>
      <div className="sub">Per-section presence of instruments & voices. This is the “who is in the mix *right now*” layer.</div>

      <div className="row" style={{marginTop:10}}>
        <select value={openSection} onChange={(e)=>setOpenSection(e.target.value)} style={{flex:1}}>
          {sections.map(s => <option key={s.id} value={s.id}>{s.label || s.type}</option>)}
        </select>
        <button className="btn small danger" type="button" onClick={()=>clearLayerAutomationForSection(openSection)}>Clear section</button>
      </div>

      <div className="two" style={{marginTop:12}}>
        <div>
          <div className="muted small">Instruments</div>
          {renderKind("instruments")}
        </div>
        <div>
          <div className="muted small">Voices</div>
          {renderKind("voices")}
        </div>
      </div>
    </div>
  )
}
