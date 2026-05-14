import { InferenceClient } from '@huggingface/inference'

// Officially supported models per https://image.pollinations.ai/models
const POLLINATIONS_MODELS = ['flux', 'turbo', 'stable-diffusion'] as const

const buildPollinationsUrl = (prompt: string, attempt: number = 0) => {
  // Rotate model each attempt to dodge a single unhealthy upstream
  const model = POLLINATIONS_MODELS[attempt % POLLINATIONS_MODELS.length]
  const seed = Math.floor(Math.random() * 1_000_000).toString()
  const params = new URLSearchParams({
    width: '1024',
    height: '1024',
    nologo: 'true',
    private: 'true',
    enhance: 'true',
    model,
    seed
  })
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?${params.toString()}`
}

const shouldUseFallback = (message: string) => {
  const normalized = message.toLowerCase()
  return (
    normalized.includes('inference providers') ||
    normalized.includes('permission') ||
    normalized.includes('authentication') ||
    normalized.includes('unauthorized') ||
    normalized.includes('forbidden') ||
    normalized.includes('401') ||
    normalized.includes('403')
  )
}

const blobToDataUrl = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error || new Error('FileReader failed'))
    reader.readAsDataURL(blob)
  })

const persistToGallery = async (
  blob: Blob,
  title: string
): Promise<{ path?: string; error?: string }> => {
  try {
    const dataUrl = await blobToDataUrl(blob)
    const res = await window.electron.ipcRenderer.invoke('save-image-to-gallery', {
      title,
      base64Data: dataUrl
    })
    if (res?.success) return { path: res.path }
    return { error: res?.error || 'Unknown gallery save error' }
  } catch (e: any) {
    return { error: e?.message || String(e) }
  }
}

const TRANSIENT_STATUSES = new Set([408, 429, 500, 502, 503, 504, 522, 524])

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

const fetchPollinationsBlob = async (
  prompt: string,
  onAttempt?: (attempt: number, total: number, model: string) => void
): Promise<Blob> => {
  const totalAttempts = POLLINATIONS_MODELS.length
  let lastError: any = null

  for (let attempt = 1; attempt <= totalAttempts; attempt++) {
    const model = POLLINATIONS_MODELS[(attempt - 1) % POLLINATIONS_MODELS.length]
    onAttempt?.(attempt, totalAttempts, model)
    // Rotate model + seed each attempt to bypass sticky 5xx and edge cache
    const url = buildPollinationsUrl(prompt, attempt - 1)

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 45_000)
      const r = await fetch(url, { signal: controller.signal, cache: 'no-store' })
      clearTimeout(timeoutId)

      if (r.ok) return await r.blob()

      lastError = new Error(`Pollinations error ${r.status}`)
      if (!TRANSIENT_STATUSES.has(r.status)) throw lastError
    } catch (e: any) {
      lastError = e
      const isAbort = e?.name === 'AbortError'
      const isNetwork = !e?.status && !!e?.message
      if (!isAbort && !isNetwork && !TRANSIENT_STATUSES.has(e?.status)) throw e
    }

    if (attempt < totalAttempts) {
      const backoff = 1200 * Math.pow(2, attempt - 1) // 1.2s, 2.4s
      await sleep(backoff)
    }
  }

  throw lastError || new Error('Pollinations: all upstreams exhausted')
}

export const handleImageGeneration = async (prompt: string) => {
  const loadingEvent = new CustomEvent('image-gen', {
    detail: { prompt: prompt, loading: true, url: '' }
  })
  window.dispatchEvent(loadingEvent)

  const dispatchSuccess = (url: string, engine: string, savedPath?: string) => {
    const successEvent = new CustomEvent('image-gen', {
      detail: {
        url,
        prompt,
        loading: false,
        error: false,
        savedPath: savedPath || ''
      }
    })
    window.dispatchEvent(successEvent)
    if (savedPath) {
      return `Visual generated and saved to the Gallery using ${engine}.`
    }
    return `Visual generated using ${engine}, but the Gallery save failed. Tell the user the image is visible but could not be archived.`
  }

  const dispatchError = (errorMessage: string) => {
    const errorEvent = new CustomEvent('image-gen', {
      detail: {
        url: '',
        prompt: prompt,
        loading: false,
        error: true,
        errorMessage
      }
    })
    window.dispatchEvent(errorEvent)
  }

  const dispatchRetry = (attempt: number, total: number, model: string) => {
    if (attempt <= 1) return
    window.dispatchEvent(
      new CustomEvent('image-gen', {
        detail: {
          url: '',
          prompt,
          loading: true,
          retry: { attempt, total, model }
        }
      })
    )
  }

  const runFallback = async () => {
    const blob = await fetchPollinationsBlob(prompt, dispatchRetry)
    const objectUrl = URL.createObjectURL(blob)
    const saveRes = await persistToGallery(blob, prompt)
    return dispatchSuccess(objectUrl, 'SYPHER fallback image engine', saveRes.path)
  }

  try {
    const HF_API_KEY = localStorage.getItem('iris_hf_api_key') || ''

    if (!HF_API_KEY.trim()) {
      return await runFallback()
    }

    const client = new InferenceClient(HF_API_KEY)

    const imageBlob: any = await client.textToImage({
      model: 'black-forest-labs/FLUX.1-schnell',
      inputs: prompt
    })

    const imageUrl = URL.createObjectURL(imageBlob)
    const saveRes = await persistToGallery(imageBlob, prompt)
    return dispatchSuccess(imageUrl, 'FLUX', saveRes.path)
  } catch (e: any) {
    let errorMessage = e?.message || String(e)

    if (errorMessage.includes('503') || errorMessage.includes('loading')) {
      errorMessage = 'Model is warming up (Free Tier). Please try again in 20 seconds.'
    }

    if (shouldUseFallback(errorMessage)) {
      try {
        return await runFallback()
      } catch (fbErr: any) {
        errorMessage = `Fallback engine failed: ${fbErr?.message || String(fbErr)}. Try again in a moment, or add a Hugging Face key in Settings → API Keys for FLUX.`
      }
    }

    dispatchError(errorMessage)
    return `Generation failed: ${errorMessage}`
  }
}
