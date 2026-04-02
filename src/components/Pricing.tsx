import { motion } from 'framer-motion'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import content from '../content'

function PricingCard({
  plan,
  index,
}: {
  plan: (typeof content.pricing.plans)[0]
  index: number
}) {
  const { ref, isInView } = useScrollAnimation()

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay: index * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
      className={`relative flex flex-col rounded-3xl p-8 ${
        plan.highlighted
          ? 'bg-primary text-white shadow-2xl shadow-primary/30 scale-[1.03] ring-2 ring-accent'
          : 'bg-white border border-gray-200 shadow-sm'
      }`}
    >
      {plan.badge && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-accent text-white text-xs font-bold tracking-wide shadow-lg">
            {plan.badge}
          </span>
        </div>
      )}

      <div className="mb-6">
        <h3 className={`text-lg font-bold mb-1 ${plan.highlighted ? 'text-white' : 'text-ink'}`}>
          {plan.name}
        </h3>
        <p className={`text-sm leading-relaxed ${plan.highlighted ? 'text-blue-200' : 'text-gray-500'}`}>
          {plan.description}
        </p>
      </div>

      <div className="mb-8">
        {plan.currency === '' ? (
          <span className={`text-4xl font-black ${plan.highlighted ? 'text-white' : 'text-ink'}`}>
            {plan.price}
          </span>
        ) : (
          <div className="flex items-baseline gap-1">
            <span className={`text-5xl font-black ${plan.highlighted ? 'text-white' : 'text-ink'}`}>
              {plan.price}
            </span>
            <span className={`text-sm font-medium ${plan.highlighted ? 'text-blue-200' : 'text-gray-500'}`}>
              {plan.currency}{plan.period}
            </span>
          </div>
        )}
      </div>

      <ul className="flex-1 space-y-3 mb-8">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-3">
            <svg
              className={`w-5 h-5 flex-shrink-0 mt-0.5 ${plan.highlighted ? 'text-blue-300' : 'text-accent'}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className={`text-sm ${plan.highlighted ? 'text-blue-100' : 'text-gray-600'}`}>
              {feature}
            </span>
          </li>
        ))}
      </ul>

      <a
        href={plan.ctaHref}
        className={`inline-flex items-center justify-center px-6 py-3 rounded-full font-semibold text-sm transition-all duration-200 ${
          plan.highlighted
            ? 'bg-white text-primary hover:bg-blue-50'
            : 'bg-primary text-white hover:bg-accent'
        }`}
      >
        {plan.ctaText}
      </a>
    </motion.div>
  )
}

export default function Pricing() {
  const { pricing } = content
  const { ref: headingRef, isInView: headingInView } = useScrollAnimation()

  return (
    <section id="pricing" className="py-32 lg:py-48 bg-white px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={headingRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center mb-16 lg:mb-20"
        >
          <span className="text-sm font-semibold text-accent tracking-widest uppercase">{pricing.label}</span>
          <h2 className="mt-4 text-4xl lg:text-5xl font-black text-ink tracking-tight">{pricing.title}</h2>
          <p className="mt-5 text-lg text-gray-500 max-w-xl mx-auto">
            {pricing.subtitleBefore}{' '}
            <strong className="text-ink">{pricing.subtitleStrong}</strong>
            {pricing.subtitleAfter}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-center">
          {pricing.plans.map((plan, index) => (
            <PricingCard key={plan.name} plan={plan} index={index} />
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center text-sm text-gray-400 mt-10"
        >
          {pricing.footnote}
        </motion.p>
      </div>
    </section>
  )
}
