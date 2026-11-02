import { API_BASE_URL } from './api'

export type AuthUser = { id: number; name: string; email: string; mobile: string }
export type AuthSession = { token: string; token_type: string; user: AuthUser }

export const AUTH_STORAGE_KEY = 'triviai.auth'

export function readAuthSession(): AuthSession | null {
  if (typeof window === 'undefined') return null
  try {
    const value = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!value) return null
    const parsed = JSON.parse(value) as AuthSession
    return parsed?.token && parsed.user ? parsed : null
  } catch { return null }
}

export function saveAuthSession(session: AuthSession) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session))
}

export async function authenticate(path: 'register' | 'login', values: Record<string, string>): Promise<AuthSession> {
  const response = await fetch(`${API_BASE_URL}/${path}`, {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify(values),
  })
  const payload = await response.json().catch(() => ({})) as Record<string, any>
  if (!response.ok || payload.success === false || typeof payload.token !== 'string' || !payload.user) {
    const firstValidationError = payload.errors && Object.values(payload.errors as Record<string, unknown>).flatMap(value => Array.isArray(value) ? value : [value]).find(value => typeof value === 'string')
    throw new Error(typeof firstValidationError === 'string' ? firstValidationError : typeof payload.message === 'string' ? payload.message : 'Authentication failed. Please try again.')
  }
  return { token: payload.token, token_type: payload.token_type || 'Bearer', user: payload.user as AuthUser }
}
