import { motion } from 'framer-motion'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import content from '../content'

export default function FinalCTA() {
  const { finalCta } = content
  const { ref, isInView } = useScrollAnimation(0.2)

  return (
    <section id="contact" className="py-24 lg:py-32 px-6 bg-surface">
      <div className="max-w-4xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative rounded-3xl bg-gradient-to-br from-primary to-accent p-12 lg:p-16 text-center overflow-hidden"
        >
          {/* Background decoration */}
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/5 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-white/5 blur-3xl pointer-events-none" />

          {/* Content */}
          <div className="relative z-10">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white/90 text-xs font-semibold mb-6">
              {finalCta.badge}
            </span>

            <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tight text-balance mb-6">
              {finalCta.title}
            </h2>

            <p className="text-blue-100 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
              {finalCta.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={finalCta.ctaPrimary.href}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white text-primary font-bold text-base hover:bg-blue-50 transition-all duration-200 shadow-xl shadow-black/10 hover:scale-[1.02] active:scale-[0.98]"
              >
                {finalCta.ctaPrimary.text}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <a
                href={finalCta.ctaSecondary.href}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border-2 border-white/30 text-white font-semibold text-base hover:border-white/50 hover:bg-white/10 transition-all duration-200"
              >
                {finalCta.ctaSecondary.text}
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
