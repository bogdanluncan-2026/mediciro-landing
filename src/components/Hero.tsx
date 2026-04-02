import { motion } from 'framer-motion'
import content from '../content'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.3 },
  },
}

const item = {
  hidden: { opacity: 0, y: 60, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 1, ease: [0.25, 0.1, 0.25, 1] } },
}

export default function Hero() {
  const { hero } = content

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden pt-20"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${hero.backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-white/70 via-white/50 to-white/80" />

      {/* Background grid */}
      <div
        className="absolute inset-0 z-[2] opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(#1B4F8A 1px, transparent 1px), linear-gradient(to right, #1B4F8A 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />

      {/* Radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-accent/5 blur-3xl pointer-events-none z-[3]" />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 max-w-4xl mx-auto"
      >
        {/* Badge */}
        <motion.div variants={item} className="inline-flex items-center gap-2 mb-8">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-accent/10 text-accent border border-accent/20">
            <span className="w-1.5 h-1.5 rounded-full bg-accent mr-2 animate-pulse" />
            {hero.badge}
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={item}
          className="text-6xl sm:text-7xl lg:text-[5.5rem] font-black tracking-[-0.03em] text-ink leading-[1.0] text-balance"
        >
          {hero.headline}
          <br />
          <span className="text-primary">{hero.headlineAccent}</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={item}
          className="mt-6 text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed text-balance"
        >
          {hero.subtitle}
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={item}
          className="mt-10 flex flex-col sm:flex-row gap-4 items-center justify-center"
        >
          <a
            href={hero.ctaPrimary.href}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-white font-semibold text-base hover:bg-accent transition-all duration-200 shadow-lg shadow-primary/25 hover:shadow-accent/30 hover:scale-[1.02] active:scale-[0.98]"
          >
            {hero.ctaPrimary.text}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
          <a
            href={hero.ctaSecondary.href}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-gray-200 text-ink font-semibold text-base hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
          >
            {hero.ctaSecondary.text}
          </a>
        </motion.div>

        {/* Social proof */}
        <motion.p variants={item} className="mt-8 text-sm text-gray-400">
          {hero.trustSignals}
        </motion.p>
      </motion.div>
    </section>
  )
}
