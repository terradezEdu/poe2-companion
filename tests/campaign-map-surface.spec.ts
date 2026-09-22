import { expect, test } from '@playwright/test'
import { area, campaignMap, mapViewport, selectedAreas } from './support/campaign-map'

async function openSurface(page: import('@playwright/test').Page) {
  await page.goto('/?__campaignMapSurface=1')
  await expect(campaignMap(page)).toBeVisible()
}

test.describe('Campaign Map surface — Issue #7 task gate', () => {
  test('renders direct transition directionality without route claims', async ({ page }) => {
    await openSurface(page)

    await expect(page.getByTestId('campaign-connection-area-a-area-b')).toHaveAttribute('data-direction', 'both')
    await expect(page.getByTestId('campaign-connection-area-b-area-c')).toHaveAttribute('data-direction', 'area-b-to-area-c')
    await expect(page.getByText(/recomendad[oa]|óptim[oa]|obligatori[oa]/i)).toHaveCount(0)
  })

  test('pointer selection emits exactly one stable identifier and survives pan and zoom', async ({ page }) => {
    await openSurface(page)
    await area(page, 'Área A').click()
    await expect(selectedAreas(page)).toHaveCount(1)
    await expect(page.getByTestId('selected-area-id')).toHaveText('area-a')

    await area(page, 'Área B').click()
    await expect(selectedAreas(page)).toHaveCount(1)
    await expect(selectedAreas(page)).toHaveAttribute('data-area-id', 'area-b')

    const viewport = mapViewport(page)
    const canvas = page.locator('.campaign-map__canvas')
    const before = await canvas.getAttribute('style')
    const box = await viewport.boundingBox()
    expect(box).not.toBeNull()
    if (!box) return
    await page.mouse.move(box.x + box.width - 30, box.y + box.height - 30)
    await page.mouse.down()
    await page.mouse.move(box.x + box.width - 90, box.y + box.height - 80)
    await page.mouse.up()
    await page.mouse.wheel(0, -300)

    await expect(canvas).not.toHaveAttribute('style', before ?? '')
    await expect(selectedAreas(page)).toHaveAttribute('data-area-id', 'area-b')
    await expect(page.getByTestId('selected-area-id')).toHaveText('area-b')
  })

  test('focus is visible-capable and activation, not focus, selects the node', async ({ page }) => {
    await openSurface(page)
    const node = area(page, 'Área C')

    await node.focus()
    await expect(node).toBeFocused()
    await expect(node).toHaveAccessibleName('Área C')
    await expect(node).toHaveCSS('outline-style', 'solid')
    await expect(selectedAreas(page)).toHaveCount(0)

    await page.keyboard.press('Enter')
    await expect(selectedAreas(page)).toHaveCount(1)
    await expect(selectedAreas(page)).toHaveAttribute('data-area-id', 'area-c')
    await expect(page.getByTestId('selected-area-id')).toHaveText('area-c')
  })
})
