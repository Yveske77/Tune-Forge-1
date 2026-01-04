import React, { useEffect, useMemo, useRef } from 'react'
import { usePromptStore } from './store'
import { computeAdaptiveLanes, buildMemory, computePhase } from './adaptiveEngine'

function lerp(a,b,t){ return a + (b-a)*t }
function clamp(x,a,b){ return Math.max(a, Math.min(b, x)) }

function createAdaptiveSection(block, sections, index, mode = 'insert') {
  const memory = buildMemory(sections, index);
  const phase = computePhase(index, sections.length + (mode === 'insert' ? 1 : 0));

  // Previous section context
  const prevSec = sections[index - 1];
  // Next section context (if inserting, it's the one at index; if replacing, it's the one after?)
  // For simplicity, let's say next is sections[index] (which is being shifted or replaced)
  const nextSec = sections[index];

  const ctx = {
      prev: prevSec?.lanes,
      next: nextSec?.lanes,
      prevType: prevSec?.type,
      phase,
      memory
  };

  const adaptiveLanes = computeAdaptiveLanes(block, ctx);

  const id = `sec_${Date.now()}_${Math.floor(Math.random()*1e6)}`
  const type = block.sectionType || 'Verse'
  const label = block.label || type

  return {
    section: {
        id,
        type,
        label,
        content: '',
        modifiers: block.modifiers || [],
        emphasis: block.emphasis ? [block.emphasis] : [],
        tension: adaptiveLanes.energy,
        lanes: adaptiveLanes,
    },
    isAdaptive: !!block.adaptiveRules,
    lanesComputed: adaptiveLanes,
    lanesPrev: ctx.prev
  }
}

