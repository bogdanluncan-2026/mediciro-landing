import { useState, useEffect } from 'react'
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

export default function App() {
  const [docsOpen, setDocsOpen] = useState(() => window.location.hash === '#documentatie')

  function openDocs() {
    window.location.hash = 'documentatie'
    setDocsOpen(true)
  }

  function closeDocs() {
    history.pushState('', document.title, window.location.pathname + window.location.search)
    setDocsOpen(false)
  }

  // Deschide overlay când utilizatorul navighează la #documentatie (back/forward sau link direct)
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
        </>
      )}
    </div>
  )
}
