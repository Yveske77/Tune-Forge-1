import React, { useMemo, useState } from 'react'
import loopsData from '../data/loopTemplates.json'
import fxData from '../data/fxChains.json'
import { usePromptStore } from '../store'

// A simple side drawer for reusable templates. Loops represent structural repeating patterns
// and FX chains represent ordered effect presets. Users can drag these items into the
// timeline or onto layers to apply them. They behave similarly to part blocks but are
// grouped separately for clarity.
export default function LibraryPanel(){
  const startBlockPreview = usePromptStore(s => s.startBlockPreview)
  const cancelBlockPreview = usePromptStore(s => s.cancelBlockPreview)
  const preview = usePromptStore(s => s.preview)

  // Category titles for display
  const CATS = ["Loops","FX Chains"]

  // Build open/closed state for each category
  const [open, setOpen] = useState(() => Object.fromEntries(CATS.map(c => [c,true])))

  // Extract loop and FX items from JSON
  const loops = Array.isArray(loopsData.loops) ? loopsData.loops : []
  const chains = Array.isArray(fxData.chains) ? fxData.chains : []

  // Group by category for rendering
  const byCat = useMemo(() => {
    const map = new Map(CATS.map(c => [c, []]))
    loops.forEach(l => map.get("Loops").push(l))
    chains.forEach(c => map.get("FX Chains").push(c))
    return map
  }, [loops, chains])

  // When dragging begins, attach metadata and start preview so ghost curves appear
  const dragStart = (e, item, cat) => {
    // Determine type for dataTransfer and preview
    const type = item.category || (cat === 'Loops' ? 'Loop' : 'FXChain')
    if(type === 'Loop'){
      e.dataTransfer.setData('application/x-daiw-loop', JSON.stringify(item))
    }else if(type === 'FXChain'){
      e.dataTransfer.setData('application/x-daiw-fxchain', JSON.stringify(item))
    }else{
      e.dataTransfer.setData('application/x-daiw-item', JSON.stringify(item))
    }
    e.dataTransfer.effectAllowed = 'copy'
    // Use the same preview mechanism as part blocks. Loops include lanes so can be previewed.
    startBlockPreview(item)
  }

  // Cancel preview if drag ends without drop
  const dragEnd = () => {
    if(preview?.active) cancelBlockPreview()
  }

  return (
    <div className="section">
      <div className="label">Library</div>
      <div className="sub">Reusable loop templates & FX chains</div>
      <div className="cardlist" style={{marginTop:10}}>
        {CATS.map(cat => (
          <div key={cat} className="sectionCard">
            <div className="row" style={{justifyContent:'space-between'}}>
              <div style={{fontWeight:900}}>{cat}</div>
              <button className={'chip ' + (open[cat] ? 'on' : '')} type="button"
                onClick={()=>setOpen(prev => ({...prev, [cat]: !prev[cat]}))}>
                {open[cat] ? 'Hide' : 'Show'}
              </button>
            </div>
            {open[cat] && (
              <div className="chips" style={{marginTop:10}}>
                {(byCat.get(cat) || []).map(item => (
                  <div key={item.id}
                       draggable
                       onDragStart={(e)=>dragStart(e,item,cat)}
                       onDragEnd={dragEnd}
                       className="chip"
                       title={Array.isArray(item.effects) ? item.effects.join(', ') : Array.isArray(item.modifiers) ? item.modifiers.join(', ') : ''}
                       style={{cursor:'grab'}}>
                    {item.label}
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