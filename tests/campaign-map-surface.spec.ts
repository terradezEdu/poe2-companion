import { expect, test } from '@playwright/test'
import { campaignFixtures, fixtureUrl } from '../src/test-support/campaign-fixtures'
import { area, campaignMap, mapViewport, selectedAreas } from './support/campaign-map'

async function openSurface(page: import('@playwright/test').Page, fixture = campaignFixtures.mapInteraction) {
  await page.goto(fixtureUrl(fixture))
  await expect(campaignMap(page)).toBeVisible()
}

test.describe('Campaign Map surface — Issue #7 task gate', () => {
  test('renders direct transition directionality without route claims', async ({ page }) => {
    await openSurface(page)

    const bidirectional = page.getByTestId('campaign-connection-area-a-area-b')
    const directed = page.getByTestId('campaign-connection-area-b-area-c')
    await expect(bidirectional).toHaveAttribute('data-direction', 'both')
    await expect(bidirectional).toHaveAttribute('marker-start', /campaign-map-arrow-both-start/)
    await expect(bidirectional).toHaveAttribute('marker-end', /campaign-map-arrow-both-end/)
    await expect(directed).toHaveAttribute('data-direction', 'area-b-to-area-c')
    await expect(directed).toHaveAttribute('marker-end', /campaign-map-arrow-directed/)
    await expect(directed).not.toHaveAttribute('marker-start')
    await expect(directed).toHaveCSS('stroke-dasharray', /10px, 7px|10 7/)
    await expect(page.getByText(/recomendad[oa]|óptim[oa]|obligatori[oa]/i)).toHaveCount(0)
  })

  test('routes a corner-to-corner transition around unrelated nodes, including a wrapped label', async ({ page }) => {
    await openSurface(page, campaignFixtures.mapLayoutCrossing)
    const edge = page.getByTestId('campaign-connection-area-a-area-i')
    const wrapped = area(page, 'La extensa región de los antiguos pretorianos corrompidos')
    await expect(edge).toBeVisible()
    await expect(edge).toHaveAttribute('data-direction', 'area-a-to-area-i')
    const localConnection = page.getByTestId('campaign-connection-area-a-area-b')
    await expect(localConnection).toHaveAttribute('data-direction', 'both')
    await expect(localConnection).toHaveAttribute('marker-start', /campaign-map-arrow-both-start/)
    await page.screenshot({ path: '/tmp/campaign-map-issue-7-crossing.png', fullPage: true })

    const wrappedBox = await wrapped.boundingBox()
    expect(wrappedBox).not.toBeNull()
    expect(wrappedBox!.height).toBeGreaterThan(100)
    const samples = await edge.evaluate((path) => {
      const svg = path.ownerSVGElement!
      const geometry = path as SVGGeometryElement
      const length = geometry.getTotalLength()
      const matrix = geometry.getScreenCTM()!
      const result: Array<{ x: number; y: number }> = []
      for (let distance = 1; distance < length; distance += 4) {
        const point = svg.createSVGPoint()
        const local = geometry.getPointAtLength(distance)
        point.x = local.x
        point.y = local.y
        const screen = point.matrixTransform(matrix)
        result.push({ x: screen.x, y: screen.y })
      }
      return result
    })
    for (const node of await page.locator('[data-campaign-area]').all()) {
      const id = await node.getAttribute('data-area-id')
      if (id === 'area-a' || id === 'area-i') continue
      const box = await node.boundingBox()
      expect(box).not.toBeNull()
      if (!box) continue
      expect(samples.some((point) =>
        point.x >= box.x && point.x <= box.x + box.width &&
        point.y >= box.y && point.y <= box.y + box.height,
      ), `edge crosses unrelated node ${id}`).toBe(false)
    }
  })

  test('keeps the A-to-I transition distinct from local connections near B and C', async ({ page }) => {
    await openSurface(page, campaignFixtures.mapLayoutCrossing)
    await expect(page.getByTestId('campaign-connection-area-a-area-i')).toBeVisible()
    const geometry = await page.locator('.campaign-map__edges').evaluate((svg) => {
      const sample = (id: string) => {
        const path = svg.querySelector<SVGPathElement>(`[data-testid="campaign-connection-${id}"]`)!
        const points: Array<{ x: number; y: number }> = []
        for (let distance = 0; distance <= path.getTotalLength(); distance += 2) {
          const point = path.getPointAtLength(distance)
          points.push({ x: point.x, y: point.y })
        }
        return { points, start: points[0] }
      }
      const long = sample('area-a-area-i')
      const ab = sample('area-a-area-b')
      const bc = sample('area-b-area-c')
      const clearance = (local: typeof long) => Math.min(...long.points.flatMap((point) =>
        local.points.map((other) => Math.hypot(point.x - other.x, point.y - other.y)),
      ))
      return {
        longStart: long.start,
        abStart: ab.start,
        distanceFromAb: clearance(ab),
        distanceFromBc: clearance(bc),
      }
    })
    expect(geometry.longStart.x).toBeLessThan(geometry.abStart.x)
    expect(geometry.longStart.y).toBeGreaterThan(geometry.abStart.y)
    expect(geometry.distanceFromAb).toBeGreaterThan(24)
    expect(geometry.distanceFromBc).toBeGreaterThan(24)
    await page.screenshot({ path: '/tmp/campaign-map-issue-7-near-node.png', fullPage: true })
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

  test('selected styling remains distinct while keyboard focus moves elsewhere', async ({ page }) => {
    await openSurface(page)
    const selected = area(page, 'Área A')
    const focused = area(page, 'Área C')
    await selected.click()
    await focused.focus()

    await expect(selected).toHaveAttribute('aria-pressed', 'true')
    await expect(focused).toHaveAttribute('aria-pressed', 'false')
    await expect(focused).toBeFocused()
    await expect(focused).toHaveCSS('outline-style', 'solid')
    await expect(selected).not.toHaveCSS('outline-style', 'solid')
  })
})
