import { trackCta } from '../utils/analytics'

/**
 * Banda subtire de sus, catre /clinici.
 *
 * Pagina principala vorbeste cu pacientii, dar clinicile sunt cele care platesc; pana acum
 * ajungeau la oferta lor doar printr-un link trimis manual. Banda ocupa exact cei 36px pe care
 * antetul ii rezerva deja (`fixed top-9`), deci nu misca nimic din pagina.
 *
 * Deliberat discreta: un pacient care o vede trebuie s-o poata ignora fara efort.
 */
export default function ClinicsBand() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-9 bg-blue-600 text-white">
      <a
        href="/clinici"
        onClick={() => trackCta('Banda clinici', 'homepage_clinics_band', '/clinici')}
        className="h-full max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-center gap-2 text-[13px] font-medium hover:bg-blue-700 transition-colors"
      >
        <span className="hidden sm:inline">Ai o clinică?</span>
        <span>Vezi cum îți muți programările online</span>
        <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </a>
    </div>
  )
}
