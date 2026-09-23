import { mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { expect, test, type Page } from '@playwright/test'

const screenshotDirectory = join(process.cwd(), 'tests/visual/artifacts/issue-6-preview')

async function showPreview(page: Page, state: string) {
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.goto(`/tests/visual/preview.html?state=${state}`)
  await expect(page.locator('.campaign-preview')).toBeVisible()
}

async function capture(page: Page, name: string) {
  mkdirSync(screenshotDirectory, { recursive: true })
  await page.screenshot({ path: join(screenshotDirectory, `${name}.png`), fullPage: true })
}

function areaField(page: Page, field: string) {
  return page.getByTestId('area-record').getByTestId(`record-field-${field}`)
}

test('default preview prompt', async ({ page }) => {
  await showPreview(page, 'default')
  await expect(page.getByRole('heading', { name: 'Selecciona un área para consultar sus detalles.' })).toBeVisible()
  await expect(page.getByTestId('selected-area-preview')).toHaveCount(0)
  await capture(page, '01-default')
})

test('selected area with complete known information', async ({ page }) => {
  await showPreview(page, 'known')
  await expect(areaField(page, 'danger')).toHaveText('Peligro del área:Alto')
  await expect(areaField(page, 'hc-warning')).toHaveText('Advertencia Hardcore:Daño físico explosivo')
  await expect(areaField(page, 'rewards')).toContainText('Recompensa A')
  await expect(page.locator('.boss-record')).toHaveCount(1)
  await expect(page.getByTestId('area-record')).toContainText('Fuente Área')
  await expect(page.locator('.boss-record')).toContainText('Fuente Alfa')
  await capture(page, '02-known')
})

test('selected area with two independent bosses', async ({ page }) => {
  await showPreview(page, 'two-bosses')
  const bosses = page.locator('.boss-record')
  await expect(bosses).toHaveCount(2)
  await expect(bosses.nth(0)).toContainText('Recompensa Alfa')
  await expect(bosses.nth(0)).not.toContainText('Fuente Beta')
  await expect(bosses.nth(1)).toContainText('Recompensa Beta')
  await expect(bosses.nth(1)).toContainText('Fuente Beta')
  await expect(bosses.nth(1)).toContainText('Sin verificar')
  await capture(page, '03-two-bosses')
})

for (const state of ['unknown', 'verified-absent'] as const) {
  test(`${state} boss and reward knowledge`, async ({ page }) => {
    await showPreview(page, state)
    const bossText = state === 'unknown' ? 'Jefe:Desconocido' : 'Jefe:Ninguno'
    const rewardText = state === 'unknown' ? 'Recompensas:Desconocidas' : 'Recompensas:Ninguna'
    await expect(page.getByTestId('record-field-bosses')).toHaveText(bossText)
    await expect(areaField(page, 'rewards')).toHaveText(rewardText)
    await expect(page.locator('.boss-record')).toHaveCount(0)
    await capture(page, state === 'unknown' ? '04-unknown' : '05-verified-absence')
  })
}
