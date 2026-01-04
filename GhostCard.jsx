import React, { useEffect, useMemo, useState } from 'react'
import { usePromptStore } from './store'

function clamp(n, a, b){ return Math.max(a, Math.min(b, n)) }

export default function GhostCard(){
  const preview = usePromptStore(s => s.preview)
  const [vp, setVp] = useState({ w: window.innerWidth, h: window.innerHeight })

  useEffect(() => {
    const onR = () => setVp({ w: window.innerWidth, h: window.innerHeight })
    window.addEventListener('resize', onR)
    return () => window.removeEventListener('resize', onR)
  }, [])

  if(!preview?.active || !preview?.block) return null

  const c = preview.computed?.cursor || preview.cursor
  if(!c) return null

  const block = preview.block
  const mode = preview.mode || preview.computed?.mode || null

  const lanesComputed = preview.computed?.lanesComputed || block.lanes || {}
  const lanesPrev = preview.computed?.lanesPrev || null

  const cardW = 320
  const cardH = 210
  const margin = 12
  const left = clamp(c.x + 14, margin, vp.w - cardW - margin)
  const top  = clamp(c.y + 14, margin, vp.h - cardH - margin)

  const style = {
    position: 'fixed',
    left,
    top,
    width: cardW,
    zIndex: 9999,
    pointerEvents: 'none',
    transform: 'translate3d(0,0,0)'
  }

  const badge = (mode === 'replace') ? 'Replace' : (mode === 'insert' ? 'Insert' : 'Place')

  const laneKeys = ['energy','density','brightness','vocalPresence']
  const rows = useMemo(() => laneKeys.map(k => {
    const v = Math.round(lanesComputed?.[k] ?? 0)
    const p = lanesPrev ? Math.round(lanesPrev?.[k] ?? 0) : null
    return { k, v, p }
  }), [preview?.computed, preview?.block])

  return (
    <div style={style} className="ghostCard">
      <div className="row" style={{justifyContent:'space-between', gap:10}}>
        <div style={{fontWeight:900}}>{block.label}</div>
        <span className={"pill " + (mode==='replace' ? 'danger' : 'ok')}>{badge}</span>
      </div>

      <div className="muted small" style={{marginTop:6}}>
        {block.sectionType || 'Section'}{block.emphasis ? ` · *${block.emphasis}*` : ''}{preview.computed?.isAdaptive ? ' · ⚡ adaptive' : ''}
      </div>

      {(block.modifiers?.length ? (
        <div className="muted small" style={{marginTop:8, maxWidth:cardW-24}}>
          {(block.modifiers || []).slice(0,5).join(' · ')}{block.modifiers.length>5 ? '…' : ''}
        </div>
      ) : null)}

      <div className="ghostBars" style={{marginTop:10}}>
        {rows.map(({k,v,p}) => (
          <div key={k} className="ghostBarRow">
            <span className="ghostKey">{k}</span>
            <div className="ghostTrack"><div className="ghostFill" style={{width: `${clamp(v,0,100)}%`}} /></div>
            <span className="ghostVal">{p===null ? v : `${p}→${v}`}</span>
          </div>
        ))}
      </div>

      {preview.computed?.note ? (
        <div className="muted small" style={{marginTop:10, opacity:.8}}>
          {preview.computed.note}
        </div>
      ) : null}
    </div>
  )
}
