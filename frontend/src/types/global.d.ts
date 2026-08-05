export {}

declare global {
  interface Window {
    onTurnstileSuccess?: (token: string) => void
    onTurnstileExpired?: () => void
    turnstile?: {
      reset: (widget?: string | HTMLElement) => void
    }
  }
}