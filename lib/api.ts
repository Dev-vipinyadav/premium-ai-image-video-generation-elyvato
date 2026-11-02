export const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || process.env.VITE_API_URL || 'https://triviai.elyvato.com').replace(/\/$/, '').replace(/\/api$/, '') + '/api'

export const API_ENDPOINTS = {
  generateImage: `${API_BASE_URL}/generate/image`,
  generateVideo: `${API_BASE_URL}/generate/video`,
  generateHistory: `${API_BASE_URL}/generate/history`,
} as const

function authHeaders(): Record<string, string> {
  if (typeof window === 'undefined') return {}
  try {
    const session = JSON.parse(localStorage.getItem('triviai.auth') || 'null') as { token?: string; token_type?: string } | null
    return session?.token ? { Authorization: `${session.token_type || 'Bearer'} ${session.token}` } : {}
  } catch { return {} }
}

type ApiPayload = Record<string, unknown>

function apiError(payload: unknown, fallback: string): string {
  if (payload && typeof payload === 'object') {
    const record = payload as ApiPayload
    if (typeof record.message === 'string') return record.message
    if (typeof record.error === 'string') return record.error
    if (record.errors && typeof record.errors === 'object') {
      const firstError = Object.values(record.errors as Record<string, unknown>).flatMap(value => Array.isArray(value) ? value : [value]).find(value => typeof value === 'string')
      if (typeof firstError === 'string') return firstError
    }
  }
  return fallback
}

async function readPayload(response: Response): Promise<unknown> {
  return response.json().catch(() => ({})) as Promise<unknown>
}

function findUrl(payload: unknown): string | undefined {
  if (!payload || typeof payload !== 'object') return undefined
  const record = payload as ApiPayload
  // Prefer an application-hosted/permanent URL when both it and a provider URL exist.
  for (const key of ['permanent_video_url', 'stored_video_url', 'video_url', 'videoUrl', 'url', 'file_url', 'fileUrl', 'asset_url', 'assetUrl', 'path']) {
    if (typeof record[key] === 'string') return record[key] as string
  }
  for (const key of ['data', 'content', 'file', 'asset', 'result', 'video', 'output']) {
    const url = findUrl(record[key])
    if (url) return url
  }
}

function findTaskId(payload: unknown): string | undefined {
  if (!payload || typeof payload !== 'object') return undefined
  const record = payload as ApiPayload
  for (const key of ['task_id', 'taskId', 'generation_id', 'generationId', 'id', 'uuid']) {
    const value = record[key]
    if (typeof value === 'string' || typeof value === 'number') return String(value)
  }
  for (const key of ['data', 'task', 'generation']) {
    const id = findTaskId(record[key])
    if (id) return id
  }
}

function findStatus(payload: unknown): string | undefined {
  if (!payload || typeof payload !== 'object') return undefined
  const record = payload as ApiPayload
  for (const key of ['status', 'state']) {
    if (typeof record[key] === 'string') return (record[key] as string).toLowerCase()
  }
  for (const key of ['data', 'task', 'generation', 'result']) {
    const status = findStatus(record[key])
    if (status) return status
  }
}

function findTaskError(payload: unknown): string | undefined {
  if (!payload || typeof payload !== 'object') return undefined
  const record = payload as ApiPayload
  for (const key of ['error', 'failure_reason', 'failureReason']) {
    if (typeof record[key] === 'string' && (record[key] as string).trim()) return record[key] as string
  }
  for (const key of ['data', 'task', 'generation']) {
    const message = findTaskError(record[key])
    if (message) return message
  }
}

const wait = (milliseconds: number) => new Promise(resolve => setTimeout(resolve, milliseconds))