export default function TubeTimeline(){
  const canvasRef = useRef(null)
  const doc = usePromptStore(s => s.doc)
  const preview = usePromptStore(s => s.preview)
  const updateBlockPreview = usePromptStore(s => s.updateBlockPreview)
  const cancelBlockPreview = usePromptStore(s => s.cancelBlockPreview)
  const insertSectionAtIndexActiveVariant = usePromptStore(s => s.insertSectionAtIndexActiveVariant)
  const replaceSectionAtIndexActiveVariant = usePromptStore(s => s.replaceSectionAtIndexActiveVariant)
  const setSectionLaneValue = usePromptStore(s => s.setSectionLaneValue)
  const setLayerAutomation = usePromptStore(s => s.setLayerAutomation)

  const paint = doc.ui?.paint || { enabled:false, mode:'lane', laneKey:'energy', kind:'instruments', groupId:'', itemName:'', snap:true }

  const active = doc.activeVariant || 'A'
  const tracks = doc.arrangementTracks || { A: doc.arrangement || [], B: [] }
  const sections = tracks[active] || []
  const lanes = doc.lanes || { energy:60, density:55, brightness:50, vocalPresence:65 }
  const sla = doc.sectionLayerAutomation || {}

  const variants = doc.arrangementVariants || { A:{enabled:true}, B:{enabled:false} }

  const laneDefs = useMemo(() => ([
    { key:"energy", label:"Energy" },
    { key:"density", label:"Density" },
    { key:"brightness", label:"Brightness" },
    { key:"vocalPresence", label:"Vocal" },
  ]), [])


    function topItemsForSection(secId){
      const secAuto = sla[secId] || {}
      const items = []
      for(const kind of ["voices","instruments"]){
        const kk = secAuto[kind] || {}
        for(const k of Object.keys(kk)){
          const v = kk[k]
          const nm = k.split("::").slice(1).join("::")
          const lvl = typeof v.level === "number" ? v.level : 0
          if(lvl > 0) items.push({name: nm, level: lvl, kind, position: v.position})
        }
      }
      items.sort((a,b)=>b.level-a.level)
      return items.slice(0, 6)
    }




  function computeHoverFromX(x, width, count){
    const pad = 14
    const left = pad
    const right = width - pad
    const t = clamp((x - left) / Math.max(1, (right-left)), 0, 1)
    const segW = (right-left) / Math.max(1, count)
    const raw = t * count
    const idx = clamp(Math.floor(raw), 0, Math.max(0, count-1))
    const local = (raw - idx) // 0..1 within segment
    // if near edges of segment => insert, else replace
    const edge = 0.18
    const mode = (local < edge || local > (1-edge)) ? "insert" : "replace"
    const insertIndex = (local < 0.5) ? idx : idx+1
    return { idx, mode, insertIndex }
  }

  function buildPreviewSections(base, insertIndex, mode, block){
    const { section, isAdaptive, lanesComputed, lanesPrev } = createAdaptiveSection(block, base, insertIndex, mode);

    const arr = [...base]
    if(mode === "replace" && base.length){
      const rIdx = clamp(insertIndex, 0, base.length-1)
      arr[rIdx] = { ...arr[rIdx], ...section, id: arr[rIdx].id } // keep id for stable feel
    } else {
      const i = clamp(insertIndex, 0, base.length)
      arr.splice(i, 0, section)
    }
    return {
        arr,
        section,
        computed: {
            isAdaptive,
            lanesComputed,
            lanesPrev,
            previewSections: arr,
            insertIndex,
            mode
        }
    }
  }


  function sectionIndexAt(x, width, count){
    if(count <= 0) return -1
    const pad = 14
    const left = pad
    const right = width - pad
    const t = (x - left) / Math.max(1, (right-left))
    const idx = Math.round(t * (count-1))
    return Math.max(0, Math.min(count-1, idx))
  }

  function valueAt(y, laneTop, laneHeight){
    // y higher = bigger value
    const minY = laneTop + 10
    const maxY = laneTop + laneHeight - 10
    const t = 1 - ((y - minY) / Math.max(1, (maxY-minY)))
    return Math.max(0, Math.min(100, Math.round(t*100)))
  }

  function paintAt(clientX, clientY){
    if(!paint.enabled) return
    const c = canvasRef.current
    if(!c) return
    const rect = c.getBoundingClientRect()
    const x = clientX - rect.left
    const y = clientY - rect.top

    const secs = sections
    const n = Math.max(2, secs.length)
    const idx = sectionIndexAt(x, rect.width, n)
    const sec = secs[idx]
    if(!sec) return

    // Lane mapping: split canvas into 4 equal lanes like renderer
    const pad = 14
    const top = pad
    const bottom = rect.height - pad
    const laneCount = 4
    const laneHeight = (bottom-top) / laneCount
    const laneDefs = ["energy","density","brightness","vocalPresence"]
    const laneIndex = paint.mode === "lane" ? laneDefs.indexOf(paint.laneKey) : 0
    const li = Math.max(0, Math.min(laneCount-1, laneIndex))
    const laneTop = top + li*laneHeight
    const v = valueAt(y, laneTop, laneHeight)

    if(paint.mode === "lane"){
      setSectionLaneValue(sec.id, paint.laneKey, v)
    } else {
      if(!paint.groupId || !paint.itemName) return
      setLayerAutomation(sec.id, paint.kind, paint.groupId, paint.itemName, { level: v })
    }
  }



  useEffect(() => {
    const onKey = (e) => {
      if(e.key === 'Escape' && preview?.active){
        cancelBlockPreview()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [preview?.active])

  useEffect(() => {
    const c = canvasRef.current
    if(!c) return
    const ctx = c.getContext("2d")
    const dpr = window.devicePixelRatio || 1
    const w = c.clientWidth
    const h = c.clientHeight
    c.width = Math.floor(w*dpr)
    c.height = Math.floor(h*dpr)
    ctx.setTransform(dpr,0,0,dpr,0,0)

    ctx.clearRect(0,0,w,h)
    ctx.fillStyle = "rgba(7,7,11,0.35)"
    ctx.fillRect(0,0,w,h)

    const pad = 14
    const left = pad
    const right = w - pad
    const top = pad
    const bottom = h - pad

    const depth = 0.55
    const n = Math.max(2, sections.length)
    const laneCount = laneDefs.length
    const laneHeight = (bottom-top) / laneCount

    function xFor(i){
      const t = i/(n-1)
      const persp = lerp(1, depth, t)
      return lerp(left, right, t) * persp + left*(1-persp)
    }

    for(let li=0; li<laneCount; li++){
      const y0 = top + li*laneHeight
      ctx.fillStyle = li%2 ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.035)"
      ctx.fillRect(left, y0, right-left, laneHeight)
      ctx.fillStyle = "rgba(232,232,242,0.45)"
      ctx.font = "12px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono','Courier New', monospace"
      ctx.fillText(laneDefs[li].label, left+8, y0+16)
    }

    function drawLaneFor(secs, key, alpha=1){
      ctx.beginPath()
      for(let i=0;i<n;i++){
        const sec = (secs[i] || {})
        const local = (sec.lanes && typeof sec.lanes[key] === "number") ? sec.lanes[key] : lanes[key]
        const v = clamp(local ?? 50, 0, 100)
        const li = laneDefs.findIndex(l=>l.key===key)
        const y0 = top + li*laneHeight
        const y = y0 + laneHeight - (v/100)*(laneHeight-24) - 10
        const x = xFor(i)
        if(i===0) ctx.moveTo(x,y)
        else ctx.lineTo(x,y)
      }
      ctx.strokeStyle = "rgba(255,255,255,1)"
      ctx.globalAlpha = alpha
      ctx.lineWidth = 2.25
      ctx.stroke()
      ctx.globalAlpha = 1
    }

    for(let i=0;i<n;i++){
      const t = i/(n-1)
      const persp = lerp(1, depth, t)
      const segW = (right-left)/n * persp
      const x = xFor(i) - segW/2
      ctx.fillStyle = "rgba(183,92,255,0.05)"
      ctx.fillRect(x, top, segW, bottom-top)
      // Layer presence mini-bars
      const secId = sections[i]?.id
      if(secId){
        const tops = topItemsForSection(secId)
        const barH = 6
        const startY = top + 22
        tops.forEach((it, bi) => {
          const bw = (segW-10) * (it.level/100)
          ctx.globalAlpha = it.kind === "voices" ? 0.35 : 0.18
          ctx.fillStyle = "rgba(255,255,255,1)"
          ctx.fillRect(x+5, startY + bi*(barH+3), bw, barH)
          ctx.globalAlpha = 1
        })
      }


      const label = (sections[i]?.label || sections[i]?.type || `S${i+1}`)
      ctx.save()
      ctx.translate(x+6, bottom-10)
      ctx.rotate(-Math.PI/2)
      ctx.fillStyle = "rgba(168,169,194,0.65)"
      ctx.font = "11px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono','CourierNew', monospace"
      ctx.fillText(label.slice(0,22), 0, 0)
      ctx.restore()
    }

    drawLaneFor(sections, "energy", 0.85)
    drawLaneFor(sections, "density", 0.65)
    drawLaneFor(sections, "brightness", 0.55)
    drawLaneFor(sections, "vocalPresence", 0.5)

    // PREVIEW ghost curves (dashed) for block placement
    if(preview?.active && preview?.computed?.previewSections){
      const pSecs = preview.computed.previewSections
      ctx.save()
      ctx.setLineDash([8,6])
      // slightly brighter overlay
      drawLaneFor(pSecs, "energy", 0.38)
      drawLaneFor(pSecs, "density", 0.28)
      drawLaneFor(pSecs, "brightness", 0.22)
      drawLaneFor(pSecs, "vocalPresence", 0.20)
      ctx.restore()

      // placement indicator line/box
      // ghost section tile drawn inside timeline
      const b = preview.block
      const label = b?.label || b?.sectionType || "Block"
      ctx.save()
      ctx.globalAlpha = 0.85
      const pad2 = 10
      const tileX = x + 10
      const tileY = pad + 10
      const tileW = Math.min(240, Math.max(120, segW - 20))
      const tileH = 44
      ctx.fillStyle = "rgba(12,13,20,.75)"
      ctx.strokeStyle = "rgba(255,255,255,.18)"
      // rounded rect
      const rr = (x,y,w,h,r)=>{ 
        ctx.beginPath()
        ctx.moveTo(x+r,y)
        ctx.arcTo(x+w,y,x+w,y+h,r)
        ctx.arcTo(x+w,y+h,x,y+h,r)
        ctx.arcTo(x,y+h,x,y,r)
        ctx.arcTo(x,y,x+w,y,r)
        ctx.closePath()
      }
      rr(tileX, tileY, tileW, tileH, 12)
      ctx.fill()
      rr(tileX, tileY, tileW, tileH, 12)
      ctx.stroke()
      ctx.fillStyle = "rgba(255,255,255,.92)"
      ctx.font = "bold 13px ui-sans-serif, system-ui"
      ctx.fillText(label, tileX+12, tileY+18)
      ctx.fillStyle = "rgba(255,255,255,.7)"
      ctx.font = "12px ui-sans-serif, system-ui"
      ctx.fillText((preview.mode==='replace' ? 'Replace' : 'Insert') + (preview.computed?.isAdaptive ? ' · ⚡' : ''), tileX+12, tileY+36)
      ctx.restore()

      const pad = 14
      const left = pad
      const right = w - pad
      const segW = (right-left) / Math.max(1, sections.length || 1)
      const hi = preview.hoverIndex ?? 0
      const x = left + hi*segW
      ctx.save()
      ctx.globalAlpha = 0.5
      ctx.strokeRect(x+2, pad+2, Math.max(10, segW-4), (h-2*pad)-4)
      ctx.restore()
    }


    // Overlay: draw the other track (if enabled) with lower alpha, aligned to its own section count.
    const Aon = doc.arrangementVariants?.A?.enabled ?? true
    const Bon = doc.arrangementVariants?.B?.enabled ?? false
    const otherKey = active === "A" ? "B" : "A"
    const otherOn = otherKey === "A" ? Aon : Bon
    const other = tracks[otherKey] || []

    if(otherOn && other.length){
      // draw curves lightly
      drawLaneFor(other, "energy", 0.22)
      drawLaneFor(other, "density", 0.18)
      drawLaneFor(other, "brightness", 0.15)
      drawLaneFor(other, "vocalPresence", 0.12)
    }

    const enabled = Object.entries(variants).filter(([k,v])=>v?.enabled).map(([k])=>k).join(", ")
    ctx.fillStyle = "rgba(168,169,194,0.6)"
    ctx.font = "12px ui-sans-serif, system-ui"
    ctx.fillText(`Overlay: ${enabled || "A"}`, right-160, top+16)
  }, [sections, lanes, laneDefs, variants])

  return (
    <div className="section">
      <div className="label">3D Tube Timeline</div>
      <div className="sub">Pseudo-3D overview of the song through time. Each lane is a macro control; sections can override.</div>
      <div style={{height:260, borderRadius:16, overflow:'hidden', border:'1px solid var(--stroke)', background:'rgba(7,7,11,.35)'}}>
        <canvas ref={canvasRef} style={{width:'100%', height:'100%', touchAction:'none', cursor: (preview?.active ? 'copy' : (doc.ui?.paint?.enabled ? 'crosshair' : 'default'))}}
          onPointerDown={(e)=>{ e.currentTarget.setPointerCapture(e.pointerId); paintAt(e.clientX, e.clientY) }}
          onDragOver={(e)=>{
            if(!preview?.active) return
            e.preventDefault()
            const rect = e.currentTarget.getBoundingClientRect()
            const x = e.clientX - rect.left
            const count = Math.max(1, sections.length || 1)
            const { idx, mode, insertIndex } = computeHoverFromX(x, rect.width, count)
            const { computed } = buildPreviewSections(sections, insertIndex, mode, preview.block)
            updateBlockPreview(idx, mode, computed)
          }}
          onDragLeave={(e)=>{
            // keep preview active but clear hover if leaving canvas
            if(preview?.active){ updateBlockPreview(null, null, null) }
          }}
          onDrop={(e)=>{
            if(!preview?.active) return
            e.preventDefault()
            const comp = preview?.computed
            const insertIndex = comp?.insertIndex
            const mode = preview?.mode
            const block = preview?.block
            if(block && typeof insertIndex === 'number'){
              // Re-compute to ensure we capture the state at drop moment (same as preview)
              const { section } = createAdaptiveSection(block, sections, insertIndex, mode)
              if(mode === 'replace' && sections.length){
                replaceSectionAtIndexActiveVariant(insertIndex, section)
              } else {
                insertSectionAtIndexActiveVariant(insertIndex, section)
              }
            }
            cancelBlockPreview()
          }}
          onPointerMove={(e)=>{ if(e.buttons===1) paintAt(e.clientX, e.clientY) }}
        />
      </div>
    </div>
  )
}
