import { useState, useRef } from 'react'
import { trackEvent } from '../utils/analytics'

/**
 * Calculator ROI interactiv pentru clinici.
 * Estimeaza castigul net lunar/anual (neprezentari recuperate + pacienti noi +
 * venit teleconsultatii) minus costul MediciRO (abonament PRO + 5 lei/ora
 * teleconsult + 0,3 lei/SMS peste plan).
 *
 * Notificarile per programare determina AMBELE: reducerea neprezentarilor
 * (fara remindere = 0 reducere) si numarul de SMS (programari x notificari).
 * Toate cifrele raman in browser.
 */

const ro = new Intl.NumberFormat('ro-RO', { maximumFractionDigits: 0 })
const fmt = (n: number) => ro.format(Math.round(n))

const NOTIF_OPTS = [
  { v: 0, label: 'Fără', desc: 'nicio notificare' },
  { v: 1, label: '1', desc: '24h înainte' },
  { v: 2, label: '2', desc: '24h + 12h' },
  { v: 3, label: '3', desc: '24h + 12h + 2h' },
]

function Slider({
  label, valueLabel, value, onChange, min, max, step, minLabel, maxLabel, disabled = false,
}: {
  label: string
  valueLabel: string
  value: number
  onChange: (v: number) => void
  min: number
  max: number
  step: number
  minLabel: string
  maxLabel: string
  disabled?: boolean
}) {
  return (
    <div className={`mb-4 ${disabled ? 'opacity-40' : ''}`}>
      <label className="flex justify-between items-baseline gap-3 text-sm font-semibold text-gray-800 mb-1.5">
        <span>{label}</span>
        <span className="text-blue-600 font-extrabold tabular-nums whitespace-nowrap">{valueLabel}</span>
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(+e.target.value)}
        className="w-full accent-blue-600 cursor-pointer h-2 disabled:cursor-not-allowed"
        aria-label={label}
      />
      <div className="flex justify-between text-[11px] text-gray-400 mt-0.5">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  )
}

function SubHead({ children, first = false }: { children: React.ReactNode; first?: boolean }) {
  return (
    <p className={`text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2 ${first ? '' : 'mt-5 pt-4 border-t border-gray-100'}`}>
      {children}
    </p>
  )
}