async function pollVideoTask(taskId: string, signal?: AbortSignal, onProgress?: (status: string) => void): Promise<GeneratedVideo> {
  const endpoint = `${API_ENDPOINTS.generateVideo}/${encodeURIComponent(taskId)}`
  const deadline = Date.now() + 30 * 60 * 1000
  let attempt = 0
  while (Date.now() < deadline) {
    if (signal?.aborted) throw new DOMException('Video generation was cancelled.', 'AbortError')
    if (attempt++ > 0) await wait(3000)
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: { Accept: 'application/json', ...authHeaders() },
      cache: 'no-store',
      signal,
    })
    const payload = await readPayload(response)
    if (!response.ok) throw new Error(apiError(payload, `Could not check video generation status (${response.status})`))

    const status = findStatus(payload)
    if (status) onProgress?.(status)
    const videoUrl = findUrl(payload)
    if (status && ['failed', 'failure', 'error', 'cancelled', 'canceled'].includes(status)) {
      throw new Error(findTaskError(payload) ?? apiError(payload, `Video generation ${status}.`))
    }
    if (status && ['succeeded', 'completed', 'complete', 'success', 'finished', 'ready', 'done'].includes(status)) {
      if (!videoUrl) throw new Error('Video generation succeeded, but the API response did not include a video URL.')
      return { url: videoUrl, id: taskId, ...(findDownloadUrl(payload) ? { downloadUrl: findDownloadUrl(payload) } : {}) }
    }
    if (videoUrl && !status) return { url: videoUrl, id: taskId, ...(findDownloadUrl(payload) ? { downloadUrl: findDownloadUrl(payload) } : {}) }
  }
  throw new Error('Video generation is taking longer than expected. Check generation history for the result.')
}

export type GenerateVideoOptions = {
  prompt: string
  model?: string
  resolution: string
  aspectRatio: string
  duration: number
  watermark: boolean
  generateAudio: boolean
  referenceImages: File[]
  referenceVideos: File[]
  referenceAudios: File[]
}

export type GeneratedVideo = { url: string; id?: string; downloadUrl?: string }

function findDownloadUrl(payload: unknown): string | undefined {
  if (!payload || typeof payload !== 'object') return undefined
  const record = payload as ApiPayload
  for (const key of ['download_url', 'downloadUrl']) if (typeof record[key] === 'string') return record[key] as string
  for (const key of ['data', 'task', 'generation', 'result', 'video', 'output']) {
    const url = findDownloadUrl(record[key])
    if (url) return url
  }
}

export async function generateVideo(options: GenerateVideoOptions, signal?: AbortSignal, onProgress?: (status: string) => void): Promise<GeneratedVideo> {
  const body = new FormData()
  body.append('prompt', options.prompt)
  if (options.model) body.append('model', options.model)
  body.append('resolution', options.resolution)
  body.append('aspect_ratio', options.aspectRatio)
  body.append('duration', String(options.duration))
  body.append('watermark', String(options.watermark))
  body.append('generate_audio', String(options.generateAudio))
  options.referenceImages.forEach(file => body.append('reference_images[]', file))
  options.referenceVideos.forEach(file => body.append('reference_videos[]', file))
  options.referenceAudios.forEach(file => body.append('reference_audios[]', file))
  const response = await fetch(API_ENDPOINTS.generateVideo, {
    method: 'POST',
    headers: { Accept: 'application/json', ...authHeaders() },
    body,
    signal,
  })
  const payload = await readPayload(response)
  if (!response.ok) throw new Error(apiError(payload, `Video generation failed (${response.status})`))
  const url = findUrl(payload)
  const taskId = findTaskId(payload)
  const status = findStatus(payload)
  if (status && ['failed', 'failure', 'error', 'cancelled', 'canceled'].includes(status)) throw new Error(findTaskError(payload) ?? apiError(payload, `Video generation ${status}.`))
  if (status && ['succeeded', 'completed', 'complete', 'success', 'finished', 'ready', 'done'].includes(status)) {
    if (!url) throw new Error('Video generation succeeded, but the API response did not include a video URL.')
    return { url, ...(taskId ? { id: taskId } : {}), ...(findDownloadUrl(payload) ? { downloadUrl: findDownloadUrl(payload) } : {}) }
  }
  if (url && !taskId) return { url, ...(findDownloadUrl(payload) ? { downloadUrl: findDownloadUrl(payload) } : {}) }
  if (!taskId) throw new Error(apiError(payload, 'The API response did not include a task ID.'))
  onProgress?.('queued')
  return pollVideoTask(taskId, signal, onProgress)
}

