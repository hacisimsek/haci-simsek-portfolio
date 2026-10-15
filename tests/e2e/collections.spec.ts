import { expect, test, waitForHydration } from './fixtures';

test('projects can be searched', async ({ page }) => {
  await page.goto('/projects');
  await waitForHydration(page);
  await page.getByLabel('Search').fill('notify');
  await expect(page.locator('main a[target="_blank"]')).toHaveCount(1);
  await expect(page.locator('main').getByRole('status')).toContainText(
    'Showing 1 of 3'
  );
});

test('the Turkish projects page explains an empty result', async ({ page }) => {
  await page.goto('/tr/projects');
  await waitForHydration(page);
  // Search reads the text each row shows, authored lines included.
  await page.getByLabel('Ara').fill('kafka');
  await expect(page.locator('main a[target="_blank"]')).toHaveCount(2);
  await page.getByLabel('Ara').fill('xyzzy');
  await expect(page.getByText('Eşleşen sonuç yok.')).toBeVisible();
  await page.getByRole('button', { name: 'Filtreleri sıfırla' }).click();
  await expect(page.locator('main a[target="_blank"]')).toHaveCount(3);
});

test('articles can be filtered by topic', async ({ page }) => {
  await page.goto('/articles');
  await waitForHydration(page);
  await page
    .getByRole('group', { name: 'Topic' })
    .getByRole('button', { name: 'resilience' })
    .click();
  await expect(page.locator('main a[target="_blank"]')).toHaveCount(1);
  await expect(
    page.getByRole('link', { name: /Circuit Breaker/ })
  ).toBeVisible();
});

test('the projects page leads with the flagship and shows no bulk dates', async ({
  page,
}) => {
  await page.goto('/projects');
  const first = page.locator('main a[href^="https://github.com/"]').first();
  await expect(first).toContainText('E-commerce microservices');
  await expect(first).toContainText('Flagship');
  await expect(page.locator('main')).not.toContainText('Updated');
});
