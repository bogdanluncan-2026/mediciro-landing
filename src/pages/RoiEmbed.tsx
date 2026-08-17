import RoiCalculator from '../components/RoiCalculator'
import { useSeo } from '../hooks/useSeo'

/**
 * Calculatorul ROI singur pe o pagina, fara navbar si fara footer, ca sa poata fi
 * inclus prin <iframe> in alte site-uri (deocamdata codelium.ro).
 *
 * Exista ca ruta separata tocmai ca preturile sa ramana intr-un singur loc: tarifele
 * din formule (299 lei PRO, 5 lei/ora teleconsult, 0,3 lei/SMS) se schimba din cand in
 * cand, iar o copie a calculatorului pe alt site ar incepe sa minta la prima modificare.
 *
 * `noindex`: aceeasi bucata de continut exista deja pe /clinici. Indexata de doua ori,
 * Google le-ar trata drept continut duplicat si ar imparti semnalele intre ele.
 */
export default function RoiEmbed() {
  useSeo({
    title: 'Calculator ROI — MediciRO',
    description:
      'Estimeaza castigul lunar al clinicii cu MediciRO: neprezentari recuperate, pacienti noi si venit din teleconsultatii, minus costul abonamentului.',
    canonical: 'https://mediciro.ro/clinici#calculator-roi',
  })

  return (
    <div className="min-h-screen bg-white px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <RoiCalculator />
        <p className="mx-auto mt-8 max-w-3xl text-center text-xs leading-relaxed text-gray-400">
          Estimări orientative — depind de volumul, tarifele și rata reală de neprezentare a clinicii.
          Calculele se fac în browserul tău; nu trimitem nimic către server.
        </p>
        <div className="mt-6 text-center">
          {/* target="_top" scoate vizitatorul din iframe: altfel MediciRO s-ar deschide
              inauntrul ferestrei mici, ceea ce arata a site stricat. */}
          <a
            href="https://mediciro.ro/clinici"
            target="_top"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-base font-bold text-white shadow-lg shadow-blue-200 transition-colors hover:bg-blue-700"
          >
            Vezi MediciRO pentru clinici
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}
