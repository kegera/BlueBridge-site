export interface DecodedToken {
  sub: number
  email: string
  full_name: string
  role: 'student' | 'instructor'
  exp: number
}

const KEY = 'bb_token'

export const getToken = (): string | null => localStorage.getItem(KEY)
export const setToken = (t: string): void => localStorage.setItem(KEY, t)
export const clearToken = (): void => localStorage.removeItem(KEY)

export function decodeToken(token: string): DecodedToken | null {
  try {
    const payload = token.split('.')[1]
    return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')))
  } catch {
    return null
  }
}

export function isTokenValid(token: string | null): boolean {
  if (!token) return false
  const d = decodeToken(token)
  if (!d) return false
  return d.exp * 1000 > Date.now()
}