export type GenerationHistoryItem = {
  id: string
  type: 'image' | 'video'
  url: string
  prompt?: string
  createdAt?: string
}

type HistoryRecord = Record<string, unknown>

function getString(record: HistoryRecord, keys: string[]): string | undefined {
  for (const key of keys) {
    const value = record[key]
    if (typeof value === 'string' && value.trim()) return value
  }
}

function normalizeHistory(payload: unknown): GenerationHistoryItem[] {
  let records: unknown = payload
  if (records && typeof records === 'object' && !Array.isArray(records)) {
    const response = records as Record<string, unknown>
    records = response.data ?? response.history ?? response.results ?? response.generations
    if (records && typeof records === 'object' && !Array.isArray(records)) {
      records = (records as Record<string, unknown>).data ?? (records as Record<string, unknown>).items
    }
  }
  if (!Array.isArray(records)) return []

  return records.flatMap((value, index) => {
    if (!value || typeof value !== 'object') return []
    const record = value as HistoryRecord
    const url = getString(record, ['url', 'image_url', 'imageUrl', 'video_url', 'videoUrl', 'output_url', 'output', 'path', 'file_url'])
    if (!url) return []
    const rawType = (getString(record, ['type', 'media_type', 'generation_type']) ?? '').toLowerCase()
    const type = rawType.includes('video') || /\.(mp4|webm|mov)(\?|$)/i.test(url) ? 'video' : 'image'
    return [{
      id: String(record.id ?? record.uuid ?? `${index}-${url}`),
      type,
      url,
      prompt: getString(record, ['prompt', 'description']),
      createdAt: getString(record, ['created_at', 'createdAt', 'date']),
    }]
  })
}

export async function getGenerationHistory(): Promise<GenerationHistoryItem[]> {
  const response = await fetch(API_ENDPOINTS.generateHistory, {
    method: 'GET',
    headers: { Accept: 'application/json', ...authHeaders() },
    cache: 'no-store',
  })
  const payload = await response.json().catch(() => ({})) as unknown
  if (!response.ok) {
    const errorPayload = payload && typeof payload === 'object' ? payload as Record<string, unknown> : {}
    throw new Error(typeof errorPayload.message === 'string' ? errorPayload.message : `Could not load generation history (${response.status})`)
  }
  return normalizeHistory(payload)
}

export type GenerateImageOptions = {
  prompt: string
  aspectRatio: string
  referenceImage?: File | null
}

type ImageApiResponse = {
  image_url?: string
  imageUrl?: string
  image?: string
  url?: string
  data?: string | { image_url?: string; image?: string; url?: string }
  message?: string
  error?: string
}

function extractImageSource(payload: ImageApiResponse): string | null {
  const data = typeof payload.data === 'object' && payload.data !== null ? payload.data : undefined
  const candidate = payload.image_url ?? payload.imageUrl ?? payload.image ?? payload.url ?? data?.image_url ?? data?.image ?? data?.url ?? (typeof payload.data === 'string' ? payload.data : undefined)

  if (!candidate) return null
  if (candidate.startsWith('data:image/') || candidate.startsWith('http://') || candidate.startsWith('https://') || candidate.startsWith('/')) return candidate
  // Laravel APIs often return a bare base64-encoded image.
  return `data:image/png;base64,${candidate}`
}

export async function generateImage({ prompt, aspectRatio, referenceImage }: GenerateImageOptions): Promise<string> {
  const body = new FormData()
  body.append('prompt', prompt)
  body.append('aspect_ratio', aspectRatio)
  if (referenceImage) body.append('reference_image', referenceImage)

  const response = await fetch(API_ENDPOINTS.generateImage, {
    method: 'POST',
    headers: { Accept: 'application/json', ...authHeaders() },
    body,
  })

  const payload = await response.json().catch(() => ({})) as ImageApiResponse
  if (!response.ok) {
    throw new Error(payload.message || payload.error || `Image generation failed (${response.status})`)
  }

  const imageSource = extractImageSource(payload)
  if (!imageSource) {
    throw new Error(payload.message || 'The API response did not include an image URL or image data.')
  }
  return imageSource
}
