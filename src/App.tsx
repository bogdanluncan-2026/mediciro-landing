import ClosedPage from './pages/ClosedPage'
import { useSeo } from './hooks/useSeo'

// MediciRO closed in November 2026: every route shows the closing notice, with no tracking
// and no cookie banner. The full landing page is in the git history.
export default function App() {
  useSeo({
    title: 'MediciRO și-a încetat activitatea',
    description: 'Platforma MediciRO nu mai este disponibilă din noiembrie 2026.',
    canonical: 'https://mediciro.ro/',
  })

  return <ClosedPage />
}
