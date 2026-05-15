import { motion } from 'framer-motion'
import content from '../content'

const iconMap: Record<string, JSX.Element> = {
  building: (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M3 21h18M3 7l9-4 9 4M4 7v14M20 7v14M8 10h2m4 0h2M8 14h2m4 0h2M8 18h2m4 0h2" />
    </svg>
  ),
  users: (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-4a4 4 0 11-8 0 4 4 0 018 0zm6 4a2 2 0 11-4 0 2 2 0 014 0zM5 16a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  stethoscope: (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v11a3 3 0 006 0V3M3 9h18M3 13h4m10 0h4" />
    </svg>
  ),
  heart: (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
}

const colorMap: Record<string, { bg: string; text: string; badge: string; btn: string }> = {
  blue:   { bg: 'bg-blue-50',    text: 'text-blue-700',    badge: 'bg-blue-100 text-blue-700',    btn: 'bg-blue-600 hover:bg-blue-700' },
  green:  { bg: 'bg-emerald-50', text: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-700', btn: 'bg-emerald-600 hover:bg-emerald-700' },
  purple: { bg: 'bg-violet-50',  text: 'text-violet-700',  badge: 'bg-violet-100 text-violet-700',  btn: 'bg-violet-600 hover:bg-violet-700' },
  orange: { bg: 'bg-orange-50',  text: 'text-orange-700',  badge: 'bg-orange-100 text-orange-700',  btn: 'bg-orange-600 hover:bg-orange-700' },
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const docs = (content as any).docs as {
  label: string
  title: string
  subtitle: string
  guides: Array<{ role: string; icon: string; color: string; description: string; file: string; available: boolean }>
}

export default function DocsOverlay({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] bg-white overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-100 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                <path d="M3 12h3l2.5-5 4 10 2.5-5H21" stroke="white" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-xl font-bold text-ink tracking-tight">
              Medici<span className="text-accent">RO</span>
            </span>
            <span className="text-gray-300 mx-1">·</span>
            <span className="text-sm font-medium text-gray-500">Documentație</span>
          </div>
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-ink transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Închide
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-14">
          <span className="text-sm font-semibold text-accent tracking-widest uppercase">
            {docs.label}
          </span>
          <h1 className="mt-4 text-4xl font-black text-ink tracking-tight">{docs.title}</h1>
          <p className="mt-4 text-lg text-gray-500 max-w-xl mx-auto">{docs.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {docs.guides.map((guide, i) => {
            const colors = colorMap[guide.color] ?? colorMap.blue
            return (
              <motion.div
                key={guide.role}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="bg-white border border-gray-200 rounded-2xl p-7 shadow-sm flex flex-col gap-5"
              >
                <div className="flex items-start gap-4">
                  <div className={`${colors.bg} ${colors.text} p-3 rounded-xl flex-shrink-0`}>
                    {iconMap[guide.icon]}
                  </div>
                  <div>
                    <span className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full mb-2 ${colors.badge}`}>
                      {guide.role}
                    </span>
                    <p className="text-sm text-gray-600 leading-relaxed">{guide.description}</p>
                  </div>
                </div>
                {guide.available ? (
                  <a
                    href={guide.file}
                    download
                    className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors ${colors.btn}`}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 10v6m0 0l-3-3m3 3l3-3M3 17v3a1 1 0 001 1h16a1 1 0 001-1v-3" />
                    </svg>
                    Descarcă ghidul PDF
                  </a>
                ) : (
                  <span className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-400 bg-gray-100 cursor-not-allowed">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Documentație în lucru
                  </span>
                )}
              </motion.div>
            )
          })}
        </div>

        <p className="text-center text-sm text-gray-400 mt-12">
          Ai întrebări? Scrie-ne la{' '}
          <a href="mailto:contact@mediciro.ro" className="text-primary hover:underline">
            contact@mediciro.ro
          </a>
        </p>
      </div>
    </div>
  )
}
