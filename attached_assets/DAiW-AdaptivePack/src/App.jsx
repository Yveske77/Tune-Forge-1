import React, { useMemo, useState } from 'react'
import MetaPanel from './components/MetaPanel'
import ArchitecturePanel from './components/ArchitecturePanel'
import NuancePanel from './components/NuancePanel'
import ArrangementBuilder from './components/ArrangementBuilder'
import LyricsPanel from './components/LyricsPanel'
import DynamicVarsPanel from './components/DynamicVarsPanel'
import ReferencePanel from './components/ReferencePanel'
import TubeTimeline from './components/TubeTimeline'
import VariantBar from './components/VariantBar'
import PaintConsole from './components/PaintConsole'
import PartBlocksPanel from './components/PartBlocksPanel'
import GhostCard from './components/GhostCard'
import LanePanel from './components/LanePanel'
import LayersPanel from './components/LayersPanel'
import LayerAutomationPanel from './components/LayerAutomationPanel'
import PreviewPanel from './components/PreviewPanel'
import ExportPanel from './components/ExportPanel'
import IssuesPanel from './components/IssuesPanel'
import Toast from './components/Toast'
import { compileToSuno } from './compiler/suno'
import { validateDoc } from './utils/validator'
import { usePromptStore } from './store'

function downloadText(filename, text){
  const blob = new Blob([text], {type:"text/plain;charset=utf-8"})
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url; a.download = filename
  document.body.appendChild(a); a.click(); a.remove()
  URL.revokeObjectURL(url)
}

export default function App(){
  const preview = usePromptStore(s => s.preview)

  const doc = usePromptStore(s => s.doc)
  const compiledSuno = useMemo(() => compileToSuno(doc), [doc])
  const lyrics = useMemo(() => (doc.lyrics?.text || "").trim() || "(no lyrics provided)", [doc])
  const issues = useMemo(() => validateDoc(doc), [doc])

  const [toastMsg, setToastMsg] = useState("")

  const copyText = async (text) => {
    try{
      await navigator.clipboard.writeText(text || "")
      setToastMsg("Copied")
    }catch{
      downloadText("text.txt", text || "")
      setToastMsg("Clipboard blocked — downloaded text.txt")
    }
  }

  const downloadAssets = (promptText, lyricsText) => {
    const base = (doc.meta.title || "song-assets").replace(/[^\w\-]+/g,"_")
    downloadText(`${base}_prompt.txt`, promptText || "")
    downloadText(`${base}_lyrics.txt`, lyricsText || "")
    setToastMsg("Downloaded")
  }

  return (
    <div className="container">
      <div className="topbar">
        <div className="brand">
          <div className="logo" aria-hidden="true"></div>
          <div>
            <div>Song AI Farm</div>
            <div className="muted small" style={{textTransform:'none', letterSpacing:0}}>Modular Prompt Generator (Suno + Udio + Generic)</div>
          </div>
        </div>
        <div className="row">
          <span className="pill">More options, less suffering.</span>
        </div>
      </div>

      <div className="grid">
        <div className="panel">
          <h2>Build</h2>
          <div className="sub">Hard params vs nuance + section timeline + optional reference-track analysis.</div>

          <MetaPanel />
          <ReferencePanel />
          <VariantBar />
          <PaintConsole />
          <TubeTimeline />
          <LanePanel />
          <ArchitecturePanel />
          <NuancePanel />
          <LayersPanel />
          <PartBlocksPanel />
          <LayerAutomationPanel />
          <ArrangementBuilder />
          <DynamicVarsPanel />
          <LyricsPanel />
        </div>

        <div style={{display:'flex',flexDirection:'column',gap:14}}>
          <PreviewPanel onCopyPrompt={copyText} onDownloadAssets={downloadAssets} />
          <ExportPanel compiledPrompt={compiledSuno} lyrics={lyrics} toast={(m)=>setToastMsg(m)} />
          <IssuesPanel issues={issues} />
        </div>
      </div>

      <Toast message={toastMsg} onClear={()=>setToastMsg("")} />
    </div>
  )
}
