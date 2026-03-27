export const LEAD_CAPTURE_CONFIG = {
  endpoint: (import.meta.env.VITE_LEAD_WEBHOOK_URL || '').trim(),
  source: 'landing-page-whatsapp',
  enableLocalFallback: false,
  requestHeaders: {
    'Content-Type': 'application/json',
  },
}
