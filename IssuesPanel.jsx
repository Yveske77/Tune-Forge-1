import React from 'react'

function dotClass(level){
  if(level === "error") return "kdot bad"
  if(level === "warn") return "kdot warn"
  return "kdot"
}

export default function IssuesPanel({ issues = [] }){
  const counts = issues.reduce((acc, it) => {
    acc[it.level] = (acc[it.level] || 0) + 1
    return acc
  }, {})

  return (
    <div className="panel">
      <h2>Status</h2>
      <div className="sub">Guardrails so your prompt doesn’t become soup.</div>
      <div className="hr"></div>

      <div className="row" style={{justifyContent:'space-between'}}>
        <span className="pill">Errors: {counts.error || 0}</span>
        <span className="pill">Warnings: {counts.warn || 0}</span>
        <span className="pill">Info: {counts.info || 0}</span>
      </div>

      <div className="hr"></div>

      <div className="cardlist">
        {issues.length ? issues.map((it, idx) => (
          <div key={idx} className="kpi">
            <div className={dotClass(it.level)}></div>
            <div>
              <div style={{fontWeight:800, textTransform:'capitalize'}}>{it.level}</div>
              <div className="muted small">{it.message}</div>
            </div>
          </div>
        )) : (
          <div className="muted small">No issues.</div>
        )}
      </div>
    </div>
  )
}
