import { useCookieConsent } from '../hooks/useCookieConsent'

/**
 * Cookie consent banner — MED-83.
 *
 * Shown on first visit. User choice is persisted in localStorage.
 * Accepting signals GTM Consent Mode v2 (`gtag consent update`).
 * Declining keeps all tags blocked (default denied from index.html).
 *
 * Must be rendered once at app root level (App.tsx).
 */
export default function CookieConsentBanner() {
  const { showBanner, accept, decline } = useCookieConsent()

  if (!showBanner) return null

  return (
    <div
      role="dialog"
      aria-label="Consimțământ cookie-uri"
      aria-live="polite"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white shadow-[0_-4px_24px_rgba(0,0,0,0.08)]"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:px-6 lg:px-8">
        {/* Message */}
        <p className="flex-1 text-sm leading-relaxed text-gray-600">
          Folosim cookie-uri pentru a analiza traficul și a îmbunătăți experiența pe site.
          Nu colectăm date personale fără acordul dvs.{' '}
          <a
            href="https://app.mediciro.ro/cookies"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-blue-600 underline underline-offset-2 hover:text-blue-700"
          >
            Politica de cookies
          </a>
          .
        </p>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={decline}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400"
          >
            Refuz
          </button>
          <button
            type="button"
            onClick={accept}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Acceptă cookie-urile
          </button>
        </div>
      </div>
    </div>
  )
}
