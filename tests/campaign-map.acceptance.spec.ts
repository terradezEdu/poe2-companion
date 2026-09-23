import { expect, test } from '@playwright/test'
import {
  campaignFixtures,
  controlledValueFixtures,
  knowledgeFixtures,
  recordVerificationFixtureValues,
  structuralInvalidFixtures,
  twoBossFixtureValues,
  versionFixtures,
} from '../src/test-support/campaign-fixtures'
import {
  area,
  areaRecord,
  bossRecord,
  campaignMap,
  expectBefore,
  expectVisibleConnection,
  mapViewport,
  openCampaignMap,
  panAndZoom,
  preview,
  recordField,
  selectArea,
  selectedAreas,
} from './support/campaign-map'

function manualVisualEvidenceNotRun(description: string) {
  test.info().annotations.push({ type: 'manual-visual-evidence', description: `NOT_RUN: ${description}` })
}

test.describe('Campaign Map — locked acceptance contract', () => {
  test('Rule 1 / Scenario: Open the campaign map with valid information', async ({ page }) => {
    await openCampaignMap(page)
    await expect(campaignMap(page)).toBeVisible()
    await expect(page.getByText(/selecciona un área/i)).toBeVisible()
    await expect(page.getByRole('combobox')).toHaveCount(0)
    await expect(page.getByRole('button', { name: /cambiar act|cargar.*campaña|seleccionar.*act/i })).toHaveCount(0)
    await expect(preview(page)).toHaveCount(0)
  })

  test('Rule 2 / Scenario: A connection without an explicit direction allows traversal both ways', async ({ page }) => {
    await openCampaignMap(page, campaignFixtures.connectionBidirectional)
    const connection = page.getByTestId('campaign-connection-area-a-area-b')
    await expectVisibleConnection(connection)
    await expect(connection).toHaveAttribute('data-direction', 'both')
  })

  test('Rule 2 / Scenario: An explicitly directed connection allows traversal only in its stated direction', async ({ page }) => {
    await openCampaignMap(page, campaignFixtures.connectionDirected)
    const connection = page.getByTestId('campaign-connection-area-b-area-c')
    await expectVisibleConnection(connection)
    await expect(connection).toHaveAttribute('data-direction', 'area-b-to-area-c')
    await expect(connection).not.toHaveAttribute('data-direction', 'both')
    manualVisualEvidenceNotRun('Review arrow/line treatment for visible directionality.')
  })

  test('Rule 2 / Scenario: A branch is not presented as a recommended route', async ({ page }) => {
    await openCampaignMap(page, campaignFixtures.branch)
    await expectVisibleConnection(page.getByTestId('campaign-connection-area-a-area-b'))
    await expectVisibleConnection(page.getByTestId('campaign-connection-area-a-area-c'))
    await expect(page.getByText(/recomendad[oa]|óptim[oa]|obligatori[oa]/i)).toHaveCount(0)
  })

  test('Rule 3 / Scenario: Selecting another area replaces the current preview', async ({ page }) => {
    await openCampaignMap(page)
    await selectArea(page, 'Área A')
    await selectArea(page, 'Área B')
    await expect(preview(page)).toContainText('Área B')
    await expect(preview(page)).not.toContainText('Área A')
    await expect(selectedAreas(page)).toHaveCount(1)
  })

  test('Rule 3 / Scenario: Panning and zooming do not change the selected area', async ({ page }) => {
    await openCampaignMap(page)
    await selectArea(page, 'Área B')
    const before = await preview(page).innerText()
    await panAndZoom(page)
    await expect(selectedAreas(page)).toHaveAttribute('data-area-id', 'area-b')
    await expect.poll(() => preview(page).innerText()).toBe(before)
    manualVisualEvidenceNotRun('Review pan/zoom feedback and desktop usability.')
  })

  test('Rule 4 / Scenario: Focus and selection remain distinct during keyboard use', async ({ page }) => {
    await openCampaignMap(page)
    await selectArea(page, 'Área A')
    const pointerPreview = await preview(page).innerText()

    await openCampaignMap(page)
    const node = area(page, 'Área A')
    await node.focus()
    await expect(node).toBeFocused()
    await expect(node).toHaveAccessibleName('Área A')
    await expect(selectedAreas(page)).toHaveCount(0)
    await expect(preview(page)).toHaveCount(0)
    await page.keyboard.press('Enter')
    await expect(selectedAreas(page)).toHaveAttribute('data-area-id', 'area-a')
    await expect.poll(() => preview(page).innerText()).toBe(pointerPreview)
    manualVisualEvidenceNotRun('Review visible focus indicator versus selected styling.')
  })

  test('Rule 5 / Scenario: Inspect a selected area with complete known information', async ({ page }) => {
    await openCampaignMap(page, campaignFixtures.areaAComplete)
    await selectArea(page, 'Área A')
    const areaDetails = areaRecord(page)
    const boss = bossRecord(page, 'Jefe Alfa')

    for (const field of ['name', 'level', 'danger', 'hc-warning', 'verification', 'sources', 'verified-at', 'rewards', 'points-of-interest', 'curiosities']) {
      await expect(recordField(areaDetails, field)).toBeVisible()
      await expect(recordField(areaDetails, field)).toHaveText(/\S/)
    }
    for (const field of ['name', 'description', 'damage', 'weaknesses', 'mechanics', 'rewards', 'verification', 'sources', 'verified-at']) {
      await expect(recordField(boss, field)).toBeVisible()
      await expect(recordField(boss, field)).toHaveText(/\S/)
    }

    await expectBefore(recordField(areaDetails, 'danger'), recordField(areaDetails, 'rewards'))
    await expectBefore(recordField(areaDetails, 'hc-warning'), recordField(areaDetails, 'rewards'))
    await expectBefore(recordField(areaDetails, 'danger'), recordField(areaDetails, 'points-of-interest'))
    await expectBefore(recordField(areaDetails, 'hc-warning'), recordField(areaDetails, 'points-of-interest'))
    await expectBefore(recordField(areaDetails, 'danger'), recordField(areaDetails, 'curiosities'))
    await expectBefore(recordField(areaDetails, 'hc-warning'), recordField(areaDetails, 'curiosities'))
    await expectBefore(areaDetails, boss)
  })

  test('Rule 6 / Scenario: Show two bosses as separate records', async ({ page }) => {
    await openCampaignMap(page, campaignFixtures.areaATwoBosses)
    await selectArea(page, 'Área A')
    const alfa = bossRecord(page, 'Jefe Alfa')
    const beta = bossRecord(page, 'Jefe Beta')

    await expect(alfa).toBeVisible()
    await expect(beta).toBeVisible()
    for (const field of ['damage', 'weaknesses', 'mechanics', 'rewards', 'verification', 'sources', 'verified-at']) {
      await expect(recordField(alfa, field)).toBeVisible()
      await expect(recordField(beta, field)).toBeVisible()
    }
    await expect(recordField(alfa, 'damage')).toHaveText(twoBossFixtureValues.alfa.damage)
    await expect(recordField(alfa, 'weaknesses')).toHaveText(twoBossFixtureValues.alfa.weaknesses)
    await expect(recordField(alfa, 'mechanics')).toHaveText(twoBossFixtureValues.alfa.mechanics)
    await expect(recordField(alfa, 'rewards')).toHaveText(twoBossFixtureValues.alfa.reward)
    await expect(recordField(alfa, 'verification')).toHaveText(/\S/)
    await expect(recordField(alfa, 'sources')).toHaveText(twoBossFixtureValues.alfa.source)
    await expect(recordField(alfa, 'verified-at')).toHaveText(twoBossFixtureValues.alfa.verifiedAt)
    await expect(recordField(beta, 'damage')).toHaveText(twoBossFixtureValues.beta.damage)
    await expect(recordField(beta, 'weaknesses')).toHaveText(twoBossFixtureValues.beta.weaknesses)
    await expect(recordField(beta, 'mechanics')).toHaveText(twoBossFixtureValues.beta.mechanics)
    await expect(recordField(beta, 'rewards')).toHaveText(twoBossFixtureValues.beta.reward)
    await expect(recordField(beta, 'verification')).toHaveText(/\S/)
    await expect(recordField(beta, 'sources')).toHaveText(twoBossFixtureValues.beta.source)
    await expect(recordField(beta, 'verified-at')).toHaveText(twoBossFixtureValues.beta.verifiedAt)
    await expect(alfa).not.toContainText(twoBossFixtureValues.beta.damage)
    await expect(alfa).not.toContainText(twoBossFixtureValues.beta.weaknesses)
    await expect(alfa).not.toContainText(twoBossFixtureValues.beta.mechanics)
    await expect(alfa).not.toContainText(twoBossFixtureValues.beta.reward)
    await expect(alfa).not.toContainText(twoBossFixtureValues.beta.source)
    await expect(alfa).not.toContainText(twoBossFixtureValues.beta.verifiedAt)
    await expect(beta).not.toContainText(twoBossFixtureValues.alfa.damage)
    await expect(beta).not.toContainText(twoBossFixtureValues.alfa.weaknesses)
    await expect(beta).not.toContainText(twoBossFixtureValues.alfa.mechanics)
    await expect(beta).not.toContainText(twoBossFixtureValues.alfa.reward)
    await expect(beta).not.toContainText(twoBossFixtureValues.alfa.source)
    await expect(beta).not.toContainText(twoBossFixtureValues.alfa.verifiedAt)
    await expectBefore(recordField(alfa, 'mechanics'), recordField(alfa, 'rewards'))
    await expectBefore(recordField(beta, 'mechanics'), recordField(beta, 'rewards'))
  })

  test('Rule 7 / Scenario: Show known high danger separately from its warning', async ({ page }) => {
    await openCampaignMap(page, campaignFixtures.dangerHigh)
    await selectArea(page, 'Área A')
    const areaDetails = areaRecord(page)
    await expect(recordField(areaDetails, 'danger')).toBeVisible()
    await expect(recordField(areaDetails, 'hc-warning')).toBeVisible()
    await expect(recordField(areaDetails, 'danger')).toHaveText('Alto')
    await expect(recordField(areaDetails, 'hc-warning')).toHaveText('Daño físico explosivo')
    await expect(recordField(bossRecord(page, 'Jefe Alfa'), 'danger')).toHaveCount(0)
    await expect(recordField(bossRecord(page, 'Jefe Beta'), 'danger')).toHaveCount(0)
  })

  test('Rule 7 / Scenario: Unknown danger is not presented as low danger', async ({ page }) => {
    await openCampaignMap(page, campaignFixtures.dangerUnknown)
    await selectArea(page, 'Área B')
    const danger = recordField(areaRecord(page), 'danger')
    await expect(danger).toHaveText('Desconocido')
    await expect(danger).not.toContainText('Bajo')
  })

  for (const [knowledge, fixture, bossDisplay, rewardDisplay] of knowledgeFixtures) {
    test(`Rule 8 / Scenario Outline: knowledge ${knowledge}`, async ({ page }) => {
      await openCampaignMap(page, fixture)
      await selectArea(page, 'Área A')
      await expect(preview(page)).toContainText(new RegExp(bossDisplay.replace(': ', ':\\s*')))
      await expect(preview(page)).toContainText(new RegExp(rewardDisplay.replace(': ', ':\\s*')))
    })
  }

  test('Rule 8 / Scenario: Preserve unknown and verified-absent boss facts independently', async ({ page }) => {
    await openCampaignMap(page, campaignFixtures.bossKnowledgeIndependent)
    await selectArea(page, 'Área A')
    const details = preview(page)
    await expect(details.getByRole('article', { name: /Jefe Alfa/i })).toContainText('Desconocidas')
    await expect(details.getByRole('article', { name: /Jefe Beta/i })).toContainText('Ningunas')
  })

  test('Rule 9 / Scenario: Keep area and boss verification evidence independent', async ({ page }) => {
    await openCampaignMap(page, campaignFixtures.areaBossVerificationIndependent)
    await selectArea(page, 'Área A')
    const areaDetails = areaRecord(page)
    const boss = bossRecord(page, 'Jefe Alfa')

    for (const record of [areaDetails, boss]) {
      for (const field of ['verification', 'sources', 'verified-at']) {
        await expect(recordField(record, field)).toBeVisible()
      }
    }
    await expect(recordField(areaDetails, 'verification')).toHaveText(recordVerificationFixtureValues.area.verification)
    await expect(recordField(areaDetails, 'sources')).toHaveText(recordVerificationFixtureValues.area.source)
    await expect(recordField(areaDetails, 'verified-at')).toHaveText(recordVerificationFixtureValues.area.verifiedAt)
    await expect(recordField(boss, 'verification')).toHaveText(recordVerificationFixtureValues.boss.verification)
    await expect(recordField(boss, 'sources')).toHaveText(recordVerificationFixtureValues.boss.source)
    await expect(recordField(boss, 'verified-at')).toHaveText(recordVerificationFixtureValues.boss.verifiedAt)
    await expect(areaDetails).not.toContainText(recordVerificationFixtureValues.boss.source)
    await expect(areaDetails).not.toContainText(recordVerificationFixtureValues.boss.verifiedAt)
    await expect(boss).not.toContainText(recordVerificationFixtureValues.area.source)
    await expect(boss).not.toContainText(recordVerificationFixtureValues.area.verifiedAt)
    await expect(preview(page).getByTestId('record-field-verification')).toHaveCount(2)
  })

  test('Rule 9 / Scenario: A verified record may still contain an unknown optional value', async ({ page }) => {
    await openCampaignMap(page, campaignFixtures.verifiedBossUnknownWeakness)
    await selectArea(page, 'Área A')
    const boss = bossRecord(page, 'Jefe Alfa')
    await expect(boss).toContainText('Verificado')
    await expect(boss).toContainText('Desconocida')
  })

  for (const [value, fixture, label] of controlledValueFixtures) {
    test(`Rule 10 / Scenario Outline: localizes ${value}`, async ({ page }) => {
      await openCampaignMap(page, fixture)
      await selectArea(page, 'Área A')
      await expect(preview(page)).toContainText(label)
      await expect(preview(page)).not.toContainText(/LOW|MEDIUM|HIGH|EXTREME|UNKNOWN|VERIFIED/)
    })
  }

  for (const [problem, fixture] of structuralInvalidFixtures) {
    test(`Rule 11 / Scenario Outline: rejects structural problem — ${problem}`, async ({ page }) => {
      await openCampaignMap(page, fixture)
      await expect(page.getByRole('alert')).toContainText(/información.*campaña|datos.*campaña/i)
      await expect(campaignMap(page)).toHaveCount(0)
      await expect(mapViewport(page)).toHaveCount(0)
      await expect(preview(page)).toHaveCount(0)
    })
  }

  test('Rule 12 / Scenario: Open a map when optional boss knowledge is missing', async ({ page }) => {
    await openCampaignMap(page, campaignFixtures.optionalKnowledgeMissing)
    await expect(campaignMap(page)).toBeVisible()
    await selectArea(page, 'Área A')
    const boss = bossRecord(page, 'Jefe Alfa')
    await expect(recordField(boss, 'description')).toBeVisible()
    await expect(recordField(boss, 'weaknesses')).toBeVisible()
    await expect(recordField(boss, 'description')).toHaveText('Desconocida')
    await expect(recordField(boss, 'weaknesses')).toHaveText('Desconocidas')
    await expect(page.getByRole('alert')).toHaveCount(0)
  })

  for (const [version, fixture, display] of versionFixtures) {
    test(`Rule 13 / Scenario Outline: displays game version ${version}`, async ({ page }) => {
      await openCampaignMap(page, fixture)
      await expect(page.getByText(display, { exact: true })).toBeVisible()
      await expect(page.getByRole('combobox')).toHaveCount(0)
      await expect(page.getByRole('button', { name: /versión|dataset|remot/i })).toHaveCount(0)
    })
  }

  test('Rule 14 / Scenario: Distinguish critical map and preview states', async ({ page }) => {
    await openCampaignMap(page, campaignFixtures.areaATwoBosses)
    await expect(campaignMap(page)).toBeVisible()
    await selectArea(page, 'Área A')
    await expect(preview(page)).toContainText(/verificado|sin verificar|desconocid|ningun/i)
    manualVisualEvidenceNotRun('Review selected/focused, directed/bidirectional, danger, verification, knowledge, and decoration legibility.')
  })

  test('Rule 14 / Scenario: Keep the map usable through ordinary desktop interaction', async ({ page }) => {
    await openCampaignMap(page)
    await panAndZoom(page)
    await selectArea(page, 'Área A')
    await panAndZoom(page)
    await selectArea(page, 'Área B')
    await expect(preview(page)).toContainText('Área B')
    await expect(selectedAreas(page)).toHaveAttribute('data-area-id', 'area-b')
    manualVisualEvidenceNotRun('Review visible feedback and responsiveness during repeated desktop interaction.')
  })
})
