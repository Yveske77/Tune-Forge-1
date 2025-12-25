import React from 'react'
import TagPicker from './TagPicker'
import dict from '../data/dictionaries.json'
import { usePromptStore } from '../store'

export default function NuancePanel(){
  const doc = usePromptStore(s => s.doc)
  const setNuance = usePromptStore(s => s.setNuance)
  const n = doc.nuance || {}

  const toggleFx = (tag) => {
    const set = new Set(n.fx || [])
    if(set.has(tag)) set.delete(tag); else set.add(tag)
    setNuance({fx: Array.from(set)})
  }

  return (
    <div className="section">
      <div className="label">Nuance (modifiers → ( ))</div>

      <div className="sectionCard">
        <div className="muted small" style={{marginBottom:8}}>FX Library (click to toggle)</div>
        <div className="row">
          {dict.fx.map(fx => {
            const tag = fx.tags[0]
            const on = (n.fx || []).includes(tag)
            return (
              <button
                key={fx.id}
                className={'chip' + (on ? ' on' : '')}
                type="button"
                onClick={() => toggleFx(tag)}
                title={(fx.tags || []).join(", ")}
              >
                {fx.label}
              </button>
            )
          })}
        </div>
        <div className="muted small" style={{marginTop:8}}>Selected FX renders as: { (n.fx||[]).length ? (n.fx||[]).join(", ") : "none" }</div>
      </div>

      <div style={{marginTop:12}}>
        <TagPicker
          label="Vocal Tone"
          options={dict.vocalTones}
          selected={n.vocalTone || []}
          max={6}
          onChange={(tags)=>setNuance({vocalTone: tags})}
          placeholder="e.g., whispered, gritty, warm…"
        />
      </div>

      <div style={{marginTop:12}}>
        <TagPicker
          label="Mix Notes"
          options={dict.mixTags}
          selected={n.mix || []}
          max={8}
          onChange={(tags)=>setNuance({mix: tags})}
          placeholder="e.g., wide stereo, club-ready…"
        />
      </div>
    </div>
  )
}
