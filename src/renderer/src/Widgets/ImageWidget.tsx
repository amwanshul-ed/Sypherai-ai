import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  RiShieldFlashLine,
  RiCloseLine,
  RiRefreshLine,
  RiFolderOpenLine,
  RiDownloadLine,
  RiAlertLine,
  RiSettings4Line,
  RiSparklingFill,
  RiCheckboxCircleFill
} from 'react-icons/ri'
import { handleImageGeneration } from '@renderer/tools/Image-generator'

type Phase = 'idle' | 'loading' | 'success' | 'error'

export default function ImageWidget() {
  const [phase, setPhase] = useState<Phase>('idle')
  const [imageSrc, setImageSrc] = useState('')
  const [savedPath, setSavedPath] = useState('')
  const [prompt, setPrompt] = useState('')
  const [statusText, setStatusText] = useState('')
  const [debugMsg, setDebugMsg] = useState('')
  const [retryInfo, setRetryInfo] = useState<{
    attempt: number
    total: number
    model?: string
  } | null>(null)

  const promptRef = useRef('')

  useEffect(() => {
    const handleEvent = (event: any) => {
      const detail = event.detail || {}
      const { url, prompt: incomingPrompt, loading, error, errorMessage, savedPath, retry } = detail

      if (incomingPrompt) {
        promptRef.current = incomingPrompt
        setPrompt(incomingPrompt)
      }

      if (retry) {
        setRetryInfo(retry)
        const modelTag = retry.model ? ` Â· ${String(retry.model).toUpperCase()}` : ''
        setStatusText(`ROTATING ENGINE${modelTag} Â· ATTEMPT ${retry.attempt}/${retry.total}`)
        return
      }

      if (loading) {
        setPhase('loading')
        setRetryInfo(null)
        setImageSrc('')
        setSavedPath('')
        setStatusText('CRAFTING NEURAL VISIONâ€¦')
        return
      }

      if (error) {
        setPhase('error')
        setRetryInfo(null)
        setDebugMsg(errorMessage || 'Unknown engine error.')
        return
      }

      if (url) {
        setPhase('success')
        setRetryInfo(null)
        setImageSrc(url)
        setSavedPath(savedPath || '')
        setStatusText(savedPath ? 'SAVED TO GALLERY' : 'IMAGE READY â€” GALLERY SAVE FAILED')
      }
    }

    window.addEventListener('image-gen', handleEvent)
    return () => window.removeEventListener('image-gen', handleEvent)
  }, [])

  const close = () => {
    setPhase('idle')
    setRetryInfo(null)
  }

  const regenerate = () => {
    const target = promptRef.current
    if (!target) return
    handleImageGeneration(target).catch(() => {})
  }

  const openFolder = async () => {
    if (!savedPath) return
    try {
      await window.electron.ipcRenderer.invoke('open-image-location', savedPath)
    } catch {}
  }

  const saveCopy = async () => {
    if (!savedPath) return
    try {
      await window.electron.ipcRenderer.invoke('save-image-external', savedPath)
    } catch {}
  }

  const openSettings = () => {
    close()
    window.dispatchEvent(new CustomEvent('sypher-open-settings'))
  }

  if (phase === 'idle') return null

  const truncatedPrompt = prompt.length > 70 ? `${prompt.slice(0, 70)}â€¦` : prompt

  return (
    <AnimatePresence>
      <motion.div
        key="image-widget"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        className="fixed inset-0 z-[9050] flex items-center justify-center bg-black/85 backdrop-blur-xl p-6 md:p-10"
      >
        {/* ambient glow */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 h-[40rem] w-[40rem] rounded-full bg-emerald-500/10 blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 h-[32rem] w-[32rem] rounded-full bg-cyan-500/10 blur-[120px]" />
        </div>

        <motion.div
          initial={{ scale: 0.96, y: 12, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.96, y: 12, opacity: 0 }}
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          className="relative w-full max-w-5xl max-h-[88vh] flex flex-col bg-[#050505]/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_0_80px_rgba(16,185,129,0.18)] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-4 px-5 py-3 border-b border-white/5 bg-black/40">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                <RiShieldFlashLine className="text-emerald-400" size={16} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] font-black tracking-[0.25em] text-zinc-100 uppercase truncate">
                  Sypher AI Â· Visual Forge
                </span>
                <span className="text-[9px] font-mono tracking-widest text-emerald-500/60 uppercase truncate">
                  {phase === 'loading' &&
                    (retryInfo
                      ? `ENGINE ${retryInfo.model?.toUpperCase() || 'ROTATE'} Â· ${retryInfo.attempt}/${retryInfo.total}`
                      : 'NEURAL SYNTHESIS ACTIVE')}
                  {phase === 'success' && (savedPath ? 'ARCHIVED Â· GALLERY SYNCED' : 'RENDER COMPLETE')}
                  {phase === 'error' && 'PIPELINE INTERRUPTED'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`hidden sm:flex items-center gap-1.5 text-[9px] font-mono font-bold tracking-widest uppercase px-2.5 py-1 rounded-md border ${
                  phase === 'success'
                    ? 'text-emerald-300 border-emerald-500/30 bg-emerald-500/10'
                    : phase === 'error'
                      ? 'text-red-300 border-red-500/30 bg-red-500/10'
                      : 'text-cyan-300 border-cyan-500/30 bg-cyan-500/10 animate-pulse'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    phase === 'success'
                      ? 'bg-emerald-400 shadow-[0_0_6px_#10b981]'
                      : phase === 'error'
                        ? 'bg-red-400 shadow-[0_0_6px_#ef4444]'
                        : 'bg-cyan-400 shadow-[0_0_6px_#06b6d4] animate-pulse'
                  }`}
                />
                {phase.toUpperCase()}
              </span>
              <button
                onClick={close}
                className="p-2 rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:bg-red-500/15 hover:text-red-300 hover:border-red-500/30 transition-colors cursor-pointer"
                title="Close"
              >
                <RiCloseLine size={16} />
              </button>
            </div>
          </div>

          {/* Canvas */}
          <div className="relative flex-1 min-h-[24rem] flex items-center justify-center bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.06),transparent_60%)] p-6 overflow-hidden">
            {/* corner brackets */}
            <span className="pointer-events-none absolute top-3 left-3 w-5 h-5 border-t border-l border-emerald-400/30" />
            <span className="pointer-events-none absolute top-3 right-3 w-5 h-5 border-t border-r border-emerald-400/30" />
            <span className="pointer-events-none absolute bottom-3 left-3 w-5 h-5 border-b border-l border-emerald-400/30" />
            <span className="pointer-events-none absolute bottom-3 right-3 w-5 h-5 border-b border-r border-emerald-400/30" />

            <AnimatePresence mode="wait">
              {phase === 'loading' && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col items-center gap-6"
                >
                  <div className="relative w-28 h-28">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 2.5, ease: 'linear' }}
                      className="absolute inset-0 rounded-full border-2 border-emerald-500/20 border-t-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.25)]"
                    />
                    <motion.div
                      animate={{ rotate: -360 }}
                      transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
                      className="absolute inset-2 rounded-full border border-cyan-500/20 border-b-cyan-400/70"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <RiSparklingFill className="text-emerald-300 animate-pulse" size={22} />
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-2 text-center max-w-md">
                    <span className="text-xs font-black tracking-[0.3em] text-emerald-300 uppercase">
                      {statusText || 'CRAFTING NEURAL VISIONâ€¦'}
                    </span>
                    {retryInfo && (
                      <div className="flex items-center gap-1.5">
                        {Array.from({ length: retryInfo.total }).map((_, i) => (
                          <span
                            key={i}
                            className={`w-2 h-0.5 rounded-full ${
                              i < retryInfo.attempt
                                ? 'bg-emerald-400 shadow-[0_0_6px_#10b981]'
                                : 'bg-zinc-700'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                    <span className="text-[10px] font-mono tracking-widest text-zinc-500 mt-1 line-clamp-2">
                      {truncatedPrompt}
                    </span>
                  </div>
                </motion.div>
              )}

              {phase === 'error' && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="w-full max-w-lg flex flex-col gap-4"
                >
                  <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-6 flex flex-col items-center text-center gap-3 shadow-[0_0_40px_rgba(239,68,68,0.08)]">
                    <div className="p-3 rounded-full bg-red-500/10 border border-red-500/30 text-red-300">
                      <RiAlertLine size={24} />
                    </div>
                    <span className="text-sm font-black tracking-[0.25em] text-red-200 uppercase">
                      Generation Paused
                    </span>
                    <p className="text-[11px] font-mono text-red-200/80 leading-relaxed">
                      {debugMsg}
                    </p>
                    {prompt && (
                      <p className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase line-clamp-1">
                        Prompt Â· {truncatedPrompt}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={regenerate}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-200 hover:bg-emerald-500/25 hover:text-emerald-100 transition-colors text-[11px] font-bold tracking-widest uppercase cursor-pointer"
                    >
                      <RiRefreshLine size={14} /> Retry Synthesis
                    </button>
                    <button
                      onClick={openSettings}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-zinc-300 hover:bg-white/10 hover:text-white transition-colors text-[11px] font-bold tracking-widest uppercase cursor-pointer"
                    >
                      <RiSettings4Line size={14} /> Add HF Key
                    </button>
                  </div>
                </motion.div>
              )}

              {phase === 'success' && imageSrc && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.35, ease: [0.22, 0.61, 0.36, 1] }}
                  className="relative w-full h-full flex items-center justify-center"
                >
                  <div className="relative max-w-full max-h-full">
                    <motion.img
                      key={imageSrc}
                      src={imageSrc}
                      alt={prompt || 'Generated artifact'}
                      className="max-w-full max-h-[60vh] rounded-lg shadow-[0_0_60px_rgba(16,185,129,0.18)] border border-white/10"
                      initial={{ filter: 'blur(12px)', opacity: 0 }}
                      animate={{ filter: 'blur(0px)', opacity: 1 }}
                      transition={{ duration: 0.7 }}
                    />
                    {savedPath && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-500/20 border border-emerald-500/40 text-emerald-100 text-[9px] font-mono font-bold tracking-widest uppercase backdrop-blur shadow-[0_0_15px_rgba(16,185,129,0.25)]"
                      >
                        <RiCheckboxCircleFill className="text-emerald-300" size={11} />
                        Saved to Gallery
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="border-t border-white/5 bg-black/40 backdrop-blur-md px-5 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex flex-col gap-0.5 min-w-0 flex-1">
              <span className="text-[8px] font-mono tracking-[0.3em] text-zinc-500 uppercase">
                Prompt Vector
              </span>
              <span className="text-[11px] font-mono text-emerald-100/90 truncate">
                {prompt || 'â€”'}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={regenerate}
                disabled={!prompt || phase === 'loading'}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-zinc-300 hover:bg-emerald-500/10 hover:text-emerald-200 hover:border-emerald-500/30 transition-colors text-[10px] font-bold tracking-widest uppercase disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                title="Regenerate"
              >
                <RiRefreshLine size={12} /> Regen
              </button>
              <button
                onClick={openFolder}
                disabled={!savedPath}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-zinc-300 hover:bg-cyan-500/10 hover:text-cyan-200 hover:border-cyan-500/30 transition-colors text-[10px] font-bold tracking-widest uppercase disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                title="Open Folder"
              >
                <RiFolderOpenLine size={12} /> Folder
              </button>
              <button
                onClick={saveCopy}
                disabled={!savedPath}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-zinc-300 hover:bg-emerald-500/10 hover:text-emerald-200 hover:border-emerald-500/30 transition-colors text-[10px] font-bold tracking-widest uppercase disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                title="Save copy"
              >
                <RiDownloadLine size={12} /> Save
              </button>
              <button
                onClick={close}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-500 text-black hover:bg-emerald-400 transition-colors text-[10px] font-black tracking-widest uppercase shadow-[0_0_15px_rgba(16,185,129,0.35)] cursor-pointer"
                title="Close"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

