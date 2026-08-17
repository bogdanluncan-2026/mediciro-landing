import { useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Features from './components/Features'
import Teleconsult from './components/Teleconsult'
import HowItWorks from './components/HowItWorks'
import Screenshots from './components/Screenshots'
import PatientBanner from './components/PatientBanner'
import Pricing from './components/Pricing'
import FinalCTA from './components/FinalCTA'
import Footer from './components/Footer'
import DocsOverlay from './components/DocsOverlay'
import WhatsAppButton from './components/WhatsAppButton'
import CliniciLanding from './pages/CliniciLanding'
import RoiEmbed from './pages/RoiEmbed'
import CookieConsentBanner from './components/CookieConsentBanner'
import { useSeo } from './hooks/useSeo'

function HomePage() {
  useSeo({
    title: 'MediciRO — Programări online & teleconsultații pentru clinici',
    description:
      'Software de programări online și teleconsultații pentru clinici private din România. Pacienții se programează singuri 24/7. Mai puține neprezentări. 30 de zile gratuit.',
    canonical: 'https://mediciro.ro/',
  })

  const [docsOpen, setDocsOpen] = useState(() => window.location.hash === '#documentatie')

  function openDocs() {
    window.location.hash = 'documentatie'
    setDocsOpen(true)
  }

  function closeDocs() {
    history.pushState('', document.title, window.location.pathname + window.location.search)
    setDocsOpen(false)
  }

  useEffect(() => {
    function onHashChange() {
      if (window.location.hash === '#documentatie') {
        setDocsOpen(true)
      } else {
        setDocsOpen(false)
      }
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  return (
    <div className="min-h-screen bg-white">
      {docsOpen ? (
        <DocsOverlay onClose={closeDocs} />
      ) : (
        <>
          <Navbar onDocsClick={openDocs} />
          <main>
            <Hero />
            <Features />
            <Teleconsult />
            <HowItWorks />
            <Screenshots />
            <PatientBanner />
            <Pricing />
            <FinalCTA />
          </main>
          <Footer onDocsClick={openDocs} />
          <WhatsAppButton />
        </>
      )}
    </div>
  )
}

export default function App() {
  // Ruta de embed e afisata in <iframe> pe alt site. Consimtamantul pentru cookie-uri
  // il cere gazda, nu pagina inclusa: un banner in interiorul unei ferestre mici e si
  // inutil (nu acopera site-ul pe care se afla omul), si derutant.
  const isEmbed = useLocation().pathname === '/calculator-roi'

  return (
    <>
      <Routes>
        <Route path="/clinici" element={<CliniciLanding />} />
        {/* Calculatorul singur, pentru includere prin iframe (codelium.ro). */}
        <Route path="/calculator-roi" element={<RoiEmbed />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
      {/* Cookie consent banner — rendered once, outside routes, so it persists on all pages */}
      {!isEmbed && <CookieConsentBanner />}
    </>
  )
}
