import { useState } from 'react'
import WhatsAppButton from '../components/WhatsAppButton'

/* ─── Types ──────────────────────────────────────────────────────────────── */
interface FaqItem {
  q: string
  a: string
}

/* ─── Data ───────────────────────────────────────────────────────────────── */
const REGISTER_URL = 'https://app.mediciro.ro/register'

const FEATURES = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    title: 'Programări Online 24/7',
    desc: 'Pacienții se programează direct din browser sau aplicație, fără telefoane la recepție. Calendarul se actualizează în timp real.',
    color: 'blue',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    ),
    title: 'Notificări Automate SMS & Email',
    desc: 'Confirmare, reminder cu 24h înainte și notificare anulare — complet automat. Reduci no-show-urile fără niciun efort suplimentar.',
    color: 'sky',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: 'Management Complet',
    desc: 'Doctori, specialități, orar de lucru — totul dintr-un singur tablou de bord. Recepția gestionează manual programările când e nevoie.',
    color: 'indigo',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: 'Rapoarte & Statistici',
    desc: 'Câți pacienți noi, ce servicii sunt cele mai solicitate, ocuparea pe doctori — date clare pentru decizii mai bune.',
    color: 'violet',
  },
]

const colorMap: Record<string, string> = {
  blue: 'bg-blue-50 text-blue-600',
  sky: 'bg-sky-50 text-sky-600',
  indigo: 'bg-indigo-50 text-indigo-600',
  violet: 'bg-violet-50 text-violet-600',
}

const TESTIMONIALS = [
  {
    quote: 'De când am implementat MediciRO, recepția noastră nu mai pierde timp cu telefoanele pentru programări. Totul vine online, organizat automat.',
    name: 'Dr. Mihai P.',
    role: 'Administrator, clinică stomatologică',
    city: 'Oradea',
    initials: 'MP',
    color: 'bg-blue-600',
  },
  {
    quote: 'Setup-ul a durat mai puțin de o oră. Nu am avut nevoie de niciun suport tehnic. Acum toți doctorii mei au calendarul actualizat în timp real.',
    name: 'Andreea T.',
    role: 'Manager clinică',
    city: 'Cluj-Napoca',
    initials: 'AT',
    color: 'bg-indigo-600',
  },
]

const FAQ: FaqItem[] = [
  {
    q: 'Avem deja un sistem de programări. De ce să schimbăm?',
    a: 'Dacă sistemul actual funcționează prin telefon sau Excel, echipa ta pierde ore zilnic cu programări manuale. MediciRO automatizează tot procesul: pacienții se programează singuri, confirmările și reminderele merg automat, iar tu ai vizibilitate completă în timp real — fără extra-efort. Migrarea durează sub o zi.',
  },
  {
    q: 'Cât durează implementarea? Avem nevoie de un IT-ist?',
    a: 'Nu ai nevoie de IT. Înregistrezi clinica, adaugi doctorii și setezi programul de lucru — totul din browser, în mai puțin de 30 de minute. Oferim și onboarding asistat dacă preferi să mergi mai repede.',
  },
  {
    q: 'Datele pacienților noștri sunt în siguranță? Respectă GDPR?',
    a: 'Da. MediciRO rulează pe servere AWS Frankfurt (UE), conform Art. 44 GDPR. Datele medicale sunt criptate, accesul este controlat pe roluri, iar toate acțiunile sunt logate pentru audit. Oferim DPA (Data Processing Agreement).',
  },
  {
    q: 'Ce se întâmplă dacă vrem să renunțăm?',
    a: 'Poți anula oricând, fără penalități. În primele 30 de zile e complet gratuit — dacă nu ești mulțumit, nu plătești nimic. La anulare îți exportăm toate datele în format standard.',
  },
]

