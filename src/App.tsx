import { useState } from 'react'
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
  const [docsOpen, setDocsOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white">
      {docsOpen ? (
        <DocsOverlay onClose={() => setDocsOpen(false)} />
      ) : (
        <>
          <BetaBanner />
          <Navbar onDocsClick={() => setDocsOpen(true)} />
          <main>
            <Hero />
            <Features />
            <HowItWorks />
            <Screenshots />
            <PatientBanner />
            <Pricing />
            <FinalCTA />
          </main>
          <Footer />
        </>
      )}
    </div>
  )
}
