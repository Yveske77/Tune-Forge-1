import React, { useMemo, useState } from 'react'

function normalize(s){ return String(s||'').trim() }

export default function TagPicker({
  label,
  options = [],
  selected = [],
  max = 999,
  onChange,
  placeholder = "Add tag…"
}){
  const [q, setQ] = useState("")
  const selectedSet = useMemo(() => new Set(selected), [selected])

  const filtered = useMemo(() => {
    const qq = q.toLowerCase()
    const base = options.filter(o => o.toLowerCase().includes(qq))
    const custom = normalize(q) && !options.some(o => o.toLowerCase() === qq) ? [normalize(q)] : []
    return [...custom, ...base].slice(0, 18)
  }, [q, options])

  const canAddMore = selected.length < max

  const add = (tag) => {
    const t = normalize(tag)
    if(!t) return
    if(selectedSet.has(t)) return
    if(!canAddMore) return
    onChange([...selected, t])
    setQ("")
  }

  const remove = (tag) => onChange(selected.filter(t => t !== tag))

  return (
    <div>
      {label ? <div className="label">{label}</div> : null}

      <div className="row" style={{marginBottom:8}}>
        {selected.map(t => (
          <button key={t} className="chip on" type="button" onClick={() => remove(t)} title="Remove">
            {t} ✕
          </button>
        ))}
        {selected.length === 0 ? <span className="muted small">None selected.</span> : null}
      </div>

      <div className="row">
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={placeholder}
        />
        <button className="btn small" type="button" onClick={() => add(q)} disabled={!normalize(q) || !canAddMore}>
          Add
        </button>
        {max !== 999 ? <span className="pill">Max {max}</span> : null}
      </div>

      {normalize(q) ? (
        <div className="row" style={{marginTop:8}}>
          {filtered.map(o => (
            <button key={o} className="chip" type="button" onClick={() => add(o)}>
              {o}
            </button>
          ))}
        </div>
      ) : null}

      {!canAddMore ? <div className="muted small" style={{marginTop:6}}>Reached max tags.</div> : null}
    </div>
  )
}
