import { motion } from 'framer-motion'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import content from '../content'

const iconMap = {
  calendar: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  building: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  mobile: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  ),
  bell: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  ),
}

const colorMap = {
  blue: 'bg-blue-50 text-blue-600',
  indigo: 'bg-indigo-50 text-indigo-600',
  violet: 'bg-violet-50 text-violet-600',
  sky: 'bg-sky-50 text-sky-600',
}

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof content.features.items)[0]
  index: number
}) {
  const { ref, isInView } = useScrollAnimation()

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
      className="group relative p-8 rounded-2xl bg-white border border-gray-100 hover:border-gray-200 hover:shadow-xl hover:shadow-gray-100/60 transition-all duration-300"
    >
      <div
        className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${colorMap[feature.color as keyof typeof colorMap]} mb-6`}
      >
        {iconMap[feature.icon as keyof typeof iconMap]}
      </div>
      <h3 className="text-xl font-bold text-ink mb-3">{feature.title}</h3>
      <p className="text-gray-500 leading-relaxed">{feature.description}</p>
    </motion.div>
  )
}

export default function Features() {
  const { features } = content
  const { ref: headingRef, isInView: headingInView } = useScrollAnimation()

  return (
    <section id="features" className="py-32 lg:py-48 bg-surface px-6">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <motion.div
          ref={headingRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center mb-20 lg:mb-28"
        >
          <span className="text-sm font-semibold text-accent tracking-widest uppercase">{features.label}</span>
          <h2 className="mt-4 text-4xl lg:text-5xl font-black text-ink tracking-tight text-balance">
            {features.title}
          </h2>
          <p className="mt-5 text-lg text-gray-500 max-w-2xl mx-auto">{features.subtitle}</p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.items.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
