import { motion } from 'framer-motion'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import content from '../content'

const iconMap: Record<string, JSX.Element> = {
  free: (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  noAds: (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
    </svg>
  ),
  clean: (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
  fast: (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
}

export default function PatientBanner() {
  const { patientBanner } = content
  const { ref, isInView } = useScrollAnimation()

  return (
    <section className="py-24 lg:py-32 px-6 bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        className="max-w-5xl mx-auto"
      >
        <div className="relative bg-white rounded-3xl border border-emerald-100 shadow-xl shadow-emerald-500/5 px-8 py-12 lg:px-16 lg:py-16 overflow-hidden">
          {/* Decorative glow */}
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-emerald-200/30 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-teal-200/30 blur-3xl pointer-events-none" />

          <div className="relative z-10 text-center">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700 border border-emerald-200">
              {patientBanner.label}
            </span>

            <h2 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-black tracking-[-0.03em] text-ink leading-[1.05]">
              {patientBanner.title}
            </h2>

            <p className="mt-5 text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
              {patientBanner.subtitle}
            </p>

            <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {patientBanner.highlights.map((h) => (
                <div
                  key={h.text}
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/30">
                    {iconMap[h.icon]}
                  </div>
                  <p className="text-xs font-semibold text-emerald-900 text-center leading-tight">
                    {h.text}
                  </p>
                </div>
              ))}
            </div>

            <a
              href={patientBanner.cta.href}
              className="mt-10 inline-flex items-center gap-2 px-8 py-4 rounded-full bg-emerald-500 text-white font-semibold text-base hover:bg-emerald-600 transition-all duration-200 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98]"
            >
              {patientBanner.cta.text}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
