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
      {/* Screenshot */}
      <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-2xl shadow-gray-200/60">
        <div className="relative aspect-[16/10] bg-gray-50 overflow-hidden">
          <img
            src={screen.image}
            alt={screen.caption}
            className="w-full h-full object-cover object-top"
            loading="lazy"
          />
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
