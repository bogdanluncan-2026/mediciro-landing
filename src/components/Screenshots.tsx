import { motion } from 'framer-motion'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import content from '../content'

function MockScreen({
  screen,
  index,
}: {
  screen: (typeof content.screenshots.images)[0]
  index: number
}) {
  const { ref, isInView } = useScrollAnimation()

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, scale: 0.97 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.7, delay: index * 0.12, ease: [0.25, 0.1, 0.25, 1] }}
      className="flex flex-col"
    >
      {/* Browser mockup */}
      <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-2xl shadow-gray-200/60">
        {/* Browser bar */}
        <div className="flex items-center gap-1.5 px-4 py-3 bg-gray-50 border-b border-gray-200">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
          <div className="flex-1 mx-4">
            <div className="h-5 rounded-md bg-white border border-gray-200 px-3 flex items-center">
              <span className="text-xs text-gray-400">{content.screenshots.appUrl}</span>
            </div>
          </div>
        </div>

        {/* Screen content placeholder */}
        <div className={`relative h-52 sm:h-64 bg-gradient-to-br ${screen.gradientColor} flex items-center justify-center overflow-hidden`}>
          {/* Simulated UI elements */}
          <div className="absolute inset-0 p-4 flex flex-col gap-2 opacity-30">
            <div className="flex gap-2">
              <div className="w-24 h-6 rounded bg-white/40" />
              <div className="w-16 h-6 rounded bg-white/20" />
            </div>
            <div className="flex gap-2 mt-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex-1 h-28 rounded-lg bg-white/20" />
              ))}
            </div>
            <div className="flex gap-2">
              <div className="flex-1 h-8 rounded bg-white/30" />
              <div className="flex-1 h-8 rounded bg-white/20" />
              <div className="flex-1 h-8 rounded bg-white/30" />
            </div>
          </div>

          {/* Label */}
          <div className="relative text-center">
            <div className={`inline-flex w-14 h-14 rounded-2xl ${screen.accentColor} bg-opacity-80 items-center justify-center mb-3 mx-auto`}>
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-white font-semibold text-sm">{content.screenshots.placeholderText}</p>
          </div>
        </div>
      </div>

      {/* Caption */}
      <div className="mt-4 px-1">
        <h4 className="font-semibold text-ink">{screen.caption}</h4>
        <p className="text-sm text-gray-500 mt-1">{screen.description}</p>
      </div>
    </motion.div>
  )
}

export default function Screenshots() {
  const { screenshots } = content
  const { ref: headingRef, isInView: headingInView } = useScrollAnimation()

  return (
    <section id="screenshots" className="py-32 lg:py-48 bg-surface px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={headingRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-accent tracking-widest uppercase">{screenshots.label}</span>
          <h2 className="mt-4 text-4xl lg:text-5xl font-black text-ink tracking-tight">{screenshots.title}</h2>
          <p className="mt-5 text-lg text-gray-500 max-w-xl mx-auto">{screenshots.subtitle}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {screenshots.images.map((screen, index) => (
            <MockScreen key={screen.caption} screen={screen} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
