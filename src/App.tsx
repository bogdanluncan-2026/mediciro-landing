import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import BetaBanner from './components/BetaBanner'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Features from './components/Features'
import HowItWorks from './components/HowItWorks'
import Screenshots from './components/Screenshots'
import PatientBanner from './components/PatientBanner'
import Pricing from './components/Pricing'
import FinalCTA from './components/FinalCTA'
import Footer from './components/Footer'
import DocsOverlay from './components/DocsOverlay'
import WhatsAppButton from './components/WhatsAppButton'
import CliniciLanding from './pages/CliniciLanding'

function HomePage() {
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
          <BetaBanner />
          <Navbar onDocsClick={openDocs} />
          <main>
            <Hero />
            <Features />
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
  return (
    <Routes>
      <Route path="/clinici" element={<CliniciLanding />} />
      <Route path="*" element={<HomePage />} />
    </Routes>
  )
}
