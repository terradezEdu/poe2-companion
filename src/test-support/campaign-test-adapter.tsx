import { CampaignMapExperience } from '../campaign/CampaignMapExperience.tsx'
import { campaignFixtures } from './campaign-fixtures.ts'
import CampaignMapSurfaceTestAdapter from './campaign-map-surface.tsx'
import { campaignExperienceFixture } from './campaign-experience-fixtures.ts'

export default function CampaignTestAdapter({ fixture }: { readonly fixture: string }) {
  if (fixture === campaignFixtures.mapInteraction || fixture === campaignFixtures.mapLayoutCrossing) {
    return <CampaignMapSurfaceTestAdapter fixture={fixture} />
  }
  return <CampaignMapExperience input={campaignExperienceFixture(fixture)} />
}
