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

const ClinicIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M5 21V7l7-4 7 4v14M9 9h.01M15 9h.01M9 13h.01M15 13h.01M9 17h6" />
  </svg>
)

const PatientIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
)

const ArrowIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
)

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
        className="relative z-10 max-w-5xl mx-auto"
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
          className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-[-0.03em] text-ink leading-[1.05] text-balance"
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

        {/* Audience cards */}
        <motion.div
          variants={item}
          className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl mx-auto"
        >
          {/* Clinic card */}
          <div className="group relative bg-white/80 backdrop-blur-md rounded-2xl border border-gray-200/60 p-7 text-left transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <ClinicIcon />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary/70">
                {hero.clinicCard.label}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-ink tracking-tight mt-3">
              {hero.clinicCard.title}
            </h3>
            <p className="mt-2 text-sm text-gray-500 leading-relaxed">
              {hero.clinicCard.description}
            </p>
            <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              {hero.clinicCard.trustLine}
            </p>
            <div className="mt-6 flex flex-col gap-2">
              <a
                href={hero.clinicCard.primaryCta.href}
                className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 rounded-full bg-primary text-white font-semibold text-sm hover:bg-accent transition-all duration-200 shadow-md shadow-primary/20"
              >
                {hero.clinicCard.primaryCta.text}
                <ArrowIcon />
              </a>
              <a
                href={hero.clinicCard.secondaryCta.href}
                className="text-center text-sm text-gray-500 hover:text-ink transition-colors py-2"
              >
                Ai cont? <span className="font-semibold underline-offset-4 hover:underline">{hero.clinicCard.secondaryCta.text}</span>
              </a>
            </div>
          </div>

          {/* Patient card */}
          <div className="group relative bg-white/80 backdrop-blur-md rounded-2xl border border-gray-200/60 p-7 text-left transition-all duration-300 hover:border-emerald-400/50 hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <PatientIcon />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700/80">
                {hero.patientCard.label}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-ink tracking-tight mt-3">
              {hero.patientCard.title}
            </h3>
            <p className="mt-2 text-sm text-gray-500 leading-relaxed">
              {hero.patientCard.description}
            </p>
            <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              {hero.patientCard.trustLine}
            </p>
            <div className="mt-6 flex flex-col gap-2">
              <a
                href={hero.patientCard.primaryCta.href}
                className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 rounded-full bg-emerald-500 text-white font-semibold text-sm hover:bg-emerald-600 transition-all duration-200 shadow-md shadow-emerald-500/25"
              >
                {hero.patientCard.primaryCta.text}
                <ArrowIcon />
              </a>
              <a
                href={hero.patientCard.secondaryCta.href}
                className="text-center text-sm text-gray-500 hover:text-ink transition-colors py-2"
              >
                Ai cont? <span className="font-semibold underline-offset-4 hover:underline">{hero.patientCard.secondaryCta.text}</span>
              </a>
            </div>
          </div>
        </motion.div>

        {/* Social proof */}
        <motion.p variants={item} className="mt-8 text-sm text-gray-400">
          {hero.trustSignals}
        </motion.p>
      </motion.div>
    </section>
  )
}
