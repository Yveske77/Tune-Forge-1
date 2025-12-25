import React, { useMemo, useState } from 'react'
import { usePromptStore } from '../store'

// Lightweight audio analysis in-browser.
// Outputs: estimated BPM, energy curve stats, brightness (spectral centroid-ish proxy), and auto arrangement suggestions.

function median(arr){
  const a = [...arr].sort((x,y)=>x-y)
  if(!a.length) return 0
  const mid = Math.floor(a.length/2)
  return a.length%2 ? a[mid] : (a[mid-1]+a[mid])/2
}

async function decodeAudio(file){
  const ctx = new (window.AudioContext || window.webkitAudioContext)()
  const ab = await file.arrayBuffer()
  const buf = await ctx.decodeAudioData(ab)
  return { ctx, buf }
}

function makeEnvelope(channelData, hop=1024){
  const env = []
  for(let i=0;i<channelData.length;i+=hop){
    let sum = 0
    const end = Math.min(i+hop, channelData.length)
    for(let j=i;j<end;j++){
      const v = channelData[j]
      sum += v*v
    }
    env.push(Math.sqrt(sum/(end-i)))
  }
  return env
}

function autocorrelateForBpm(env, sampleRate, hop){
  // env sampled at sampleRate/hop Hz. Estimate BPM via peak lag in plausible range.
  const fs = sampleRate / hop
  const minBpm = 70, maxBpm = 180
  const minLag = Math.floor(fs * 60 / maxBpm)
  const maxLag = Math.floor(fs * 60 / minBpm)

  // Normalize env
  const mean = env.reduce((a,b)=>a+b,0)/env.length
  const x = env.map(v=>v-mean)

  let bestLag = 0
  let best = -Infinity
  for(let lag=minLag; lag<=maxLag; lag++){
    let sum = 0
    for(let i=0;i<x.length-lag;i++){
      sum += x[i]*x[i+lag]
    }
    if(sum > best){
      best = sum
      bestLag = lag
    }
  }
  if(!bestLag) return null
  const bpm = 60 * fs / bestLag
  return Math.round(bpm)
}

function suggestSections(env){
  // Simple segmentation: look for large energy changes.
  const n = env.length
  if(n < 60) return null

  const m = median(env)
  const hi = m * 1.35
  const lo = m * 0.85

  // Identify regions above hi as choruses/drops, below lo as intros/breakdowns.
  const regions = []
  let cur = null
  for(let i=0;i<n;i++){
    const state = env[i] > hi ? "HIGH" : env[i] < lo ? "LOW" : "MID"
    if(!cur || cur.state !== state){
      if(cur) regions.push(cur)
      cur = {state, start:i, end:i}
    }else{
      cur.end = i
    }
  }
  if(cur) regions.push(cur)

  // Pick up to 6 coarse blocks
  const blocks = []
  const push = (type,label) => blocks.push({type,label})
  push("Intro","Intro")
  // Find first HIGH region
  const firstHigh = regions.find(r=>r.state==="HIGH")
  if(firstHigh){
    push("Verse","Verse 1")
    push("Chorus","Chorus")
    push("Verse","Verse 2")
    push("Chorus","Chorus 2")
    push("Outro","Outro")
  }else{
    push("Verse","Verse")
    push("Bridge","Bridge")
    push("Outro","Outro")
  }
  return blocks.slice(0,6)
}

export default function ReferencePanel(){
  const doc = usePromptStore(s => s.doc)
  const setArchitecture = usePromptStore(s => s.setArchitecture)
  const updateSection = usePromptStore(s => s.updateSection)
  const addSection = usePromptStore(s => s.addSection)
  const reorderSections = usePromptStore(s => s.reorderSections)
  const setMeta = usePromptStore(s => s.setMeta)

  const [url, setUrl] = useState(doc.meta?.referenceUrl || "")
  const [busy, setBusy] = useState(false)
  const [report, setReport] = useState(null)

  const saveUrl = () => {
    setMeta({ referenceUrl: url })
  }

  const analyzeFile = async (file) => {
    setBusy(true)
    setReport(null)
    try{
      const { ctx, buf } = await decodeAudio(file)
      const ch0 = buf.getChannelData(0)
      const hop = 1024
      const env = makeEnvelope(ch0, hop)
      const bpm = autocorrelateForBpm(env, buf.sampleRate, hop)

      // crude brightness proxy: ratio of abs diff (more high freq content -> more rapid changes)
      let diffSum = 0
      for(let i=1;i<ch0.length;i++) diffSum += Math.abs(ch0[i]-ch0[i-1])
      const brightness = diffSum / ch0.length

      const blocks = suggestSections(env)
      setReport({
        file: file.name,
        durationSec: Math.round(buf.duration),
        bpm,
        brightness: Number(brightness.toFixed(4)),
        blocks
      })

      if(bpm) setArchitecture({ tempoBpm: bpm })

      // If blocks exist, offer quick apply by generating empty structure (preserve existing if user wants)
      // We'll just set labels/types on existing sections up to blocks length.
      if(blocks?.length){
        const current = doc.arrangement || []
        const next = [...current]
        for(let i=0;i<blocks.length;i++){
          if(next[i]){
            updateSection(next[i].id, { type: blocks[i].type, label: blocks[i].label })
          }else{
            addSection({
              id: `sec_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`,
              type: blocks[i].type,
              label: blocks[i].label,
              content: "",
              modifiers: [],
              emphasis: [],
              tension: blocks[i].type === "Chorus" ? 80 : blocks[i].type === "Intro" ? 20 : 50,
            })
          }
        }
        // reorder by current order (already)
      }

      ctx.close?.()
    }catch(e){
      setReport({ error: String(e) })
    }finally{
      setBusy(false)
    }
  }

  return (
    <div className="section">
      <div className="label">Reference Track (optional)</div>
      <div className="sub">Drop a reference audio file for lightweight analysis (BPM estimate + coarse structure suggestions). URLs are stored but not fetched automatically.</div>

      <div className="two" style={{marginTop:10}}>
        <div>
          <div className="muted small" style={{marginBottom:6}}>Reference URL</div>
          <input type="text" value={url} onChange={(e)=>setUrl(e.target.value)} placeholder="https://..." />
          <div className="row" style={{marginTop:8}}>
            <button className="btn small" type="button" onClick={saveUrl}>Save URL</button>
          </div>
        </div>

        <div>
          <div className="muted small" style={{marginBottom:6}}>Upload audio</div>
          <label className="btn small" style={{cursor:'pointer'}}>
            {busy ? "Analyzing..." : "Choose file"}
            <input type="file" accept="audio/*" hidden disabled={busy} onChange={(e)=>{
              const f = e.target.files?.[0]
              if(f) analyzeFile(f)
              e.target.value = ""
            }} />
          </label>
          <div className="muted small" style={{marginTop:8}}>Works best on full-length mixes (30s+).</div>
        </div>
      </div>

      {report ? (
        <div style={{marginTop:12}} className="out">
          {report.error ? `Analysis error: ${report.error}` : (
`Reference: ${report.file}
Duration: ${report.durationSec}s
Estimated BPM: ${report.bpm ?? "—"}
Brightness proxy: ${report.brightness}

Suggested structure: ${report.blocks ? report.blocks.map(b=>b.label).join(" → ") : "—"}
`)
          )}
        </div>
      ) : null}
    </div>
  )
}
