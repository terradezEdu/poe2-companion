import { expect, test } from '@playwright/test'
import { campaignFixtures, fixtureUrl } from '../src/test-support/campaign-fixtures.ts'
import { area, campaignMap, mapViewport, preview, selectedAreas } from './support/campaign-map.ts'

test('bundled Act 1 validates and connects map selection to its own preview', async ({ page }) => {
  await page.goto('/')
  await expect(campaignMap(page)).toBeVisible()
  await expect(page.locator('[data-campaign-area]')).toHaveCount(18)
  await expect(page.getByText('0.5.4', { exact: true })).toBeVisible()
  await expect(selectedAreas(page)).toHaveCount(0)
  await expect(page.getByText(/selecciona un área/i)).toBeVisible()
  await page.screenshot({ path: '/tmp/campaign-integration-startup.png', fullPage: true })

  await area(page, 'La orilla del río').click()
  await expect(selectedAreas(page)).toHaveAttribute('data-area-id', 'riverbank')
  await expect(preview(page)).toContainText('La orilla del río')
  await expect(preview(page)).toContainText('El molinero hinchado')
  await page.screenshot({ path: '/tmp/campaign-integration-selected.png', fullPage: true })

  await area(page, 'Campamento de Sierraclara').click()
  await expect(selectedAreas(page)).toHaveAttribute('data-area-id', 'clearfell-encampment')
  await expect(preview(page)).toContainText('Campamento de Sierraclara')
  await expect(preview(page)).not.toContainText('El molinero hinchado')
  await page.screenshot({ path: '/tmp/campaign-integration-changed-selection.png', fullPage: true })
  const before = await preview(page).innerText()
  await mapViewport(page).hover({ position: { x: 400, y: 400 } })
  await page.mouse.wheel(0, -300)
  await expect.poll(() => preview(page).innerText()).toBe(before)
})

test('validation failure suppresses every campaign UI component', async ({ page }) => {
  await page.goto(fixtureUrl(campaignFixtures.structurallyInvalidUnknownConnectionArea))
  await expect(page.getByRole('alert')).toContainText('Error en la información de campaña')
  await expect(campaignMap(page)).toHaveCount(0)
  await expect(preview(page)).toHaveCount(0)
  await expect(page.getByText(/selecciona un área/i)).toHaveCount(0)
  await page.screenshot({ path: '/tmp/campaign-integration-error.png', fullPage: true })
})

test('validated optional knowledge keeps map usable', async ({ page }) => {
  await page.goto(fixtureUrl(campaignFixtures.areaATwoBosses))
  await area(page, 'Área A').click()
  await expect(preview(page).getByRole('article')).toHaveCount(2)
  await page.screenshot({ path: '/tmp/campaign-integration-two-bosses.png', fullPage: true })

  await page.goto(fixtureUrl(campaignFixtures.knowledgeUnknown))
  await area(page, 'Área A').click()
  await expect(preview(page)).toContainText('Desconocidas')
  await page.screenshot({ path: '/tmp/campaign-integration-unknown.png', fullPage: true })

  await page.goto(fixtureUrl(campaignFixtures.knowledgeVerifiedAbsence))
  await area(page, 'Área A').click()
  await expect(preview(page)).toContainText('Ninguna')
  await page.screenshot({ path: '/tmp/campaign-integration-absence.png', fullPage: true })
})

test('selection, focus, direction and zoom are visually distinct', async ({ page }) => {
  await page.goto(fixtureUrl(campaignFixtures.applicationDefault))
  await area(page, 'Área A').click()
  await area(page, 'Área C').focus()
  await expect(selectedAreas(page)).toHaveAttribute('data-area-id', 'area-a')
  await expect(area(page, 'Área C')).toBeFocused()
  await expect(page.getByTestId('campaign-connection-area-a-area-b')).toHaveAttribute('data-direction', 'both')
  await expect(page.getByTestId('campaign-connection-area-b-area-c')).toHaveAttribute('data-direction', 'area-b-to-area-c')
  await page.screenshot({ path: '/tmp/campaign-integration-focus-edges.png', fullPage: true })
  await mapViewport(page).hover({ position: { x: 400, y: 400 } })
  await page.mouse.wheel(0, -300)
  await expect(selectedAreas(page)).toHaveAttribute('data-area-id', 'area-a')
  await page.screenshot({ path: '/tmp/campaign-integration-zoom.png', fullPage: true })
})
