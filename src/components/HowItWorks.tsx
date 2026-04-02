import { motion } from 'framer-motion'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import content from '../content'

const iconMap = {
  building: (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  users: (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  checkCircle: (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
}

function Step({
  step,
  index,
  isLast,
}: {
  step: (typeof content.howItWorks.steps)[0]
  index: number
  isLast: boolean
}) {
  const { ref, isInView } = useScrollAnimation()

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay: index * 0.15, ease: [0.25, 0.1, 0.25, 1] }}
      className="relative flex flex-col items-center text-center lg:items-start lg:text-left"
    >
      {/* Connector line (desktop) */}
      {!isLast && (
        <div className="hidden lg:block absolute top-8 left-[calc(50%+3rem)] right-0 h-px bg-gradient-to-r from-gray-200 to-transparent" />
      )}

      {/* Icon + number */}
      <div className="relative mb-6">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
          {iconMap[step.icon as keyof typeof iconMap]}
        </div>
        <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
          {index + 1}
        </span>
      </div>

      <h3 className="text-xl font-bold text-ink mb-3">{step.title}</h3>
      <p className="text-gray-500 leading-relaxed max-w-xs">{step.description}</p>
    </motion.div>
  )
}

export default function HowItWorks() {
  const { howItWorks } = content
  const { ref: headingRef, isInView: headingInView } = useScrollAnimation()

  return (
    <section id="how-it-works" className="py-32 lg:py-48 bg-white px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={headingRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center mb-16 lg:mb-20"
        >
          <span className="text-sm font-semibold text-accent tracking-widest uppercase">{howItWorks.label}</span>
          <h2 className="mt-4 text-4xl lg:text-5xl font-black text-ink tracking-tight">{howItWorks.title}</h2>
          <p className="mt-5 text-lg text-gray-500 max-w-xl mx-auto">{howItWorks.subtitle}</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8">
          {howItWorks.steps.map((step, index) => (
            <Step
              key={step.number}
              step={step}
              index={index}
              isLast={index === howItWorks.steps.length - 1}
            />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center mt-14"
        >
          <a
            href={howItWorks.cta.href}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-primary text-white font-semibold hover:bg-accent transition-colors duration-200 shadow-lg shadow-primary/20"
          >
            {howItWorks.cta.text}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
