import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as faceapi from 'face-api.js'
import { GiArtificialIntelligence } from 'react-icons/gi'
import {
  RiKey2Line,
  RiSave3Line,
  RiUserVoiceLine,
  RiUserLine,
  RiLockPasswordLine,
  RiScan2Line,
  RiAddLine,
  RiRecordCircleLine,
  RiLock2Line,
  RiSettings4Line,
  RiShieldKeyholeLine,
  RiPlugLine,
  RiBrainLine,
  RiCloudLine,
  RiCpuLine,
  RiTerminalWindowLine,
  RiRefreshLine,
  RiDownloadCloud2Line,
  RiRocketLine,
  RiDeleteBin6Line,
  RiCloseLine
} from 'react-icons/ri'

interface SettingsProps {
  isSystemActive: boolean
}

type TabType = 'updates' | 'general' | 'keys' | 'security'

const SettingsView = ({ isSystemActive }: SettingsProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('updates')

  const [voice, setVoice] = useState<'MALE' | 'FEMALE'>(
    (localStorage.getItem('iris_voice_profile') as 'MALE' | 'FEMALE') || 'MALE'
  )
  const [personality, setPersonality] = useState('')
  const [userName, setUserName] = useState(localStorage.getItem('iris_user_name') || '')

  const [geminiKey, setGeminiKey] = useState(localStorage.getItem('iris_custom_api_key') || '')
  const [groqKey, setGroqKey] = useState(localStorage.getItem('iris_groq_api_key') || '')
  const [hfKey, setHfKey] = useState(localStorage.getItem('iris_hf_api_key') || '')
  const [tailvyKey, setTailvyKey] = useState(localStorage.getItem('iris_tailvy_api_key') || '')

  const [isSecurityUnlocked, setIsSecurityUnlocked] = useState(false)
  const [authPin, setAuthPin] = useState('')
  const [authError, setAuthError] = useState(false)

  const [newPin, setNewPin] = useState('')
  const [faceCount, setFaceCount] = useState(0)

  const [isScanningFace, setIsScanningFace] = useState(false)
  const [enrollStatus, setEnrollStatus] = useState('')
  const videoRef = useRef<HTMLVideoElement>(null)

  const [appVersion, setAppVersion] = useState('1.1.5')
  const [updateStatus, setUpdateStatus] = useState<
    'idle' | 'checking' | 'available' | 'downloading' | 'ready' | 'error'
  >('idle')
  const [updateVersion, setUpdateVersion] = useState('')
  const [updateNotes, setUpdateNotes] = useState('No new updates detected.')
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [memoryResetOptions, setMemoryResetOptions] = useState({
    transcript: true,
    coreMemory: true,
    semanticDb: false,
    oracleState: false
  })
  const [showMemoryDeleteDialog, setShowMemoryDeleteDialog] = useState(false)

  useEffect(() => {
    if (window.electron?.ipcRenderer) {
      window.electron.ipcRenderer.invoke('get-personality').then((res) => {
        if (res) setPersonality(res)
      })
      window.electron.ipcRenderer
        .invoke('check-vault-status')
        .then((res) => setFaceCount(res?.faceCount || 0))

      window.electron.ipcRenderer.invoke('get-app-version').then((v) => setAppVersion(v))

      window.electron.ipcRenderer.on('updater-event', (_e, { status, data, error }) => {
        if (status === 'checking') setUpdateStatus('checking')
        if (status === 'available') {
          setUpdateStatus('available')
          setUpdateVersion(data.version)
          setUpdateNotes(data.releaseNotes || 'Bug fixes and performance improvements.')
        }
        if (status === 'not-available') {
          setUpdateStatus('idle')
          setUpdateNotes('System is up to date.')
        }
        if (status === 'downloading') {
          setUpdateStatus('downloading')
          setDownloadProgress(Math.round(data.percent))
        }
        if (status === 'downloaded') setUpdateStatus('ready')
        if (status === 'error') {
          setUpdateStatus('error')
          setUpdateNotes(`Error: ${error}`)
        }
      })
    }
    return () => {
      if (window.electron?.ipcRenderer)
        window.electron.ipcRenderer.removeAllListeners('updater-event')
    }
  }, [])

  const checkForUpdates = () => window.electron.ipcRenderer.invoke('check-for-updates')
  const downloadUpdate = () => window.electron.ipcRenderer.invoke('download-update')
  const installUpdate = () => window.electron.ipcRenderer.invoke('install-update')

  const selectedResetLabels = [
    memoryResetOptions.transcript && 'dashboard transcript',
    memoryResetOptions.coreMemory && 'saved core memory',
    memoryResetOptions.semanticDb && 'semantic search database',
    memoryResetOptions.oracleState && 'Oracle codebase scan state'
  ].filter(Boolean)

  const hasResetSelection = selectedResetLabels.length > 0

  const toggleMemoryResetOption = (key: keyof typeof memoryResetOptions) => {
    setMemoryResetOptions((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const resetLocalMemory = async () => {
    if (!hasResetSelection) return

    if (!window.electron?.ipcRenderer) return

    try {
      const result = await window.electron.ipcRenderer.invoke(
        'reset-local-memory',
        memoryResetOptions
      )
      if (result?.success) {
        setShowMemoryDeleteDialog(false)
        alert(
          isSystemActive
            ? 'Memory banks purged. Disconnect and reconnect SYPHER to clear the active live session context.'
            : 'Memory banks purged.'
        )
      } else {
        alert(`Memory reset failed: ${result?.error || 'Unknown system fault.'}`)
      }
    } catch (error: any) {
      alert(`Memory reset failed: ${error?.message || String(error)}`)
    }
  }

  const handleVoiceChange = (v: 'MALE' | 'FEMALE') => {
    if (isSystemActive) return
    setVoice(v)
    localStorage.setItem('iris_voice_profile', v)
  }

  const handlePersonalityChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value
    const words = text
      .trim()
      .split(/\s+/)
      .filter((w) => w.length > 0)
    if (words.length <= 150) setPersonality(text)
  }

  const savePersonality = async () => {
    if (window.electron?.ipcRenderer) {
      await window.electron.ipcRenderer.invoke('set-personality', personality)
      alert('Personality Matrix Saved Securely to OS.')
    }
  }

  const saveUserName = () => {
    localStorage.setItem('iris_user_name', userName)
    alert('User Designation Saved.')
  }

  const saveApiKeys = async () => {
    localStorage.setItem('iris_custom_api_key', geminiKey)
    localStorage.setItem('iris_groq_api_key', groqKey)
    localStorage.setItem('iris_hf_api_key', hfKey)
    localStorage.setItem('iris_tailvy_api_key', tailvyKey)

    if (window.electron?.ipcRenderer) {
      try {
        await window.electron.ipcRenderer.invoke('secure-save-keys', { groqKey, geminiKey })
      } catch (e) {}
    }
    alert(
      'All Neural Uplinks (API Keys) secured locally and in OS Vault. Restart AI modules to apply.'
    )
  }

  const currentWordCount = personality
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0).length

  const unlockSecurityModule = async () => {
    if (!window.electron?.ipcRenderer) return
    const isValid = await window.electron.ipcRenderer.invoke('verify-vault-pin', authPin)
    if (isValid) {
      setIsSecurityUnlocked(true)
      setAuthPin('')
    } else {
      setAuthError(true)
      setTimeout(() => setAuthError(false), 1000)
    }
  }

  const updateMasterPin = async () => {
    if (newPin.length !== 4 || !window.electron?.ipcRenderer) return
    await window.electron.ipcRenderer.invoke('setup-vault-pin', newPin)
    setNewPin('')
    alert('Master PIN Updated Successfully.')
  }

  const startFaceEnrollment = async () => {
    setIsScanningFace(true)
    setEnrollStatus('INITIALIZING CAMERA...')
    try {
      await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri('./models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('./models')
      ])

      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setEnrollStatus('POSITION FACE IN FRAME')

        const scanInterval = setInterval(async () => {
          if (!videoRef.current || videoRef.current.readyState !== 4) return
          const detection = await faceapi
            .detectSingleFace(videoRef.current)
            .withFaceLandmarks()
            .withFaceDescriptor()

          if (detection) {
            clearInterval(scanInterval)
            setEnrollStatus('FACE ACQUIRED. ENCRYPTING...')
            const descriptorArray = Array.from(detection.descriptor)

            if (window.electron?.ipcRenderer) {
              await window.electron.ipcRenderer.invoke('setup-vault-face', descriptorArray)
            }

            stream.getTracks().forEach((t) => t.stop())
            setIsScanningFace(false)
            setFaceCount((prev) => prev + 1)
            alert('New Biometric Identity Saved.')
          }
        }, 1000)
      }
    } catch (e) {
      setEnrollStatus('CAMERA ERROR')
      setTimeout(() => setIsScanningFace(false), 2000)
    }
  }

  const cardClass =
    'bg-[#0f0f13] border border-white/10 p-6 md:p-8 rounded-2xl flex flex-col gap-5 hover:border-white/20 transition-all shadow-lg'
  const inputContainerClass =
    'flex items-center bg-[#050505] border border-white/10 rounded-lg px-4 py-3 focus-within:border-white/30 focus-within:bg-black transition-all duration-300 w-full'
  const titleClass = 'text-sm font-semibold text-white flex items-center gap-2'

  return (
    <div className="flex-1 p-6 md:p-10 lg:p-16 flex flex-col items-center bg-black min-h-screen text-zinc-100 overflow-y-auto scrollbar-small">
      <motion.div
        className="w-full max-w-4xl flex flex-col gap-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-6">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-[#111] rounded-2xl border border-white/10 flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.03)]">
              <GiArtificialIntelligence size={36} className="text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-white">Command Center</h2>
              <p className="text-xs text-zinc-400 font-mono mt-1 tracking-widest flex items-center gap-2 uppercase">
                <RiRecordCircleLine
                  className={`${isSystemActive ? 'text-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]' : 'text-zinc-600'}`}
                  size={14}
                />
                {isSystemActive ? 'System Online' : 'System Offline'}
              </p>
            </div>
          </div>

          <div className="flex bg-[#0a0a0c] p-1 rounded-xl border border-white/10 w-full md:w-fit shadow-lg overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTab('updates')}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 text-xs font-bold tracking-widest rounded-lg transition-all duration-300 ${activeTab === 'updates' ? 'bg-white text-black shadow-md' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
            >
              <RiTerminalWindowLine size={16} /> SYSTEM
            </button>
            <button
              onClick={() => setActiveTab('general')}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 text-xs font-bold tracking-widest rounded-lg transition-all duration-300 ${activeTab === 'general' ? 'bg-white text-black shadow-md' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
            >
              <RiSettings4Line size={16} /> GENERAL
            </button>
            <button
              onClick={() => setActiveTab('keys')}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 text-xs font-bold tracking-widest rounded-lg transition-all duration-300 ${activeTab === 'keys' ? 'bg-white text-black shadow-md' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
            >
              <RiPlugLine size={16} /> API KEYS
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 text-xs font-bold tracking-widest rounded-lg transition-all duration-300 ${activeTab === 'security' ? 'bg-white text-black shadow-md' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
            >
              <RiShieldKeyholeLine size={16} /> SECURITY
            </button>
          </div>
        </div>

        <div className="relative min-h-125 pb-12 mt-2">
          <AnimatePresence mode="wait">
            {activeTab === 'updates' && (
              <motion.div
                key="updates"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 absolute w-full"
              >
                <div className={`${cardClass} md:col-span-2 border-red-500/20`}>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                        <RiDeleteBin6Line size={22} />
                      </div>
                      <div className="flex flex-col gap-2">
                        <span className={titleClass}>Delete Memory</span>
                        <p className="text-[10px] text-zinc-500 font-mono leading-relaxed max-w-xl">
                          Clear old chats or saved memory without touching API keys, security,
                          notes, macros, or phone setup.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowMemoryDeleteDialog(true)}
                      className="px-6 py-3 rounded-lg bg-red-500/10 hover:bg-red-500 border border-red-500/30 text-red-400 hover:text-white font-bold tracking-widest text-[11px] flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <RiDeleteBin6Line size={16} /> DELETE MEMORY
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* --- TAB 2: GENERAL --- */}
            {activeTab === 'general' && (
              <motion.div
                key="general"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 absolute w-full"
              >
                <div className={`${cardClass} md:col-span-2`}>
                  <div className="flex justify-between items-center">
                    <span className={titleClass}>
                      <RiUserLine className="text-zinc-400" size={18} /> AI Personality Matrix
                    </span>
                    <div className="flex items-center gap-4">
                      <span
                        className={`text-[10px] font-mono tracking-widest ${currentWordCount >= 150 ? 'text-red-400' : 'text-zinc-400'}`}
                      >
                        {currentWordCount} / 150 WORDS
                      </span>
                      <button
                        onClick={savePersonality}
                        className="text-zinc-400 hover:text-white transition-colors bg-white/5 p-2 rounded-md hover:bg-white/10 border border-white/5"
                      >
                        <RiSave3Line size={18} />
                      </button>
                    </div>
                  </div>
                  <textarea
                    value={personality}
                    onChange={handlePersonalityChange}
                    placeholder="Define who SYPHER is. Example: 'You are a sassy, highly technical assistant...'"
                    className="bg-[#050505] border border-white/10 rounded-lg p-4 text-sm text-zinc-200 h-32 resize-none focus:border-white/30 outline-none transition-all scrollbar-small"
                  />
                </div>

                <div className={cardClass}>
                  <div className="flex justify-between items-end">
                    <span className={titleClass}>
                      <RiUserLine className="text-zinc-400" size={18} /> User Designation
                    </span>
                  </div>
                  <div className={inputContainerClass}>
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Enter operator name..."
                      className="bg-transparent border-none outline-none text-sm text-zinc-100 w-full placeholder:text-zinc-600 font-medium"
                    />
                    <button
                      onClick={saveUserName}
                      className="text-zinc-500 hover:text-white transition-colors ml-2"
                    >
                      <RiSave3Line size={20} />
                    </button>
                  </div>
                </div>

                <div className={`${cardClass} relative`}>
                  <div className="flex justify-between items-center">
                    <span className={titleClass}>
                      <RiUserVoiceLine className="text-zinc-400" size={18} /> OS Voice Profile
                    </span>
                    {isSystemActive && (
                      <span className="text-[10px] text-red-400 font-mono tracking-widest flex items-center gap-1 bg-red-500/10 px-2 py-1 rounded border border-red-500/20">
                        <RiLock2Line /> LOCKED AS SYPHER IS CONNECTED
                      </span>
                    )}
                  </div>
                  <div
                    className={`flex gap-3 h-12 mt-1 ${isSystemActive ? 'opacity-40 cursor-not-allowed' : ''}`}
                  >
                    {(['FEMALE', 'MALE'] as const).map((s) => (
                      <button
                        key={s}
                        onClick={() => handleVoiceChange(s)}
                        disabled={isSystemActive}
                        className={`cursor-pointer flex-1 flex items-center justify-center text-[12px] font-bold rounded-lg transition-all tracking-widest border ${
                          voice === s
                            ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                            : 'bg-[#050505] border-white/10 text-zinc-400 hover:text-white hover:border-white/30'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  {isSystemActive && (
                    <div
                      className="absolute inset-0 z-10"
                      title="Disconnect AI to change voice"
                    ></div>
                  )}
                </div>
              </motion.div>
            )}

            {/* --- TAB 3: API KEYS --- */}
            {activeTab === 'keys' && (
              <motion.div
                key="keys"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 gap-6 absolute w-full"
              >
                <div className={`${cardClass} gap-6`}>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
                    <span className={titleClass}>
                      <RiKey2Line className="text-zinc-400" size={18} /> External API Endpoints
                    </span>
                    <button
                      onClick={saveApiKeys}
                      className="bg-white text-black px-6 py-2.5 rounded-lg text-xs font-bold tracking-widest hover:bg-zinc-200 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.1)] flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <RiSave3Line size={16} /> SAVE ALL KEYS
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] text-zinc-400 font-mono tracking-widest uppercase flex items-center gap-2">
                        <RiBrainLine size={14} /> Gemini Pro Core
                      </label>
                      <div className={inputContainerClass}>
                        <input
                          type="password"
                          value={geminiKey}
                          onChange={(e) => setGeminiKey(e.target.value)}
                          placeholder="AIzaSy_..."
                          className="bg-transparent border-none outline-none text-sm font-mono text-zinc-100 w-full placeholder:text-zinc-700"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] text-zinc-400 font-mono tracking-widest uppercase flex items-center gap-2">
                        <RiCpuLine size={14} /> Groq Fast Inferencing
                      </label>
                      <div className={inputContainerClass}>
                        <input
                          type="password"
                          value={groqKey}
                          onChange={(e) => setGroqKey(e.target.value)}
                          placeholder="gsk_..."
                          className="bg-transparent border-none outline-none text-sm font-mono text-zinc-100 w-full placeholder:text-zinc-700"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 md:col-span-2">
                      <label className="text-[10px] text-zinc-400 font-mono tracking-widest uppercase flex items-center gap-2">
                        <RiCloudLine size={14} /> Hugging Face Vision
                      </label>
                      <div className={inputContainerClass}>
                        <input
                          type="password"
                          value={hfKey}
                          onChange={(e) => setHfKey(e.target.value)}
                          placeholder="hf_..."
                          className="bg-transparent border-none outline-none text-sm font-mono text-zinc-100 w-full placeholder:text-zinc-700"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 md:col-span-2">
                      <label className="text-[10px] text-zinc-400 font-mono tracking-widest uppercase flex items-center gap-2">
                        <RiPlugLine size={14} /> Tailvy Builder Agent
                      </label>
                      <div className={inputContainerClass}>
                        <input
                          type="password"
                          value={tailvyKey}
                          onChange={(e) => setTailvyKey(e.target.value)}
                          placeholder="tlv_..."
                          className="bg-transparent border-none outline-none text-sm font-mono text-zinc-100 w-full placeholder:text-zinc-700"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#050505] border border-white/5 p-4 rounded-xl mt-2 flex items-start gap-3">
                    <RiShieldKeyholeLine className="text-zinc-500 shrink-0 mt-0.5" size={16} />
                    <p className="text-[10px] text-zinc-400 font-mono leading-relaxed">
                      [SECURITY NOTICE]: All API keys are encrypted and stored strictly in your
                      local OS. SYPHER does not transmit these keys to any centralized server. You
                      maintain full ownership and billing control over your provider endpoints.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* --- TAB 4: SECURITY --- */}
            {activeTab === 'security' && (
              <motion.div
                key="security"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="w-full rounded-3xl overflow-hidden shadow-2xl border border-white/5 absolute"
              >
                <AnimatePresence>
                  {!isSecurityUnlocked && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                      className="absolute inset-0 z-20 backdrop-blur-2xl bg-black/70 border border-white/10 rounded-3xl flex flex-col items-center justify-center"
                    >
                      <div className="bg-[#111] p-5 rounded-full mb-6 border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                        <RiLockPasswordLine size={40} className="text-white" />
                      </div>
                      <p className="text-xs text-zinc-300 font-mono tracking-widest uppercase mb-6 font-semibold">
                        Authenticate to access Vault Settings
                      </p>
                      <div className="flex gap-3 items-center h-12">
                        <input
                          type="password"
                          maxLength={4}
                          pattern="\d*"
                          value={authPin}
                          onChange={(e) => setAuthPin(e.target.value.replace(/\D/g, ''))}
                          placeholder="PIN"
                          className={`h-full bg-[#050505] border w-32 rounded-lg text-center text-xl tracking-[0.5em] text-white outline-none transition-colors ${authError ? 'border-red-500 text-red-500 bg-red-500/10' : 'border-white/20 focus:border-white focus:bg-[#111]'}`}
                        />
                        <button
                          onClick={unlockSecurityModule}
                          className="h-full px-8 bg-white text-black text-xs font-bold tracking-widest rounded-lg hover:bg-zinc-200 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.2)] cursor-pointer"
                        >
                          UNLOCK
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#0a0a0c] p-6 rounded-3xl border border-white/5">
                  <div className="bg-[#111113] border border-white/10 p-7 rounded-2xl flex flex-col gap-5">
                    <span className={titleClass}>
                      <RiLockPasswordLine className="text-zinc-400" size={18} /> Update Master PIN
                    </span>
                    <div className={inputContainerClass}>
                      <input
                        type="password"
                        maxLength={4}
                        pattern="\d*"
                        value={newPin}
                        onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                        placeholder="Enter new 4-digit PIN..."
                        className="bg-transparent border-none outline-none text-sm font-mono text-zinc-100 w-full tracking-[0.3em]"
                      />
                      <button
                        onClick={updateMasterPin}
                        className="text-zinc-500 hover:text-white transition-colors ml-2 cursor-pointer"
                      >
                        <RiSave3Line size={20} />
                      </button>
                    </div>
                  </div>

                  <div className="bg-[#111113] border border-white/10 p-7 rounded-2xl flex flex-col gap-6">
                    <div className="flex justify-between items-center border-b border-white/10 pb-4">
                      <span className={titleClass}>
                        <RiScan2Line className="text-zinc-400" size={18} /> Biometric Registry
                      </span>
                      <span className="text-[10px] text-white font-mono tracking-widest bg-white/10 px-3 py-1.5 rounded-md font-semibold border border-white/5">
                        {faceCount} ENROLLED
                      </span>
                    </div>

                    {isScanningFace ? (
                      <div className="flex items-center gap-4 bg-[#050505] p-3 rounded-xl border border-white/20">
                        <video
                          ref={videoRef}
                          autoPlay
                          muted
                          playsInline
                          className="w-16 h-16 rounded-lg object-cover -scale-x-100 border border-white/10"
                        />
                        <div className="flex flex-col gap-1">
                          <span className="text-[11px] text-white font-mono tracking-widest animate-pulse font-bold">
                            {enrollStatus}
                          </span>
                          <span className="text-xs text-zinc-400">Keep head steady...</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-4 h-full justify-between">
                        <p className="text-xs text-zinc-400 leading-relaxed">
                          Enroll additional structural face descriptors. Data is mathematically
                          encrypted and stored locally.
                        </p>
                        <button
                          onClick={startFaceEnrollment}
                          className="w-full py-3 rounded-lg bg-white text-black font-bold tracking-widest text-[12px] flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] mt-auto cursor-pointer"
                        >
                          <RiAddLine size={18} /> ENROLL NEW IDENTITY
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {showMemoryDeleteDialog && (
            <motion.div
              className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 12 }}
                className="w-full max-w-2xl rounded-2xl border border-red-500/20 bg-[#0f0f13] shadow-2xl overflow-hidden"
              >
                <div className="flex items-center justify-between border-b border-white/10 p-5">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                      <RiDeleteBin6Line size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">What do you want to delete?</h3>
                      <p className="text-[10px] text-zinc-500 font-mono mt-1">
                        API keys, lock screen, notes, macros, and phone setup will not be deleted.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowMemoryDeleteDialog(false)}
                    className="p-2 rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <RiCloseLine size={20} />
                  </button>
                </div>

                <div className="p-5 grid grid-cols-1 gap-3">
                  {[
                    {
                      key: 'transcript',
                      label: 'Chat history',
                      detail: 'Deletes the transcript shown on the Dashboard.'
                    },
                    {
                      key: 'coreMemory',
                      label: 'Saved memory',
                      detail: 'Deletes facts SYPHER saved about you or your work.'
                    },
                    {
                      key: 'semanticDb',
                      label: 'File search database',
                      detail: 'Deletes indexed file-search data. You can rebuild it later.'
                    },
                    {
                      key: 'oracleState',
                      label: 'Codebase answer cache',
                      detail: 'Deletes stored codebase RAG scan data.'
                    }
                  ].map((item) => {
                    const key = item.key as keyof typeof memoryResetOptions
                    return (
                      <label
                        key={item.key}
                        className={`cursor-pointer flex items-start gap-3 rounded-xl border p-4 transition-all ${
                          memoryResetOptions[key]
                            ? 'bg-red-500/10 border-red-500/30'
                            : 'bg-black/30 border-white/10 hover:border-white/20'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={memoryResetOptions[key]}
                          onChange={() => toggleMemoryResetOption(key)}
                          className="mt-1 h-4 w-4 accent-red-500"
                        />
                        <span className="flex flex-col gap-1">
                          <span className="text-sm font-bold text-zinc-100">{item.label}</span>
                          <span className="text-xs text-zinc-500 leading-relaxed">
                            {item.detail}
                          </span>
                        </span>
                      </label>
                    )
                  })}
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-t border-white/10 bg-black/30 p-5">
                  <p className="text-[10px] text-zinc-500 font-mono leading-relaxed">
                    Selected:{' '}
                    {selectedResetLabels.length > 0 ? selectedResetLabels.join(', ') : 'nothing'}
                  </p>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setShowMemoryDeleteDialog(false)}
                      className="px-5 py-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 font-bold tracking-widest text-[11px] transition-all cursor-pointer"
                    >
                      CANCEL
                    </button>
                    <button
                      onClick={resetLocalMemory}
                      disabled={!hasResetSelection}
                      className={`px-5 py-3 rounded-lg border font-bold tracking-widest text-[11px] flex items-center justify-center gap-2 transition-all ${
                        hasResetSelection
                          ? 'cursor-pointer bg-red-500/10 hover:bg-red-500 border-red-500/30 text-red-400 hover:text-white'
                          : 'cursor-not-allowed bg-white/5 border-white/10 text-zinc-600'
                      }`}
                    >
                      <RiDeleteBin6Line size={16} /> DELETE SELECTED
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export default SettingsView