export default function RoiCalculator() {
  const [prog, setProg] = useState(400)
  const [pret, setPret] = useState(150)
  const [ns, setNs] = useState(8)
  const [red, setRed] = useState(55)
  const [notif, setNotif] = useState(2)
  const [smsIncl, setSmsIncl] = useState(200) // PRO include 200 SMS/lună (BASIC: 100)
  const [noi, setNoi] = useState(4)
  const [tc, setTc] = useState(20)
  const [dur, setDur] = useState(30)
  const [rate, setRate] = useState(150)

  // Track prima interactiune cu calculatorul (o singura data per montare)
  const engaged = useRef(false)
  const markEngaged = () => {
    if (engaged.current) return
    engaged.current = true
    trackEvent('calculator_engaged', { location: 'clinici' })
  }

  // Fara remindere = fara reducere de neprezentari
  const effRed = notif > 0 ? red : 0

  const noShowNow = (prog * ns) / 100
  const avoided = (noShowNow * effRed) / 100
  const gNs = avoided * pret
  const gNoi = noi * pret
  const teleHours = (tc * dur) / 60
  const gTele = teleHours * rate
  const gain = gNs + gNoi + gTele

  const totalSms = prog * notif
  const smsOver = Math.max(0, totalSms - smsIncl)
  const cTele = teleHours * 5
  const cSms = smsOver * 0.3
  const cost = 299 + cTele + cSms

  const net = gain - cost
  const roi = cost > 0 ? gain / cost : 0

  return (
    <div className="grid md:grid-cols-2 gap-6 items-start">
      {/* ── Inputs ─────────────────────────────────────────── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm" onPointerDown={markEngaged}>
        <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-4">Datele clinicii tale</p>

        <SubHead first>Programări</SubHead>
        <Slider label="Programări pe lună" valueLabel={fmt(prog)} value={prog} onChange={setProg} min={20} max={2000} step={10} minLabel="20" maxLabel="2000" />
        <Slider label="Preț mediu consultație" valueLabel={`${fmt(pret)} lei`} value={pret} onChange={setPret} min={50} max={600} step={10} minLabel="50" maxLabel="600" />
        <Slider label="Neprezentări acum" valueLabel={`${ns}%`} value={ns} onChange={setNs} min={0} max={30} step={1} minLabel="0%" maxLabel="30%" />

        <SubHead>Remindere (notificări)</SubHead>
        <p className="text-sm font-semibold text-gray-800 mb-2">Notificări per programare</p>
        <div className="grid grid-cols-4 gap-2 mb-3">
          {NOTIF_OPTS.map((o) => (
            <button
              key={o.v}
              type="button"
              onClick={() => setNotif(o.v)}
              className={`flex flex-col items-center gap-0.5 rounded-xl border px-2 py-2 transition-colors ${
                notif === o.v
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300'
              }`}
            >
              <span className="text-sm font-bold leading-none">{o.label}</span>
              <span className={`text-[10px] leading-tight text-center ${notif === o.v ? 'text-blue-100' : 'text-gray-400'}`}>{o.desc}</span>
            </button>
          ))}
        </div>
        <p className="text-[11px] text-gray-400 mb-3">
          {notif === 0
            ? 'Fără remindere → fără reducere de neprezentări.'
            : `${fmt(totalSms)} SMS/lună · ${fmt(smsOver)} peste plan`}
        </p>
        <Slider label="Reducere neprezentări cu remindere" valueLabel={notif === 0 ? '0%' : `${red}%`} value={red} onChange={setRed} min={0} max={60} step={5} minLabel="0%" maxLabel="până la 60%" disabled={notif === 0} />
        <Slider label="SMS incluse în planul PRO" valueLabel={`${fmt(smsIncl)}/lună`} value={smsIncl} onChange={setSmsIncl} min={0} max={2000} step={50} minLabel="0" maxLabel="2000" />

        <SubHead>Pacienți noi</SubHead>
        <Slider label="Pacienți noi pe lună (din aplicație)" valueLabel={fmt(noi)} value={noi} onChange={setNoi} min={0} max={40} step={1} minLabel="0" maxLabel="40" />

        <SubHead>Teleconsultații</SubHead>
        <Slider label="Teleconsultații pe lună" valueLabel={fmt(tc)} value={tc} onChange={setTc} min={0} max={300} step={5} minLabel="0" maxLabel="300" />
        <Slider label="Durata medie" valueLabel={`${dur} min`} value={dur} onChange={setDur} min={10} max={90} step={5} minLabel="10 min" maxLabel="90 min" />
        <Slider label="Tarif teleconsultație" valueLabel={`${fmt(rate)} lei/oră`} value={rate} onChange={setRate} min={50} max={400} step={10} minLabel="50" maxLabel="400" />
      </div>

      {/* ── Result ─────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl p-6 shadow-xl">
        <p className="text-xs font-bold uppercase tracking-widest text-blue-200 mb-4">Rezultatul tău</p>

        <p className="text-sm text-blue-200">Câștig net estimat</p>
        <p className="text-4xl sm:text-5xl font-extrabold tabular-nums leading-none">{fmt(net)} <span className="text-2xl font-bold">lei/lună</span></p>
        <p className="text-blue-100 mt-2">adică <b className="text-white tabular-nums">{fmt(net * 12)} lei/an</b></p>

        <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-3.5 py-1.5 text-sm font-bold mt-4">
          Randament <b className="text-base">{roi.toFixed(1).replace('.', ',')}×</b> față de cât plătești
        </div>

        <div className="mt-5 border-t border-white/15 pt-4 space-y-1 text-sm">
          <p className="text-[11px] font-bold uppercase tracking-widest text-blue-200 mb-1">Câștig lunar</p>
          <div className="flex justify-between gap-3 text-blue-50"><span>Neprezentări recuperate ({fmt(avoided)}/lună)</span><span className="font-bold text-white tabular-nums whitespace-nowrap">{fmt(gNs)} lei</span></div>
          <div className="flex justify-between gap-3 text-blue-50"><span>Pacienți noi din aplicație</span><span className="font-bold text-white tabular-nums whitespace-nowrap">{fmt(gNoi)} lei</span></div>
          <div className="flex justify-between gap-3 text-blue-50"><span>Venit teleconsultații ({fmt(teleHours)}h)</span><span className="font-bold text-white tabular-nums whitespace-nowrap">{fmt(gTele)} lei</span></div>
          <div className="flex justify-between gap-3 font-bold border-t border-white/20 mt-1.5 pt-2"><span>Total câștig</span><span className="text-white tabular-nums whitespace-nowrap">{fmt(gain)} lei</span></div>

          <p className="text-[11px] font-bold uppercase tracking-widest text-blue-200 mb-1 pt-3">Cost MediciRO</p>
          <div className="flex justify-between gap-3 text-blue-50"><span>Abonament PRO</span><span className="font-bold text-rose-100 tabular-nums whitespace-nowrap">−299 lei</span></div>
          <div className="flex justify-between gap-3 text-blue-50"><span>Teleconsultații (5 lei/oră)</span><span className="font-bold text-rose-100 tabular-nums whitespace-nowrap">−{fmt(cTele)} lei</span></div>
          <div className="flex justify-between gap-3 text-blue-50"><span>SMS peste plan ({fmt(smsOver)} × 0,3 lei)</span><span className="font-bold text-rose-100 tabular-nums whitespace-nowrap">−{fmt(cSms)} lei</span></div>
          <div className="flex justify-between gap-3 font-bold border-t border-white/20 mt-1.5 pt-2"><span>Total cost</span><span className="text-rose-100 tabular-nums whitespace-nowrap">−{fmt(cost)} lei</span></div>
        </div>
      </div>
    </div>
  )
}
