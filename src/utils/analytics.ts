/**
 * Analytics utilities — MED-84
 *
 * Pushes events to GTM dataLayer. GTM forwards them to GA4 via
 * the `cta_click` Custom Event trigger (configured in GTM UI).
 *
 * Safe to call even when the user declined cookies — dataLayer.push()
 * still runs, but GTM Consent Mode blocks GA4 tags from firing.
 */

export type CtaLocation =
  // Homepage (/)
  | 'hero_clinic'
  | 'hero_patient'
  | 'patient_banner'
  | 'teleconsult'
  | 'pricing'
  | 'pricing_addon'
  | 'final_cta'
  // Clinici landing (/clinici)
  | 'clinici_navbar'
  | 'clinici_hero'
  | 'clinici_how_it_works'
  | 'clinici_features'
  | 'clinici_pricing'
  | 'clinici_calculator'
  | 'clinici_final_cta'
  // Navbar & overlays
  | 'navbar_login'
  | 'docs_overlay'
  // Footer
  | 'footer'

/**
 * Track a CTA button/link click.
 *
 * @param text        Visible button text (e.g. "Înregistrează clinica")
 * @param location    Where on the page the CTA lives
 * @param destination Target URL
 */
export function trackCta(text: string, location: CtaLocation, destination: string): void {
  window.dataLayer?.push({
    event: 'cta_click',
    cta_text: text,
    cta_location: location,
    cta_destination: destination,
  })
}

/**
 * Track a generic custom event (forwarded to GA4 if a matching GTM
 * Custom Event trigger exists). Used e.g. for `calculator_engaged`.
 */
export function trackEvent(event: string, params: Record<string, unknown> = {}): void {
  window.dataLayer?.push({ event, ...params })
}
