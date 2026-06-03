import { motion } from 'framer-motion'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import content from '../content'
import { trackCta } from '../utils/analytics'
import TeleconsultDemo, { VideoIcon } from './TeleconsultDemo'

const CheckIcon = () => (
  <svg className="w-5 h-5 flex-shrink-0 mt-0.5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
)

export default function Teleconsult() {
  const { teleconsult } = content
  const { ref, isInView } = useScrollAnimation()

  return (
    <section id="teleconsult" className="py-32 lg:py-48 bg-surface px-6">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center max-w-3xl mx-auto mb-16 lg:mb-20"
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-accent/10 text-accent border border-accent/20">
            <VideoIcon /> {teleconsult.label}
          </span>
          <h2 className="mt-5 text-4xl lg:text-5xl font-black text-ink tracking-tight text-balance">
            {teleconsult.title}
          </h2>
          <p className="mt-5 text-lg text-gray-500 leading-relaxed">{teleconsult.subtitle}</p>
        </motion.div>

        {/* Two perspectives */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <TeleconsultDemo />
        </motion.div>

        {/* Benefits */}
        <div className="mt-16 lg:mt-20 grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {teleconsult.items.map((it) => (
            <div key={it.title} className="flex items-start gap-3">
              <CheckIcon />
              <div>
                <h3 className="font-bold text-ink text-sm">{it.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mt-1">{it.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <a
            href={teleconsult.cta.href}
            onClick={() => trackCta(teleconsult.cta.text, 'teleconsult', teleconsult.cta.href)}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-primary text-white font-semibold text-sm hover:bg-accent transition-all duration-200 shadow-md shadow-primary/20"
          >
            {teleconsult.cta.text}
          </a>
          <span className="text-sm text-gray-400">{teleconsult.note}</span>
        </div>
      </div>
    </section>
  )
}
