import { useEffect, useCallback, useRef, useState } from 'react'
import Sphere from '@renderer/components/Sphere'
import {
  RiCpuLine,
  RiCameraLine,
  RiTerminalBoxLine,
  RiSwapBoxLine,
  RiLayoutGridLine,
  RiMicLine,
  RiMicOffLine,
  RiPhoneFill,
  RiHistoryLine,
  RiPulseLine,
  RiWifiLine,
  RiServerLine,
  RiEarthLine,
  RiSendPlane2Fill,
  RiImageAddLine,
  RiAttachment2,
  RiCloseLine
} from 'react-icons/ri'
import { FaMemory } from 'react-icons/fa6'
import { GiTinker } from 'react-icons/gi'
import { HiComputerDesktop } from 'react-icons/hi2'
import * as faceapi from 'face-api.js'
import { VisionMode } from '@renderer/IndexRoot'
import { irisService } from '@renderer/services/Iris-voice-ai'

interface IrisProps {
  isSystemActive: boolean
  toggleSystem: () => void
  isMicMuted: boolean
  toggleMic: () => void
  isVideoOn: boolean
  visionMode: VisionMode
  startVision: (mode: 'camera' | 'screen') => void
  stopVision: () => void
  activeStream: MediaStream | null
}

interface DashboardViewProps {
  props: IrisProps
  stats: any
  chatHistory: any[]
  onVisionClick: () => void
}

const glassPanel = 'bg-zinc-950/40 backdrop-blur-xl border border-white/5 rounded-2xl shadow-xl'

