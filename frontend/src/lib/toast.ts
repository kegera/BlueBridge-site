// Global singleton toast — call toast() from anywhere, no context needed
export type ToastVariant = 'default' | 'success' | 'destructive'

export interface ToastPayload {
  title: string
  description?: string
  variant?: ToastVariant
  duration?: number
}

export function toast(payload: ToastPayload) {
  window.dispatchEvent(new CustomEvent('bb:toast', { detail: payload }))
}
