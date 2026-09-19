import { expect, test } from '@playwright/test'

test('harness smoke: starts the configured web server and reaches the app shell', async ({ page }) => {
  const response = await page.goto('/')
  expect(response?.ok()).toBe(true)
  await expect(page.locator('body')).toBeVisible()
})
