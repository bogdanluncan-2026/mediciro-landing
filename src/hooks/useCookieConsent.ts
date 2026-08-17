import { useState, useCallback } from 'react'

// Extend Window to include gtag (injected by GTM in MED-82)
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    dataLayer?: unknown[]
    /** Injecteaza Meta Pixel; definita in index.html, apelata doar dupa consimtamant. */
    loadMetaPixel?: () => void
  }
}

export type ConsentStatus = 'accepted' | 'declined' | null

const STORAGE_KEY = 'mediciro_cookie_consent'

function readStoredConsent(): ConsentStatus {
  try {
    return (localStorage.getItem(STORAGE_KEY) as ConsentStatus) ?? null
  } catch {
    // localStorage blocked (e.g. strict incognito mode)
    return null
  }
}

function updateGtagConsent(granted: boolean) {
  if (typeof window.gtag === 'function') {
    window.gtag('consent', 'update', {
      analytics_storage: granted ? 'granted' : 'denied',
      ad_storage: granted ? 'granted' : 'denied',
      ad_user_data: granted ? 'granted' : 'denied',
      ad_personalization: granted ? 'granted' : 'denied',
    })
  }
}

/**
 * Manages cookie consent state, persisted in localStorage.
 *
 * - `showBanner` is true only when the user has not yet made a choice.
 * - `accept()` grants consent and signals GTM Consent Mode v2.
 * - `decline()` declines consent (GTM tags remain blocked).
 */
export function useCookieConsent() {
  const [consent, setConsent] = useState<ConsentStatus>(readStoredConsent)

  const accept = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, 'accepted')
    } catch { /* ignore */ }
    setConsent('accepted')
    updateGtagConsent(true)
    // Meta Pixel nu e incarcat pana aici; abia acum are voie sa scrie cookie-uri.
    window.loadMetaPixel?.()
  }, [])

  const decline = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, 'declined')
    } catch { /* ignore */ }
    setConsent('declined')
    updateGtagConsent(false)
  }, [])

  return {
    consent,
    showBanner: consent === null,
    accept,
    decline,
  }
}