const PLANS = [
  {
    name: 'Basic',
    price: '129',
    period: '/lună',
    desc: '1–3 doctori',
    features: ['Până la 3 doctori', 'Programări nelimitate', 'Notificări SMS & email', 'Aplicație mobilă', 'Suport email'],
    cta: 'Începe gratuit',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '299',
    period: '/lună',
    desc: '4–15 doctori',
    features: ['Până la 15 doctori', 'Programări nelimitate', 'Recepție manuală', 'Notificări SMS & email', 'Rapoarte avansate', 'Suport prioritar'],
    cta: 'Începe gratuit 30 zile',
    highlighted: true,
    badge: 'Cel mai popular',
  },
  {
    name: 'Enterprise',
    price: 'de la 1.499',
    period: '/lună',
    desc: 'Rețele de clinici',
    features: ['Doctori nelimitați', 'Branding personalizat', 'Funcționalități la cerere', 'Integrări API custom', 'Onboarding asistat'],
    cta: 'Contactează-ne',
    href: 'mailto:contact@mediciro.ro',
    highlighted: false,
  },
]

/* ─── Sub-components ─────────────────────────────────────────────────────── */

function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between px-6 py-4 text-left text-gray-900 font-semibold hover:bg-gray-50 transition-colors"
          >
            <span>{item.q}</span>
            <svg
              className={`w-5 h-5 text-gray-400 flex-shrink-0 ml-4 transition-transform ${open === i ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {open === i && (
            <div className="px-6 pb-5 text-gray-600 leading-relaxed">
              {item.a}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

/* ─── Main Page ──────────────────────────────────────────────────────────── */

export default function CliniciLanding() {
  return (
    <div className="min-h-screen bg-white font-sans">

      {/* ── Minimal Navbar ─────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <a href="https://mediciro.ro" className="flex items-center gap-2">
            <span className="text-xl font-bold text-blue-600">MediciRO</span>
          </a>
          <div className="flex items-center gap-3">
            <a
              href="https://app.mediciro.ro/login"
              className="hidden sm:inline text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Autentificare
            </a>
            <a
              href={REGISTER_URL}
              className="inline-flex items-center gap-1.5 bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Încearcă gratuit
            </a>
          </div>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Social proof badge */}
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Construit cu feedback direct de la clinici private românești
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
            Clinica ta, organizată.{' '}
            <span className="text-blue-600">Pacienții tăi, mulțumiți.</span>
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            MediciRO automatizează programările, notificările și managementul consultațiilor —
            astfel încât echipa ta să se concentreze pe pacienți, nu pe telefoane.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
            <a
              href={REGISTER_URL}
              className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white font-bold text-lg px-8 py-4 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
            >
              Încearcă gratuit 30 zile
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
            <a
              href="mailto:contact@mediciro.ro"
              className="inline-flex items-center justify-center gap-2 bg-white text-gray-700 font-semibold text-lg px-8 py-4 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Solicită o demonstrație
            </a>
          </div>

          <p className="text-sm text-gray-500">
            Fără card de credit · Anulezi oricând · Setup în 30 minute
          </p>
        </div>
      </section>

      {/* ── Testimonials ───────────────────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-sm font-semibold text-gray-400 uppercase tracking-widest mb-10">
            Ce spun clinicile care folosesc MediciRO
          </p>
          <div className="grid sm:grid-cols-2 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-6 flex flex-col gap-4">
                {/* Stars */}
                <div className="flex gap-1">
                  {[...Array(5)].map((_, s) => (
                    <svg key={s} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <blockquote className="text-gray-700 leading-relaxed italic">
                  "{t.quote}"
                </blockquote>
                <div className="flex items-center gap-3 mt-auto">
                  <div className={`w-10 h-10 rounded-full ${t.color} text-white text-sm font-bold flex items-center justify-center flex-shrink-0`}>
                    {t.initials}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-gray-500 text-xs">{t.role} · {t.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Video Demo ─────────────────────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
            Demo
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
            Vezi platforma în acțiune
          </h2>
          <p className="text-gray-500 mb-8">
            Un tur rapid al funcționalităților principale — de la programare la notificare.
          </p>
          {/* Video embed placeholder — înlocuiește src cu link-ul YouTube sau Loom real */}
          <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl bg-gray-900 flex items-center justify-center">
            {/* Uncomment și înlocuiește cu URL real când ai videoul:
            <iframe
              className="absolute inset-0 w-full h-full"
              src="https://www.youtube.com/embed/YOUR_VIDEO_ID?rel=0"
              title="MediciRO Demo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            /> */}
            <div className="text-center px-6">
              <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <p className="text-white/80 text-sm">Video demo disponibil în curând</p>
              <a
                href="mailto:contact@mediciro.ro?subject=Demo MediciRO"
                className="inline-block mt-4 text-blue-300 text-sm hover:text-white transition-colors"
              >
                Solicită un demo live →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────────────────── */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
              Funcționalități
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
              Tot ce ai nevoie, dintr-un singur loc
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Construit specific pentru clinici private din România, nu adaptat dintr-un tool generic.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f, i) => (
              <div key={i} className="rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${colorMap[f.color]}`}>
                  {f.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* WhatsApp addon callout */}
          <div className="mt-8 bg-green-50 border border-green-200 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
              <svg className="w-7 h-7" viewBox="0 0 32 32" fill="currentColor">
                <path d="M16 2C8.28 2 2 8.28 2 16c0 2.46.67 4.76 1.83 6.74L2 30l7.45-1.95A13.93 13.93 0 0 0 16 30c7.72 0 14-6.28 14-14S23.72 2 16 2zm6.26 19.86c-.34-.17-2.02-1-2.33-1.11-.32-.11-.55-.17-.78.17s-.9 1.11-1.1 1.34c-.2.23-.4.26-.74.09-.34-.17-1.44-.53-2.74-1.69a10.3 10.3 0 0 1-1.9-2.36c-.2-.34-.02-.53.15-.7.15-.15.34-.4.51-.6.17-.2.23-.34.34-.57.11-.23.06-.43-.03-.6-.09-.17-.78-1.88-1.07-2.57-.28-.68-.57-.59-.78-.6h-.67c-.23 0-.6.09-.91.43-.32.34-1.2 1.17-1.2 2.86s1.23 3.32 1.4 3.55c.17.23 2.42 3.7 5.87 5.19.82.35 1.46.56 1.96.72.82.26 1.57.22 2.16.13.66-.1 2.02-.83 2.31-1.62.28-.8.28-1.48.2-1.62-.09-.14-.32-.23-.66-.4z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-900 mb-0.5">Add-on WhatsApp — 99 RON/lună</p>
              <p className="text-sm text-gray-600">
                Trimite notificări automate pacienților prin WhatsApp: confirmare programare, reminder cu 24h înainte, notificare anulare.
              </p>
            </div>
            <a
              href="mailto:contact@mediciro.ro?subject=WhatsApp addon"
              className="inline-flex items-center gap-1.5 bg-green-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-green-700 transition-colors flex-shrink-0"
            >
              Adaugă la plan
            </a>
          </div>
        </div>
      </section>

      {/* ── How it works ───────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
              Cum funcționează
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
              Pornești în 3 pași simpli
            </h2>
            <p className="text-gray-500">Setup rapid, fără IT. Clinica ta funcționează online în mai puțin de 30 de minute.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                n: '1',
                title: 'Înregistrează clinica',
                desc: 'Creează contul, adaugă datele de contact, programul și serviciile oferite.',
              },
              {
                n: '2',
                title: 'Adaugă doctorii',
                desc: 'Invită medicii, definește specialitățile și orarul. Fiecare doctor primește propriul calendar.',
              },
              {
                n: '3',
                title: 'Pacienții se programează',
                desc: 'Pacienții accesează pagina clinicii, aleg doctorul și intervalul. Confirmarea vine instant.',
              },
            ].map((step, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm flex flex-col items-start gap-4">
                <span className="w-10 h-10 rounded-full bg-blue-600 text-white font-extrabold text-lg flex items-center justify-center flex-shrink-0">
                  {step.n}
                </span>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{step.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <a
              href={REGISTER_URL}
              className="inline-flex items-center gap-2 bg-blue-600 text-white font-bold text-lg px-8 py-4 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
            >
              Încearcă gratuit 30 zile →
            </a>
          </div>
        </div>
      </section>

      {/* ── Pricing ────────────────────────────────────────────────────── */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
              Prețuri
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
              Planuri clare, fără surprize
            </h2>
            <p className="text-gray-500">
              Toate planurile includ <strong>30 de zile gratuite</strong>. Anulezi oricând.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {PLANS.map((plan, i) => (
              <div
                key={i}
                className={`rounded-2xl p-6 flex flex-col gap-4 relative ${
                  plan.highlighted
                    ? 'bg-blue-600 text-white ring-4 ring-blue-600 shadow-xl'
                    : 'bg-white border border-gray-200'
                }`}
              >
                {plan.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                    {plan.badge}
                  </span>
                )}
                <div>
                  <p className={`text-sm font-semibold mb-1 ${plan.highlighted ? 'text-blue-200' : 'text-gray-500'}`}>
                    {plan.name}
                  </p>
                  <p className={`text-3xl font-extrabold ${plan.highlighted ? 'text-white' : 'text-gray-900'}`}>
                    {plan.price} <span className="text-base font-normal">RON{plan.period}</span>
                  </p>
                  <p className={`text-sm mt-1 ${plan.highlighted ? 'text-blue-200' : 'text-gray-500'}`}>
                    {plan.desc}
                  </p>
                </div>
                <ul className="space-y-2 flex-1">
                  {plan.features.map((f, fi) => (
                    <li key={fi} className={`flex items-start gap-2 text-sm ${plan.highlighted ? 'text-blue-100' : 'text-gray-600'}`}>
                      <svg className={`w-4 h-4 mt-0.5 flex-shrink-0 ${plan.highlighted ? 'text-blue-300' : 'text-blue-500'}`} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href={plan.href ?? REGISTER_URL}
                  className={`block text-center font-bold py-3 px-4 rounded-xl transition-colors ${
                    plan.highlighted
                      ? 'bg-white text-blue-600 hover:bg-blue-50'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {plan.cta}
                </a>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-gray-400 mt-6">
            Facturare lunară sau anuală (reducere 10% anual) · Plată cu card sau transfer bancar
          </p>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
              Întrebări frecvente
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
              Ai întrebări? Avem răspunsuri.
            </h2>
          </div>
          <FaqAccordion items={FAQ} />
          <div className="text-center mt-10">
            <p className="text-gray-500 mb-4">Ai alte întrebări? Scrie-ne direct.</p>
            <a
              href="mailto:contact@mediciro.ro"
              className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors"
            >
              contact@mediciro.ro
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* ── Final CTA ──────────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-indigo-700">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block bg-white/20 text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            30 zile gratuite · Fără card · Anulezi oricând
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Pregătit să modernizezi clinica ta?
          </h2>
          <p className="text-blue-100 text-lg mb-8">
            Înregistrează-ți clinica acum și începe să oferi programări online pacienților tăi în mai puțin de o oră.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={REGISTER_URL}
              className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 font-bold text-lg px-8 py-4 rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
            >
              Înregistrează clinica
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
            <a
              href="mailto:contact@mediciro.ro"
              className="inline-flex items-center justify-center gap-2 bg-white/10 text-white font-semibold text-lg px-8 py-4 rounded-xl border border-white/30 hover:bg-white/20 transition-colors"
            >
              Contactează-ne
            </a>
          </div>
        </div>
      </section>

      {/* ── Minimal Footer ─────────────────────────────────────────────── */}
      <footer className="bg-gray-900 text-gray-400 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-white font-bold text-lg">MediciRO</span>
          <div className="flex flex-wrap gap-6 text-sm justify-center">
            <a href="https://mediciro.ro" className="hover:text-white transition-colors">Homepage</a>
            <a href="https://mediciro.ro#pricing" className="hover:text-white transition-colors">Prețuri</a>
            <a href="mailto:contact@mediciro.ro" className="hover:text-white transition-colors">Contact</a>
            <a href="https://app.mediciro.ro/login" className="hover:text-white transition-colors">Autentificare</a>
          </div>
          <p className="text-xs text-gray-500">© {new Date().getFullYear()} MediciRO SRL</p>
        </div>
      </footer>

      <WhatsAppButton />
    </div>
  )
}
