import React, { useMemo } from 'react'
import { DndContext, closestCenter } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, arrayMove, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import dict from '../data/dictionaries.json'
import { uid } from '../utils/id'
import { usePromptStore } from '../store'

const SECTION_TYPES = ["Intro","Verse","Pre-Chorus","Chorus","Bridge","Outro","Break","Drop","Interlude"]

function tensionSuggestions(tension){
  const t = Number(tension ?? 50)
  if(t <= 30) return ["calm","airy","intimate","atmospheric"]
  if(t <= 70) return ["driving","focused","rising tension","layered"]
  return ["explosive","anthemic","wide","distorted"]
}

function SortableSectionCard({ sec }){
  const update = usePromptStore(s => s.updateSection)
  const remove = usePromptStore(s => s.removeSection)

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: sec.id })
  const style = { transform: CSS.Transform.toString(transform), transition }
  const sug = tensionSuggestions(sec.tension)

  const toggleModifier = (tag) => {
    const set = new Set(sec.modifiers || [])
    if(set.has(tag)) set.delete(tag); else set.add(tag)
    update(sec.id, { modifiers: Array.from(set) })
  }

  const toggleEmphasis = (tag) => {
    const set = new Set(sec.emphasis || [])
    if(set.has(tag)) set.delete(tag); else set.add(tag)
    update(sec.id, { emphasis: Array.from(set) })
  }

  return (
    <div ref={setNodeRef} style={style} className="sectionCard">
      <div className="sectionCardHeader">
        <div className="row">
          <span className="dragHandle" {...attributes} {...listeners}>⋮⋮ drag</span>
          <span className="badge">{sec.type}</span>
          <span className="muted small">{sec.label || ''}</span>
        </div>
        <button className="btn small danger" type="button" onClick={() => remove(sec.id)}>Remove</button>
      </div>

      <div className="inputRow">
        <div>
          <div className="muted small" style={{marginBottom:6}}>Type</div>
          <select value={sec.type} onChange={(e)=>update(sec.id, { type: e.target.value })}>
            {SECTION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <div className="muted small" style={{marginBottom:6}}>Label</div>
          <input type="text" value={sec.label} onChange={(e)=>update(sec.id, { label: e.target.value })} placeholder="Verse 1" />
        </div>
      </div>

      <div style={{marginTop:10}}>
        <div className="muted small" style={{marginBottom:6}}>Content</div>
        <input type="text" value={sec.content} onChange={(e)=>update(sec.id, { content: e.target.value })} placeholder="e.g., minimal piano, intimate vocal" />
      </div>

      <div style={{marginTop:10}}>
        <div className="muted small" style={{marginBottom:6}}>Tension</div>
        <div className="row">
          <input type="range" min="0" max="100" value={sec.tension ?? 50}
            onChange={(e)=>update(sec.id, { tension: Number(e.target.value) })} style={{flex:'1'}} />
          <span className="pill">{sec.tension ?? 50}</span>
        </div>
        <div className="muted small" style={{marginTop:6}}>Suggestions (click to toggle):</div>
        <div className="row" style={{marginTop:6}}>
          {sug.map(s => (
            <button key={s} type="button" className={'chip' + ((sec.modifiers||[]).includes(s) ? ' on' : '')}
              onClick={() => toggleModifier(s)}>{s}</button>
          ))}
        </div>
      </div>

      <div style={{marginTop:10}}>
        <div className="muted small" style={{marginBottom:6}}>Per-section lane overrides (optional)</div>
        <div className="row">
          <button type="button" className="btn small" onClick={() => update(sec.id, { lanes: sec.lanes ? null : { energy: sec.tension ?? 50, density: 55, brightness: 50, vocalPresence: 65 } })}>
            {sec.lanes ? "Clear overrides" : "Add overrides"}
          </button>
          <span className="pill">{sec.lanes ? "Overrides ON" : "Overrides OFF"}</span>
        </div>
        {sec.lanes ? (
          <div className="two" style={{marginTop:10}}>
            {["energy","density","brightness","vocalPresence"].map(k => (
              <div key={k} className="kpi" style={{flexDirection:'column', alignItems:'stretch', gap:8}}>
                <div className="row" style={{justifyContent:'space-between'}}>
                  <div style={{fontWeight:800}}>{k}</div>
                  <span className="pill">{sec.lanes[k] ?? 50}</span>
                </div>
                <input type="range" min="0" max="100" value={sec.lanes[k] ?? 50}
                  onChange={(e)=>update(sec.id, { lanes: { ...(sec.lanes||{}), [k]: Number(e.target.value) } })} />
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <div style={{marginTop:10}}>
        <div className="muted small" style={{marginBottom:6}}>Modifiers (mood/texture)</div>
        <div className="row">
          {dict.moods.slice(0, 18).map(m => (
            <button key={m} type="button" className={'chip' + ((sec.modifiers||[]).includes(m) ? ' on' : '')}
              onClick={() => toggleModifier(m)}>{m}</button>
          ))}
        </div>
      </div>

      <div style={{marginTop:10}}>
        <div className="muted small" style={{marginBottom:6}}>Emphasis</div>
        <div className="row">
          {dict.emphasis.map(em => (
            <button key={em} type="button" className={'chip' + ((sec.emphasis||[]).includes(em) ? ' on' : '')}
              onClick={() => toggleEmphasis(em)}>{em}</button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function ArrangementBuilder(){
  const doc = usePromptStore(s => s.doc)
  const addSection = usePromptStore(s => s.addSectionToActiveVariant)
  const reorderSections = usePromptStore(s => s.reorderActiveVariant)

  const ids = useMemo(() => (doc.arrangement||[]).map(s => s.id), [doc.arrangement])

  const onDragEnd = (event) => {
    const { active, over } = event
    if(!over || active.id === over.id) return
    const oldIndex = ids.indexOf(active.id)
    const newIndex = ids.indexOf(over.id)
    reorderSections(arrayMove(ids, oldIndex, newIndex))
  }

  const add = () => addSection({
    id: uid("sec"),
    type: "Verse",
    label: `Verse ${(doc.arrangement||[]).filter(s=>String(s.type).toLowerCase()==='verse').length + 1}`,
    content: "",
    modifiers: [],
    emphasis: [],
    tension: 50,
  })

  return (
    <div className="section">
      <div className="label">Arrangement Builder</div>
      <div className="sub">Drag to reorder. Each section becomes [Label: content] (modifiers) emphasis.</div>

      <div className="row" style={{marginTop:10}}>
        <button className="btn small" type="button" onClick={add}>Add Section</button>
        <span className="pill">{(doc.arrangement||[]).length} sections</span>
      </div>

      <div style={{marginTop:12}}>
        <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={ids} strategy={verticalListSortingStrategy}>
            <div className="cardlist">
              {(doc.arrangement||[]).map(sec => <SortableSectionCard key={sec.id} sec={sec} />)}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  )
}
