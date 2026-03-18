import { getToken } from './auth'

const BASE = '/api'

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
  }
}

export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${BASE}${path}`, { ...options, headers })

  if (!res.ok) {
    let msg = `HTTP ${res.status}`
    try { msg = (await res.json()).error ?? msg } catch {}
    throw new ApiError(res.status, msg)
  }

  const text = await res.text()
  return text ? JSON.parse(text) : ({} as T)
}
