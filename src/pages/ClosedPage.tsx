// MediciRO closed in November 2026. Every route of mediciro.ro shows this page.
// The previous landing page is in the git history (commit fb2a6dc and earlier).
export default function ClosedPage() {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="max-w-xl text-center">
        <img src="/logo.svg" alt="MediciRO" className="h-10 mx-auto mb-10" />
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-gray-900 mb-6">
          MediciRO și-a încetat activitatea
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed mb-4">
          Începând cu noiembrie 2026, platforma MediciRO nu mai este disponibilă.
        </p>
        <p className="text-lg text-gray-600 leading-relaxed mb-10">
          Mulțumim clinicilor, medicilor și pacienților care ne-au acordat încredere.
        </p>
        <p className="text-sm text-gray-500">
          Pentru întrebări:{' '}
          <a href="mailto:contact@mediciro.ro" className="text-blue-600 hover:underline">
            contact@mediciro.ro
          </a>
        </p>
        <p className="text-xs text-gray-400 mt-12">© 2026 CODELIUM S.R.L.</p>
      </div>
    </main>
  )
}
