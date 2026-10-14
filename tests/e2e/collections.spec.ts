import { expect, test, waitForHydration } from './fixtures';

test('projects can be searched', async ({ page }) => {
  await page.goto('/projects');
  await waitForHydration(page);
  await page.getByLabel('Search').fill('notify');
  await expect(page.locator('main a[target="_blank"]')).toHaveCount(1);
  await expect(page.getByRole('status')).toContainText('Showing 1 of 3');
});

test('the Turkish projects page explains an empty result', async ({ page }) => {
  await page.goto('/tr/projects');
  await waitForHydration(page);
  await page.getByLabel('Ara').fill('kafka');
  await expect(page.getByText('Eşleşen sonuç yok.')).toBeVisible();
  await page.getByRole('button', { name: 'Filtreleri sıfırla' }).click();
  await expect(page.locator('main a[target="_blank"]')).toHaveCount(3);
});
