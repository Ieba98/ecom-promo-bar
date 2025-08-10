import { test, expect } from '@playwright/test';

test('settings page renders', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Promo Bar Einstellungen' })).toBeVisible();
}); 