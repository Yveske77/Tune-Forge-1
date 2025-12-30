import React, { useMemo, useState } from 'react'
import pro from '../data/proBlocks.json'
import adaptive from '../data/adaptiveBlocks.json'
import { usePromptStore } from '../store'

const CATS = ["Build","Drop","Break","Variation","Outro","Adaptive"]

export default function PartBlocksPanel(){
  const startBlockPreview = usePromptStore(s => s.startBlockPreview)
  const cancelBlockPreview = usePromptStore(s => s.cancelBlockPreview)
  const preview = usePromptStore(s => s.preview)

  const [open, setOpen] = useState(() => Object.fromEntries(CATS.map(c => [c,true])))

  const byCat = useMemo(() => {
    const map = new Map(CATS.map(c => [c, []]))
    const all = [...(pro.blocks||[]), ...(adaptive.blocks||[])]
    for(const b of all){
      if(!map.has(b.category)) map.set(b.category, [])
      map.get(b.category).push(b)
    }
    return map
  }, [])

  const dragStart = (e, block) => {
    e.dataTransfer.setData("application/x-daiw-block", JSON.stringify(block))
    e.dataTransfer.effectAllowed = "copy"
    startBlockPreview(block)
  }

  const dragEnd = () => {
    // if drop doesn't commit, TubeTimeline will cancel; but keep safety here too
    if(preview?.active) cancelBlockPreview()
  }

  return (
    <div className="section">
      <div className="label">Pro Blocks</div>
      <div className="sub">Drag blocks into the tube timeline to audition structure before committing.</div>

      <div className="cardlist" style={{marginTop:10}}>
        {CATS.map(cat => (
          <div key={cat} className="sectionCard">
            <div className="row" style={{justifyContent:'space-between'}}>
              <div style={{fontWeight:900}}>{cat}</div>
              <button className={'chip ' + (open[cat] ? 'on' : '')} type="button"
                onClick={()=>setOpen(s => ({...s, [cat]: !s[cat]}))}>
                {open[cat] ? 'Hide' : 'Show'}
              </button>
            </div>

            {open[cat] && (
              <div className="chips" style={{marginTop:10}}>
                {(byCat.get(cat) || []).map(b => (
                  <div key={b.id}
                       draggable
                       onDragStart={(e)=>dragStart(e,b)}
                       onDragEnd={dragEnd}
                       className="chip"
                       title={(b.modifiers||[]).join(", ")}
                       style={{cursor:'grab'}}>
                    {b.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
