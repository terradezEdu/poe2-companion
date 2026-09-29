import { expect, test } from '@playwright/test'
import { campaignFixtures, fixtureUrl } from '../src/test-support/campaign-fixtures.ts'
import { area, bossRecord, campaignMap, mapViewport, preview, recordField, selectedAreas } from './support/campaign-map.ts'

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

test('bundled boss enrichment reaches record-scoped Preview fields', async ({ page }) => {
  await page.goto('/')

  await area(page, 'Sierraclara').click()
  const beira = bossRecord(page, 'Beira, de la manada putrefacta')
  await expect(recordField(beira, 'damage')).toHaveText('Físico · Frío')
  await expect(recordField(beira, 'weaknesses')).toHaveText('Fuego')
  await expect(recordField(beira, 'mechanics')).toContainText('nova de escarcha')
  await expect(recordField(beira, 'rewards')).toContainText('+10 % a la resistencia al frío')
  await expect(recordField(beira, 'verification')).toHaveText('Verificado')
  await expect(recordField(beira, 'sources')).toContainText('Head_of_the_Winter_Wolf')
  await expect(recordField(beira, 'verified-at')).toHaveText('2026-09-28')
  await page.screenshot({ path: '/tmp/campaign-boss-enrichment-beira.png', fullPage: true })

  await area(page, 'Cementerio de los eternos').click()
  const lachlann = bossRecord(page, 'Lachlann del lamento eterno')
  await expect(recordField(lachlann, 'damage')).toHaveText('Desconocido')
  await expect(recordField(lachlann, 'weaknesses')).toHaveText('Desconocidas')
  await expect(recordField(lachlann, 'mechanics')).toContainText('golpes cuerpo a cuerpo')

  await area(page, 'Pueblo de Ogham').click()
  const executioner = bossRecord(page, 'El verdugo')
  await expect(recordField(executioner, 'resistances')).toHaveText('Fuego')
  await expect(recordField(executioner, 'resistances')).not.toContainText('%')
  await expect(recordField(executioner, 'mechanics')).toContainText('señalización previa')
  await expect(recordField(executioner, 'rewards')).toContainText('Gema de habilidad sin tallar de nivel 5')

  await area(page, 'Mansión de Ogham').click()
  const geonor = bossRecord(page, 'El conde Geonor')
  await expect(recordField(geonor, 'description')).toHaveText('Jefe final del Acto 1.')
  await expect(recordField(geonor, 'resistances')).toHaveText('Frío')
  await expect(recordField(geonor, 'resistances')).not.toContainText('%')
  await expect(recordField(geonor, 'mechanics')).toContainText('seis embestidas desde la niebla')
  await expect(recordField(geonor, 'rewards')).toContainText('Gema de asistencia sin tallar de nivel 1')
  await page.screenshot({ path: '/tmp/campaign-boss-enrichment-geonor.png', fullPage: true })
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
