import React from 'react'
import dict from '../data/dictionaries.json'
import { usePromptStore } from '../store'
import { uid } from '../utils/id'

function uniq(arr){ return Array.from(new Set(arr)) }

export default function LayersPanel(){
  const doc = usePromptStore(s => s.doc)
  const setDoc = usePromptStore(s => s.setDoc)

  const layers = doc.layers || { instruments: [], voices: [] }
  const positions = dict.mixPositions || ["front","center","back","wide","mono"]

  const addGroup = (kind) => {
    const name = kind === "voices" ? "New Voice Group" : "New Instrument Group"
    const group = { id: uid(kind==="voices" ? "vgrp":"grp"), name, items: [] }
    setDoc(d => ({...d, layers: {...(d.layers||{}), [kind]: [...(d.layers?.[kind]||[]), group]}}))
  }

  const removeGroup = (kind, id) => {
    setDoc(d => ({...d, layers: {...(d.layers||{}), [kind]: (d.layers?.[kind]||[]).filter(g=>g.id!==id)}}))
  }

  const updateGroup = (kind, id, patch) => {
    setDoc(d => ({
      ...d,
      layers: {
        ...(d.layers||{}),
        [kind]: (d.layers?.[kind]||[]).map(g=>g.id===id ? {...g, ...patch} : g)
      }
    }))
  }

  const addItem = (kind, groupId, name) => {
    const item = { name, level: 70, position: "center" }
    setDoc(d => ({
      ...d,
      layers: {
        ...(d.layers||{}),
        [kind]: (d.layers?.[kind]||[]).map(g=>{
          if(g.id!==groupId) return g
          const next = [...(g.items||[])]
          if(!next.some(x=>x.name===name)) next.push(item)
          return {...g, items: next}
        })
      }
    }))
  }

  const updateItem = (kind, groupId, name, patch) => {
    setDoc(d => ({
      ...d,
      layers: {
        ...(d.layers||{}),
        [kind]: (d.layers?.[kind]||[]).map(g=>{
          if(g.id!==groupId) return g
          return {...g, items: (g.items||[]).map(it=>it.name===name ? {...it, ...patch} : it)}
        })
      }
    }))
  }

  const removeItem = (kind, groupId, name) => {
    setDoc(d => ({
      ...d,
      layers: {
        ...(d.layers||{}),
        [kind]: (d.layers?.[kind]||[]).map(g=>{
          if(g.id!==groupId) return g
          return {...g, items: (g.items||[]).filter(it=>it.name!==name)}
        })
      }
    }))
  }

  const applyGenreSuggestions = () => {
    const tags = doc.architecture?.genreTags || []
    const hit = tags.map(t => dict.genreSuggestions?.[t]).find(Boolean)
    if(!hit) return
    setDoc(d => ({
      ...d,
      nuance: {
        ...(d.nuance||{}),
        fx: uniq([...(d.nuance?.fx||[]), ...(hit.fx||[])]),
        mix: uniq([...(d.nuance?.mix||[]), ...(hit.mix||[])]),
      },
      layers: {
        ...(d.layers||layers),
        instruments: [
          { id: uid("grp"), name: "Suggested Instruments", items: (hit.instruments||[]).map(n=>({name:n, level:70, position:"center"})) },
          ...(d.layers?.instruments||[])
        ]
      }
    }))
  }

  const renderGroups = (kind, options) => (
    <div className="sectionCard">
      <div className="row" style={{justifyContent:'space-between'}}>
        <div className="muted small">{kind === "voices" ? "Voices" : "Instruments"} (groups)</div>
        <button className="btn small" type="button" onClick={()=>addGroup(kind)}>Add group</button>
      </div>

      <div style={{marginTop:10}} className="cardlist">
        {(layers[kind]||[]).map(g => (
          <div key={g.id} className="sectionCard" style={{background:'rgba(14,15,22,.55)'}}>
            <div className="row" style={{justifyContent:'space-between'}}>
              <input type="text" value={g.name} onChange={(e)=>updateGroup(kind, g.id, {name: e.target.value})} />
              <button className="btn small danger" type="button" onClick={()=>removeGroup(kind, g.id)}>Remove</button>
            </div>

            <div className="row" style={{marginTop:10}}>
              <select defaultValue="" onChange={(e)=>{ const v=e.target.value; if(v) addItem(kind, g.id, v); e.target.value=""; }}>
                <option value="">+ add item...</option>
                {options.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>

            <div className="cardlist" style={{marginTop:10}}>
              {(g.items||[]).map(it => (
                <div key={it.name} className="kpi" style={{alignItems:'flex-start'}}>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:800}}>{it.name}</div>
                    <div className="row" style={{marginTop:8}}>
                      <span className="pill">Level</span>
                      <input type="range" min="0" max="100" value={it.level ?? 70} onChange={(e)=>updateItem(kind, g.id, it.name, {level:Number(e.target.value)})} style={{flex:1}} />
                      <span className="pill">{it.level ?? 70}</span>
                    </div>
                    <div className="row" style={{marginTop:8}}>
                      <span className="pill">Position</span>
                      {positions.map(p => (
                        <button key={p} className={'chip' + ((it.position||'center')===p ? ' on' : '')} type="button"
                          onClick={()=>updateItem(kind, g.id, it.name, {position:p})}>{p}</button>
                      ))}
                    </div>
                  </div>
                  <button className="btn small danger" type="button" onClick={()=>removeItem(kind, g.id, it.name)}>✕</button>
                </div>
              ))}
              {(!(g.items||[]).length) ? <div className="muted small">No items.</div> : null}
            </div>
          </div>
        ))}
        {(!(layers[kind]||[]).length) ? <div className="muted small">No groups yet.</div> : null}
      </div>
    </div>
  )

  return (
    <div className="section">
      <div className="label">Instruments & Voices (mix corpus)</div>
      <div className="sub">Define what exists in the mix globally. Next step: per-section lane automation of these layers.</div>

      <div className="row" style={{marginTop:10}}>
        <button className="btn small" type="button" onClick={applyGenreSuggestions}>Auto-suggest from genre</button>
        <span className="pill">position = front/center/back/wide/mono</span>
      </div>

      <div style={{marginTop:12}} className="two">
        <div>{renderGroups("instruments", dict.instruments || [])}</div>
        <div>{renderGroups("voices", dict.voices || [])}</div>
      </div>
    </div>
  )
}
