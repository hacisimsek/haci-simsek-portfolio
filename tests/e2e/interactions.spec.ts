import { expect, revealHeaderControls, test } from './fixtures';

test('theme toggle switches and persists across reloads', async ({ page }) => {
  await page.goto('/');
  const html = page.locator('html');
  const initial = (await html.getAttribute('class'))?.includes('dark')
    ? 'dark'
    : 'light';
  const next = initial === 'dark' ? 'light' : 'dark';

  await revealHeaderControls(page);
  await page.getByRole('button', { name: 'Toggle theme' }).click();
  await expect(html).toHaveClass(new RegExp(`\\b${next}\\b`));

  await page.reload();
  await expect(html).toHaveClass(new RegExp(`\\b${next}\\b`));
});

test('mobile menu reveals the navigation links', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'mobile navigation only');
  await page.goto('/');

  const projects = page
    .locator('header')
    .getByRole('link', { name: 'Projects', exact: true })
    .last();
  await expect(projects).not.toBeInViewport();

  await page.getByRole('button', { name: 'Toggle navigation' }).click();
  await expect(projects).toBeInViewport();

  await projects.click();
  await expect(page).toHaveURL(/\/projects$/);
});
