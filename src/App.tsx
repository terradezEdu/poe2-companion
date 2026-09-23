import { lazy, Suspense } from 'react'
import { CampaignMapExperience } from './campaign/CampaignMapExperience.tsx'
import './App.css'

const CampaignTestAdapter = import.meta.env.VITE_CAMPAIGN_TEST_MODE === '1'
  ? lazy(() => import('./test-support/campaign-test-adapter.tsx'))
  : null

export default function App() {
  const fixture = new URLSearchParams(window.location.search).get('__campaignFixture')

  if (fixture && CampaignTestAdapter) {
    return <Suspense fallback={null}><CampaignTestAdapter fixture={fixture} /></Suspense>
  }

  return <CampaignMapExperience />
}
