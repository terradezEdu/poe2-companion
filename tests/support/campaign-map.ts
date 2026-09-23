import { expect, type Locator, type Page } from '@playwright/test'
import { campaignFixtures, fixtureUrl, type CampaignFixture } from '../../src/test-support/campaign-fixtures'

/**
 * Observable selectors for the campaign-map contract.
 *
 * The helpers intentionally prefer accessible roles and names. Test-only data
 * attributes identify the map, selected preview, graph direction, selected
 * node, and record fields. They are not product requirements or user-facing
 * UI; their only purpose is to make record ownership testable.
 */
export function area(page: Page, name: string) {
  return page.getByRole('button', { name: new RegExp(`^${escapeRegExp(name)}$`, 'i') })
}

export function preview(page: Page) {
  return page.getByTestId('selected-area-preview')
}

export function campaignMap(page: Page) {
  return page.getByTestId('campaign-map')
}

export function selectedAreas(page: Page) {
  return page.locator('[data-campaign-area][data-selected="true"]')
}

export function areaRecord(page: Page) {
  return preview(page).getByTestId('area-record')
}

export function bossRecord(page: Page, name: string) {
  return preview(page).getByRole('article', { name: new RegExp(`^${escapeRegExp(name)}$`, 'i') })
}

export function recordField(record: Locator, name: string) {
  return record.getByTestId(`record-field-${name}`).locator('dd')
}

/** SVG paths with a straight horizontal/vertical segment may have a zero-size
 * dimension, which makes Playwright's generic toBeVisible report them hidden. */
export async function expectVisibleConnection(connection: Locator) {
  await expect(connection).toHaveAttribute('d', /\S/)
  await expect.poll(() => connection.evaluate((path) => {
    const rect = path.getBoundingClientRect()
    const style = getComputedStyle(path)
    return style.visibility !== 'hidden' && style.stroke !== 'none' &&
      Number.parseFloat(style.strokeWidth) > 0 && (rect.width > 0 || rect.height > 0)
  })).toBe(true)
}

export async function openCampaignMap(page: Page, fixture?: CampaignFixture) {
  await page.goto(fixtureUrl(fixture ?? campaignFixtures.applicationDefault))
}

export async function selectArea(page: Page, name: string) {
  await area(page, name).click()
  await expect(preview(page)).toContainText(name)
}

export function mapViewport(page: Page) {
  return page.getByTestId('campaign-map-viewport')
}

export async function panAndZoom(page: Page) {
  const box = await mapViewport(page).boundingBox()
  expect(box).not.toBeNull()
  if (!box) throw new Error('Campaign map viewport is not available for pan and zoom.')

  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
  await page.mouse.down()
  await page.mouse.move(box.x + box.width / 2 + 80, box.y + box.height / 2 + 30)
  await page.mouse.up()
  await page.mouse.wheel(0, -300)
}

export async function expectBefore(first: Locator, second: Locator) {
  const [firstHandle, secondHandle] = await Promise.all([first.elementHandle(), second.elementHandle()])
  expect(firstHandle).not.toBeNull()
  expect(secondHandle).not.toBeNull()
  if (!firstHandle || !secondHandle) return

  try {
    const firstPrecedesSecond = await firstHandle.evaluate(
      (firstElement, secondElement) => Boolean(firstElement.compareDocumentPosition(secondElement) & Node.DOCUMENT_POSITION_FOLLOWING),
      secondHandle,
    )
    expect(firstPrecedesSecond).toBe(true)
  } finally {
    await firstHandle.dispose()
    await secondHandle.dispose()
  }
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
