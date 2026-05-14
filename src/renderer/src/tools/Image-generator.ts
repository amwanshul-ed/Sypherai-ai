import { InferenceClient } from '@huggingface/inference'

const buildPollinationsUrl = (prompt: string) => {
  const params = new URLSearchParams({
    width: '1024',
    height: '1024',
    nologo: 'true',
    private: 'true',
    enhance: 'true'
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

export const handleImageGeneration = async (prompt: string) => {
  const loadingEvent = new CustomEvent('image-gen', {
    detail: { prompt: prompt, loading: true, url: '' }
  })
  window.dispatchEvent(loadingEvent)

  const dispatchSuccess = (url: string, engine: string) => {
    const successEvent = new CustomEvent('image-gen', {
      detail: {
        url,
        prompt,
        loading: false,
        error: false
      }
    })
    window.dispatchEvent(successEvent)
    return `Visual generated successfully using ${engine}.`
  }

  try {
    const HF_API_KEY = localStorage.getItem('iris_hf_api_key') || ''

    if (!HF_API_KEY.trim()) {
      return dispatchSuccess(buildPollinationsUrl(prompt), 'SYPHER fallback image engine')
    }

    const client = new InferenceClient(HF_API_KEY)

    const imageBlob: any = await client.textToImage({
      model: 'black-forest-labs/FLUX.1-schnell',
      inputs: prompt
    })

    const imageUrl = URL.createObjectURL(imageBlob)
    return dispatchSuccess(imageUrl, 'FLUX')
  } catch (e: any) {
    let errorMessage = e.message || String(e)

    if (errorMessage.includes('503') || errorMessage.includes('loading')) {
      errorMessage = 'Model is warming up (Free Tier). Please try again in 20 seconds.'
    }

    if (shouldUseFallback(errorMessage)) {
      return dispatchSuccess(buildPollinationsUrl(prompt), 'SYPHER fallback image engine')
    }

    const errorEvent = new CustomEvent('image-gen', {
      detail: {
        url: '',
        prompt: prompt,
        loading: false,
        error: true,
        errorMessage: errorMessage
      }
    })
    window.dispatchEvent(errorEvent)

    return `Generation failed: ${errorMessage}`
  }
}
