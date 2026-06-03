const DOCTOR_IMG = '/screenshots/MedicInTeleconsultatie.png'
const PATIENT_IMG = '/screenshots/PacientInTeleconsultatie.png'

export const VideoIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
)

const MicIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-14 0M12 18v3m-4 0h8M12 4a3 3 0 013 3v4a3 3 0 01-6 0V7a3 3 0 013-3z" />
  </svg>
)

const EndCallIcon = () => (
  <svg className="w-4 h-4 rotate-[135deg]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
)

/** A single MediciRO teleconsult screen: branded header + one big tile + self PiP + controls. */
function CallScreen({
  label,
  bigSrc,
  bigName,
  pipSrc,
}: {
  label: string
  bigSrc: string
  bigName: string
  pipSrc: string
}) {
  return (
    <div>
      <div className="mb-3 text-center">
        <span className="inline-block text-xs font-semibold uppercase tracking-widest text-gray-400">{label}</span>
      </div>
      <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-xl shadow-gray-300/40 bg-gray-900">
        {/* MediciRO header (1:1 cu aplicația) */}
        <div className="bg-gray-800 text-white px-3 py-2 flex items-center justify-between text-[11px]">
          <span className="inline-flex items-center gap-1 text-gray-300">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Ieși
          </span>
          <span className="inline-flex items-center gap-1.5 text-gray-200 font-medium">
            <VideoIcon className="w-3.5 h-3.5" /> Teleconsultație MediciRO
          </span>
          <span className="inline-flex items-center gap-1 text-gray-400">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> live
          </span>
        </div>

        {/* Video area */}
        <div className="relative aspect-video bg-black">
          <img src={bigSrc} alt={bigName} className="absolute inset-0 w-full h-full object-cover" />
          <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-black/45 text-white text-[11px] font-medium tabular-nums">04:12</span>
          <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-black/45 text-white text-xs font-medium">{bigName}</span>
          <div className="absolute bottom-3 right-3 w-[28%] aspect-video rounded-lg overflow-hidden border border-white/25 shadow-lg">
            <img src={pipSrc} alt="Tu" className="w-full h-full object-cover" />
            <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/55 text-white text-[9px] font-medium">Tu</span>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-gray-800 py-2.5 flex items-center justify-center gap-3">
          <span className="w-9 h-9 rounded-full bg-white/10 text-white flex items-center justify-center"><MicIcon /></span>
          <span className="w-9 h-9 rounded-full bg-white/10 text-white flex items-center justify-center"><VideoIcon className="w-4 h-4" /></span>
          <span className="w-9 h-9 rounded-full bg-red-500 text-white flex items-center justify-center"><EndCallIcon /></span>
        </div>
      </div>
    </div>
  )
}

/** The two-perspective teleconsult visual (Vederea medicului / Vederea pacientului). */
export default function TeleconsultDemo() {
  return (
    <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
      <CallScreen label="Vederea medicului" bigSrc={PATIENT_IMG} bigName="Andrei Ionescu" pipSrc={DOCTOR_IMG} />
      <CallScreen label="Vederea pacientului" bigSrc={DOCTOR_IMG} bigName="Dr. Maria Popescu · Cardiolog" pipSrc={PATIENT_IMG} />
    </div>
  )
}
