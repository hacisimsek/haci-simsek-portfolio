import { expect, test } from './fixtures';

test('the Turkish home page is translated', async ({ page }) => {
  await page.goto('/tr');
  await expect(page.locator('html')).toHaveAttribute('lang', 'tr');
  await expect(
    page.getByRole('heading', {
      level: 1,
      name: /Yüksek trafikli ortamlar için backend/,
    })
  ).toBeVisible();
});

test('Turkish browsers are redirected once and English sticks', async ({
  browser,
}) => {
  const context = await browser.newContext({ locale: 'tr-TR' });
  const page = await context.newPage();

  await page.goto('/');
  await expect(page).toHaveURL(/\/tr$/);

  await page
    .getByRole('navigation', { name: 'Dil' })
    .getByRole('link', { name: 'English' })
    .click();
  await expect(page).toHaveURL(/\/$/);

  await page.reload();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await context.close();
});

test('the switcher keeps the current page', async ({ page }) => {
  await page.goto('/projects');
  await page
    .getByRole('navigation', { name: 'Language' })
    .getByRole('link', { name: 'Türkçe' })
    .click();
  await expect(page).toHaveURL(/\/tr\/projects$/);
  await expect(
    page.getByRole('heading', { level: 1, name: /Seçme işler/ })
  ).toBeVisible();
});

test('pages declare canonical and hreflang alternates', async ({ page }) => {
  await page.goto('/tr/projects');
  const href = (selector: string) =>
    page.locator(selector).getAttribute('href');

  expect(await href('link[rel="canonical"]')).toBe(
    'https://hacisimsek.com/tr/projects'
  );
  expect(await href('link[rel="alternate"][hreflang="en"]')).toBe(
    'https://hacisimsek.com/projects'
  );
  expect(await href('link[rel="alternate"][hreflang="tr"]')).toBe(
    'https://hacisimsek.com/tr/projects'
  );
  expect(await href('link[rel="alternate"][hreflang="x-default"]')).toBe(
    'https://hacisimsek.com/projects'
  );
  await expect(page).toHaveTitle(/Projeler/);
});

test('unknown Turkish paths show the localized 404', async ({ page }) => {
  const response = await page.goto('/tr/olmayan-sayfa');
  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole('heading', { name: 'Sayfa bulunamadı' })
  ).toBeVisible();
});
