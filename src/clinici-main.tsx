import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import CliniciLanding from './pages/CliniciLanding'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CliniciLanding />
  </StrictMode>,
)