export default function DashboardView({
  props,
  stats,
  chatHistory,
  onVisionClick
}: DashboardViewProps) {
  const {
    isSystemActive,
    isVideoOn,
    visionMode,
    startVision,
    activeStream,
    toggleMic,
    toggleSystem,
    isMicMuted
  } = props

  const scrollRef = useRef<HTMLDivElement>(null)
  const videoElementRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const faceScanInterval = useRef<NodeJS.Timeout | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const dragDepthRef = useRef(0)

  const [modelsLoaded, setModelsLoaded] = useState(false)

  const [networkStats, setNetworkStats] = useState({ ping: 24, rate: 1.2, tx: 40, rx: 60 })

  const [textInput, setTextInput] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [dropFlash, setDropFlash] = useState<string | null>(null)
  const [zoomedImage, setZoomedImage] = useState<string | null>(null)

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [chatHistory])

  useEffect(() => {
    if (!isSystemActive) {
      setNetworkStats({ ping: 0, rate: 0.0, tx: 0, rx: 0 })
      return
    }

    const interval = setInterval(() => {
      setNetworkStats({
        ping: Math.floor(Math.random() * (45 - 12 + 1)) + 12,
        rate: +(Math.random() * 8.5 + 0.5).toFixed(2),
        tx: Math.floor(Math.random() * 100),
        rx: Math.floor(Math.random() * 100)
      })
    }, 1700)

    return () => clearInterval(interval)
  }, [isSystemActive])

  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = './models'
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
          faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL)
        ])
        setModelsLoaded(true)
      } catch (e) {}
    }
    loadModels()
  }, [])

  useEffect(() => {
    if (
      isVideoOn &&
      visionMode === 'camera' &&
      modelsLoaded &&
      videoElementRef.current &&
      canvasRef.current
    ) {
      if (faceScanInterval.current) clearInterval(faceScanInterval.current)

      faceScanInterval.current = setInterval(async () => {
        const video = videoElementRef.current
        const canvas = canvasRef.current
        if (!video || !canvas || video.readyState !== 4 || video.videoWidth === 0) return

        try {
          const vw = video.videoWidth
          const vh = video.videoHeight

          if (canvas.width !== vw || canvas.height !== vh) {
            canvas.width = vw
            canvas.height = vh
          }

          const ctx = canvas.getContext('2d')
          if (!ctx) return

          const options = new faceapi.SsdMobilenetv1Options({ minConfidence: 0.3 })
          const detection = await faceapi
            .detectSingleFace(video, options)
            .withFaceExpressions()
            .withAgeAndGender()

          ctx.clearRect(0, 0, vw, vh)

          if (detection) {
            const { x, y, width, height } = detection.detection.box

            const mirroredX = vw - x - width

            ctx.strokeStyle = '#34d399'
            ctx.lineWidth = 4
            const l = 25

            ctx.beginPath()
            ctx.moveTo(mirroredX, y + l)
            ctx.lineTo(mirroredX, y)
            ctx.lineTo(mirroredX + l, y)
            ctx.moveTo(mirroredX + width - l, y)
            ctx.lineTo(mirroredX + width, y)
            ctx.lineTo(mirroredX + width, y + l)
            ctx.moveTo(mirroredX, y + height - l)
            ctx.lineTo(mirroredX, y + height)
            ctx.lineTo(mirroredX + l, y + height)
            ctx.moveTo(mirroredX + width - l, y + height)
            ctx.lineTo(mirroredX + width, y + height)
            ctx.lineTo(mirroredX + width, y + height - l)
            ctx.stroke()

            const expressions = detection.expressions
            const domExp = Object.keys(expressions).reduce((a, b) =>
              expressions[a] > expressions[b] ? a : b
            )
            const gender = detection.gender === 'male' ? 'M' : 'F'
            const age = Math.round(detection.age)
            const labelText = ` ID:${gender} | AGE:${age} | ${domExp.toUpperCase()} `

            ctx.fillStyle = 'rgba(10, 10, 10, 0.85)'
            ctx.fillRect(mirroredX, y - 32, width, 26)

            ctx.fillStyle = '#34d399'
            ctx.font = 'bold 16px monospace'
            ctx.fillText(labelText, mirroredX + 5, y - 14)
          } else {
            ctx.fillStyle = 'rgba(52, 211, 153, 0.8)'
            ctx.font = 'bold 14px monospace'
            ctx.fillText('SCANNING OPTICS...', 20, 30)
          }
        } catch (e) {}
      }, 250)
    } else {
      if (faceScanInterval.current) clearInterval(faceScanInterval.current)
      const ctx = canvasRef.current?.getContext('2d')
      if (ctx) ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height)
    }

    return () => {
      if (faceScanInterval.current) clearInterval(faceScanInterval.current)
    }
  }, [isVideoOn, visionMode, modelsLoaded])

  const setVideoRef = useCallback(
    (node: HTMLVideoElement | null) => {
      videoElementRef.current = node
      if (node && activeStream && isVideoOn) {
        node.srcObject = activeStream
        node.onloadedmetadata = () => node.play().catch(() => {})
      }
    },
    [activeStream, isVideoOn, visionMode]
  )

  const setMobileVideoRef = useCallback(
    (node: HTMLVideoElement | null) => {
      if (node && activeStream && isVideoOn) {
        node.srcObject = activeStream
        node.onloadedmetadata = () => node.play().catch(() => {})
      }
    },
    [activeStream, isVideoOn, visionMode]
  )

  const toggleSource = () => {
    if (!isSystemActive) return
    const nextMode = visionMode === 'camera' ? 'screen' : 'camera'
    startVision(nextMode)
  }

  const sendTypedMessage = useCallback(() => {
    const text = textInput.trim()
    if (!text || !isSystemActive) return
    const ok = irisService.sendTextMessage(text)
    if (ok) setTextInput('')
  }, [textInput, isSystemActive])

  const handleTextKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendTypedMessage()
    }
  }

  const buildThumbnail = (dataUrl: string): Promise<string> =>
    new Promise((resolve) => {
      try {
        const img = new Image()
        img.onload = () => {
          try {
            const max = 256
            let w = img.naturalWidth || img.width
            let h = img.naturalHeight || img.height
            if (!w || !h) return resolve(dataUrl)
            if (w > h) {
              h = Math.round((h * max) / w)
              w = max
            } else {
              w = Math.round((w * max) / h)
              h = max
            }
            const canvas = document.createElement('canvas')
            canvas.width = w
            canvas.height = h
            const ctx = canvas.getContext('2d')
            if (!ctx) return resolve(dataUrl)
            ctx.drawImage(img, 0, 0, w, h)
            resolve(canvas.toDataURL('image/jpeg', 0.78))
          } catch {
            resolve(dataUrl)
          }
        }
        img.onerror = () => resolve(dataUrl)
        img.src = dataUrl
      } catch {
        resolve(dataUrl)
      }
    })

  const dispatchImageFile = useCallback(
    (file: File | null | undefined) => {
      if (!file || !isSystemActive) return
      if (!file.type.startsWith('image/')) return
      const reader = new FileReader()
      reader.onload = async () => {
        const dataUrl = reader.result as string
        const base64 = dataUrl.split(',')[1]
        if (!base64) return
        const thumbnail = await buildThumbnail(dataUrl)
        const ok = irisService.sendImageWithContext(
          base64,
          'I just dropped an image into the dashboard. Describe what you see in English and use it as context for the next request.',
          file.type || 'image/jpeg',
          file.name,
          thumbnail
        )
        if (ok) {
          setDropFlash(file.name)
          setTimeout(() => setDropFlash(null), 1800)
        }
      }
      reader.readAsDataURL(file)
    },
    [isSystemActive]
  )

  const renderMessageBody = (rawText: string) => {
    if (!rawText) return null
    const match = rawText.match(/^\[IMG:(att_[a-z0-9_]+)\]\s*([\s\S]*)$/i)
    if (!match) return rawText
    const attId = match[1]
    const rest = match[2]
    let dataUrl: string | null = null
    try {
      dataUrl = sessionStorage.getItem(`sypher_att_${attId}`)
    } catch {
      dataUrl = null
    }
    return (
      <div className="flex flex-col gap-2">
        {dataUrl ? (
          <button
            type="button"
            onClick={() => setZoomedImage(dataUrl)}
            className="group relative overflow-hidden rounded-lg border border-emerald-500/30 bg-black/40 cursor-zoom-in transition-all hover:border-emerald-400/60"
          >
            <img
              src={dataUrl}
              alt="Attached preview"
              className="max-h-44 w-full object-cover"
            />
            <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/70 text-emerald-300 text-[8px] font-mono tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
              ZOOM
            </span>
          </button>
        ) : null}
        {rest && <span className="whitespace-pre-wrap break-words">{rest}</span>}
      </div>
    )
  }

  const onDashDragEnter = (e: React.DragEvent) => {
    if (!isSystemActive) return
    if (!e.dataTransfer.types?.includes('Files')) return
    e.preventDefault()
    dragDepthRef.current += 1
    setIsDragging(true)
  }

  const onDashDragOver = (e: React.DragEvent) => {
    if (!isSystemActive) return
    if (!e.dataTransfer.types?.includes('Files')) return
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  }

  const onDashDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    dragDepthRef.current = Math.max(0, dragDepthRef.current - 1)
    if (dragDepthRef.current === 0) setIsDragging(false)
  }

  const onDashDrop = (e: React.DragEvent) => {
    e.preventDefault()
    dragDepthRef.current = 0
    setIsDragging(false)
    if (!isSystemActive) return
    const file = e.dataTransfer.files?.[0]
    dispatchImageFile(file)
  }

  const systemMetrics = [
    {
      icon: <RiCpuLine />,
      bgIcon: <RiCpuLine size={140} />,
      label: 'CPU LOAD',
      val: isSystemActive && stats ? `${stats.cpu}%` : '--',
      raw: isSystemActive && stats ? stats.cpu : 0,
      colorClass: 'text-emerald-400',
      bgClass: 'bg-emerald-500',
      glowClass: 'via-emerald-500/50',
      shadowClass: 'shadow-[0_0_8px_#10b981]',
      bgGradient: 'from-emerald-950/30 to-black/60',
      pattern:
        'bg-[linear-linear(to_right,#10b98108_1px,transparent_1px),linear-linear(to_bottom,#10b98108_1px,transparent_1px)] bg-[size:12px_12px]'
    },
    {
      icon: <FaMemory />,
      bgIcon: <FaMemory size={140} />,
      label: 'RAM USAGE',
      val: isSystemActive && stats ? `${stats.memory.usedPercentage}%` : '--',
      raw: isSystemActive && stats ? stats.memory.usedPercentage : 0,
      colorClass: 'text-cyan-400',
      bgClass: 'bg-cyan-500',
      glowClass: 'via-cyan-500/50',
      shadowClass: 'shadow-[0_0_8px_#06b6d4]',
      bgGradient: 'from-cyan-950/30 to-black/60',
      pattern: 'bg-[radial-linear(#06b6d415_1px,transparent_1px)] bg-[size:10px_10px]'
    },
    {
      icon: <GiTinker />,
      bgIcon: <GiTinker size={140} />,
      label: 'TEMP',
      val: isSystemActive && stats ? `${stats.temperature}°C` : '--',
      raw: isSystemActive && stats ? Math.min((stats.temperature / 90) * 100, 100) : 0,
      colorClass: 'text-orange-400',
      bgClass: 'bg-orange-500',
      glowClass: 'via-orange-500/50',
      shadowClass: 'shadow-[0_0_8px_#f97316]',
      bgGradient: 'from-orange-950/30 to-black/60',
      pattern:
        'bg-[radial-linear(ellipse_at_top_right,_var(--tw-linear-stops))] from-orange-900/20 via-transparent to-transparent'
    },
    {
      icon: <HiComputerDesktop />,
      bgIcon: <HiComputerDesktop size={140} />,
      label: 'OS',
      val: isSystemActive && stats ? `${stats.os.type}` : '--',
      raw: 0,
      colorClass: 'text-purple-400',
      bgClass: 'bg-purple-500',
      glowClass: 'via-purple-500/50',
      shadowClass: '',
      bgGradient: 'from-purple-950/30 to-black/60',
      pattern:
        'bg-[linear-linear(45deg,#a855f708_25%,transparent_25%,transparent_50%,#a855f708_50%,#a855f708_75%,transparent_75%,transparent)] bg-[size:24px_24px]',
      hideBar: true
    }
  ]

  return (
    <div
      className="flex-1 p-4 bg-white/2 grid grid-cols-12 gap-4 h-full overflow-hidden relative animate-in fade-in zoom-in duration-300 w-full"
      onDragEnter={onDashDragEnter}
      onDragOver={onDashDragOver}
      onDragLeave={onDashDragLeave}
      onDrop={onDashDrop}
    >
      {isDragging && (
        <div className="absolute inset-0 z-[80] flex items-center justify-center bg-black/70 backdrop-blur-md border-2 border-dashed border-emerald-500/60 rounded-2xl pointer-events-none animate-in fade-in duration-150">
          <div className="flex flex-col items-center gap-3">
            <div className="p-5 rounded-full bg-emerald-500/15 border border-emerald-500/40 shadow-[0_0_40px_rgba(16,185,129,0.25)]">
              <RiImageAddLine size={42} className="text-emerald-400 animate-pulse" />
            </div>
            <span className="text-sm font-black tracking-[0.25em] uppercase text-emerald-300">
              Release to feed Sypher
            </span>
            <span className="text-[10px] font-mono tracking-widest text-zinc-400">
              IMAGE → NEURAL CONTEXT INJECTION
            </span>
          </div>
        </div>
      )}

      {dropFlash && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[70] px-4 py-2 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-200 text-[10px] font-mono tracking-widest shadow-[0_0_20px_rgba(16,185,129,0.25)] animate-in fade-in zoom-in duration-200">
            📎 IMAGE STREAMED → {dropFlash}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0]
          dispatchImageFile(f)
          if (e.target) e.target.value = ''
        }}
      />

      {zoomedImage && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/90 backdrop-blur-md p-8 animate-in fade-in duration-150"
          onClick={() => setZoomedImage(null)}
        >
          <button
            type="button"
            onClick={() => setZoomedImage(null)}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/5 border border-white/10 text-zinc-300 hover:bg-red-500/20 hover:text-red-300 transition-colors cursor-pointer"
          >
            <RiCloseLine size={22} />
          </button>
          <img
            src={zoomedImage}
            alt="Attached image"
            className="max-w-[90vw] max-h-[85vh] rounded-2xl border border-white/10 shadow-[0_0_60px_rgba(16,185,129,0.15)] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
      <div className="hidden lg:flex col-span-3 flex-col gap-4 h-full z-40">
        <div
          className={`${glassPanel} h-70 shrink-0 flex flex-col p-1 overflow-hidden relative group`}
        >
          <div className="absolute top-3 left-3 z-30 flex items-center gap-2">
            <span
              className={`w-1.5 h-1.5 rounded-full ${isVideoOn ? 'bg-red-500 animate-pulse shadow-[0_0_8px_red]' : 'bg-zinc-600'}`}
            />
            <span
              className={`text-[9px] font-bold tracking-widest ${isVideoOn ? 'text-red-400/80' : 'text-zinc-600'}`}
            >
              {isVideoOn
                ? visionMode === 'screen'
                  ? 'SCREEN FEED'
                  : 'OPTICAL FEED'
                : 'OPTICS OFFLINE'}
            </span>
          </div>

          {isVideoOn && (
            <button
              onClick={toggleSource}
              className="absolute top-2 right-2 z-30 p-1.5 rounded-md bg-black/50 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500 hover:text-black transition-all"
            >
              <RiSwapBoxLine size={14} />
            </button>
          )}

          <div
            className={`w-full h-full rounded-xl overflow-hidden bg-black/20 relative border border-white/5 transition-all ${isVideoOn ? 'opacity-100' : 'opacity-30'}`}
          >
            <video
              key={visionMode}
              ref={setVideoRef}
              className={`absolute inset-0 w-full h-full object-cover ${visionMode === 'camera' ? '-scale-x-100' : ''}`}
              autoPlay
              playsInline
              muted
            />

            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full object-cover pointer-events-none z-20"
            />

            {!isVideoOn && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-50">
                <RiCameraLine size={24} />
                <span className="text-[9px] font-mono">NO SIGNAL</span>
              </div>
            )}
          </div>
        </div>

        <div
          className={`${glassPanel} h-32 shrink-0 p-4 flex flex-col justify-between relative overflow-hidden`}
        >
          <div
            className={`absolute inset-0 bg-linear-to-r from-emerald-500/5 to-transparent transition-opacity duration-1000 ${isSystemActive ? 'opacity-100' : 'opacity-0'}`}
          />

          <div className="flex items-center justify-between border-b border-white/10 pb-2 relative z-10">
            <span className="text-[10px] font-bold tracking-widest text-zinc-400 flex items-center gap-1">
              <RiPulseLine className={isSystemActive ? 'text-emerald-500 animate-pulse' : ''} />{' '}
              NETWORK TELEMETRY
            </span>
            <span
              className={`text-[8px] px-2 py-0.5 rounded-full font-mono font-bold border ${isSystemActive ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' : 'text-zinc-600 border-zinc-800 bg-zinc-900'}`}
            >
              {isSystemActive ? 'SECURE UPLINK' : 'STANDBY'}
            </span>
          </div>

          <div className="flex items-center justify-between mt-2 relative z-10">
            <div className="flex flex-col">
              <span className="text-[8px] text-zinc-600 font-mono tracking-widest flex items-center gap-1">
                WSS LATENCY
              </span>
              <span className="text-xs font-bold text-emerald-50 font-mono flex items-center gap-1.5 transition-all">
                <RiWifiLine className={isSystemActive ? 'text-emerald-400' : 'text-zinc-600'} />
                {isSystemActive ? `${networkStats.ping}ms` : '--'}
              </span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-[8px] text-zinc-600 font-mono tracking-widest">
                PACKET RATE
              </span>
              <span className="text-xs font-bold text-emerald-50 font-mono transition-all">
                {isSystemActive ? `${networkStats.rate} MB/s` : '--'}
              </span>
            </div>

            <div className="flex flex-col items-end">
              <span className="text-[8px] text-zinc-600 font-mono tracking-widest">ROUTING</span>
              <span className="text-xs font-bold text-emerald-50 font-mono flex items-center gap-1.5">
                {isSystemActive ? 'GLOBAL' : 'LOCAL'}
                {isSystemActive ? (
                  <RiEarthLine className="text-cyan-400" />
                ) : (
                  <RiServerLine className="text-zinc-500" />
                )}
              </span>
            </div>
          </div>

          <div className="w-full flex flex-col gap-1 mt-3 relative z-10">
            <div className="flex items-center gap-2">
              <span className="text-[7px] font-mono text-zinc-500 w-3">TX</span>
              <div className="flex-1 h-1 bg-black/60 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 shadow-[0_0_8px_#10b981] transition-all duration-300 ease-out"
                  style={{ width: `${isSystemActive ? networkStats.tx : 0}%` }}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[7px] font-mono text-zinc-500 w-3">RX</span>
              <div className="flex-1 h-1 bg-black/60 rounded-full overflow-hidden">
                <div
                  className="h-full bg-cyan-500 shadow-[0_0_8px_#06b6d4] transition-all duration-300 ease-out delay-75"
                  style={{ width: `${isSystemActive ? networkStats.rx : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className={`${glassPanel} flex-1 p-4 flex flex-col gap-3`}>
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="text-[10px] font-bold tracking-widest text-zinc-400">
              <RiLayoutGridLine className="inline mr-1" /> CORE METRICS
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 h-full pb-1">
            {systemMetrics.map((m, i) => (
              <div
                key={i}
                className={`cursor-pointer relative rounded-xl p-3 flex flex-col justify-between border border-white/5 overflow-hidden group hover:border-white/10 transition-all duration-300 bg-linear-to-br ${m.bgGradient}`}
              >
                <div
                  className={`absolute inset-0 ${m.pattern} opacity-30 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none`}
                />

                <div
                  className={`absolute -bottom-8 -right-8 opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-500 transform group-hover:scale-110 pointer-events-none ${m.colorClass}`}
                >
                  {m.bgIcon}
                </div>

                <div
                  className={`absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent ${m.glowClass} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />

                <div className="relative z-10 flex justify-between items-start text-zinc-500">
                  <span
                    className={`text-base ${m.colorClass} opacity-70 group-hover:opacity-100 transition-opacity`}
                  >
                    {m.icon}
                  </span>
                  <span className="text-[8px] font-mono tracking-widest uppercase opacity-70 group-hover:opacity-100 transition-opacity text-zinc-300">
                    {m.label}
                  </span>
                </div>

                <div className="relative z-10 flex flex-col gap-1.5 mt-2">
                  <span className="text-sm font-bold text-white text-right font-mono tracking-wider drop-shadow-md">
                    {m.val}
                  </span>

                  {!m.hideBar && (
                    <div className="w-full h-1 bg-black/40 rounded-full overflow-hidden backdrop-blur-sm border border-white/5">
                      <div
                        className={`h-full ${m.bgClass} ${m.shadowClass} transition-all duration-700 ease-out`}
                        style={{ width: isSystemActive ? `${m.raw}%` : '0%' }}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="col-span-12 lg:col-span-6 relative flex flex-col items-center justify-center">
        <div
          className={`lg:hidden absolute top-4 right-4 w-32 h-24 ${glassPanel} z-50 overflow-hidden ${isVideoOn ? 'block' : 'hidden'}`}
        >
          <video
            ref={setMobileVideoRef}
            className={`w-full h-full object-cover ${visionMode === 'camera' ? '-scale-x-100' : ''}`}
            autoPlay
            playsInline
            muted
          />
        </div>

        <div
          className={`w-[60vh] h-[60vh] max-w-full transition-all duration-1000 ${isSystemActive ? 'opacity-100 scale-100' : 'opacity-85 scale-90 grayscale'}`}
        >
          <Sphere />
        </div>

        <div className="absolute bottom-10 z-50">
          <div
            className={`${glassPanel} px-6 py-3 rounded-full flex items-center gap-6 border border-emerald-500/20 shadow-[0_0_30px_rgba(0,0,0,0.5)]`}
          >
            <button
              onClick={onVisionClick}
              className={`cursor-pointer p-3 rounded-full transition-all ${isVideoOn ? 'bg-red-500/20 text-red-400' : 'hover:bg-white/10 text-zinc-400'}`}
            >
              {isVideoOn ? <RiSwapBoxLine size={20} /> : <RiCameraLine size={20} />}
            </button>
            <button onClick={toggleSystem} className="relative group mx-2">
              <div
                className={`cursor-pointer p-4 rounded-full border-2 transition-all duration-500 ${isSystemActive ? 'bg-emerald-500 border-emerald-400 text-black shadow-[0_0_20px_#10b981]' : 'bg-red-500/10 border-red-500/50 text-red-500'}`}
              >
                <RiPhoneFill size={24} className={isSystemActive ? 'animate-pulse' : ''} />
              </div>
            </button>
            <button
              onClick={toggleMic}
              className={`cursor-pointer p-3 rounded-full transition-all ${isMicMuted ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/10 text-emerald-400'}`}
            >
              {isMicMuted ? <RiMicOffLine size={20} /> : <RiMicLine size={20} />}
            </button>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex col-span-3 flex-col overflow-hidden h-full z-40">
        <div className={`${glassPanel} h-full p-4 flex flex-col`}>
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-2">
            <span className="text-[10px] font-bold tracking-widest text-zinc-400">
              <RiTerminalBoxLine className="inline mr-1" /> TRANSCRIPT
            </span>
            <span className="text-[8px] font-mono text-emerald-500/50">LIVE-LOG</span>
          </div>
          <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-small">
            {chatHistory.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-zinc-700 gap-2 opacity-50">
                <RiHistoryLine size={24} />
                <span className="text-[9px] tracking-widest uppercase font-mono">
                  No Data Stream
                </span>
              </div>
            ) : (
              chatHistory.map((msg, idx) => {
                const text =
                  msg.parts && msg.parts[0] ? msg.parts[0].text : msg.content || ''
                return (
                  <div
                    key={idx}
                    className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[95%] py-2 px-3 rounded-lg text-[11px] leading-relaxed border font-mono font-semibold ${msg.role === 'user' ? 'bg-emerald-900/20 border-emerald-500/20 text-emerald-100/90 rounded-br-none' : 'bg-zinc-900/50 border-white/5 text-zinc-400 rounded-bl-none'}`}
                    >
                      {renderMessageBody(text)}
                    </div>
                  </div>
                )
              })
            )}
          </div>

          <div className="mt-3 pt-3 border-t border-white/10 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={!isSystemActive}
                title="Attach image as context"
                className="shrink-0 p-2 rounded-lg bg-black/40 border border-white/10 text-zinc-400 hover:text-emerald-300 hover:border-emerald-500/40 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                <RiAttachment2 size={14} />
              </button>
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyDown={handleTextKey}
                disabled={!isSystemActive}
                placeholder={
                  isSystemActive ? 'Type a command… (Enter to send)' : 'Activate Sypher to chat…'
                }
                className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-[11px] font-mono text-emerald-100/90 placeholder:text-zinc-600 outline-none focus:border-emerald-500/40 focus:bg-black/60 transition-colors disabled:opacity-40"
              />
              <button
                type="button"
                onClick={sendTypedMessage}
                disabled={!isSystemActive || !textInput.trim()}
                title="Send to Sypher"
                className="shrink-0 p-2 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25 hover:text-emerald-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                <RiSendPlane2Fill size={14} />
              </button>
            </div>
            <span className="text-[8px] font-mono tracking-widest text-zinc-600 px-1">
              {isSystemActive
                ? 'TEXT • VOICE • DRAG IMAGE FOR CONTEXT'
                : 'SYSTEM OFFLINE — PRESS THE GREEN ORB TO ENGAGE'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
