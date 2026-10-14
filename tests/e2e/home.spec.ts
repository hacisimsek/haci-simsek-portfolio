import { expect, test } from './fixtures';

test('home has no stats strip and no rotating words', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('region', { name: 'At a glance' })).toHaveCount(
    0
  );
  await expect(page.getByText(/\d+\+ years of experience · /)).toBeVisible();
  await page.waitForTimeout(3500);
  await expect(page.locator('.word-in')).toHaveCount(0);
});

test('home shows each fact once', async ({ page }) => {
  await page.goto('/');
  await expect(
    page.getByRole('link', { name: /What is the Saga Pattern\?/ })
  ).toHaveCount(1);
  await expect(page.getByText(/Local time in Istanbul/)).toHaveCount(1);
  await expect(page.locator('footer').getByText('Hacı Şimşek')).toHaveCount(0);
});

test('home features fixture projects and articles', async ({ page }) => {
  await page.goto('/');
  const projects = page.getByRole('region', { name: 'Featured projects' });
  await expect(
    projects.getByRole('link', { name: /ecommerce-microservices/ })
  ).toBeVisible();
  await expect(projects.getByText('Flagship')).toBeVisible();
  await expect(
    projects.getByRole('link', { name: /All projects/ })
  ).toHaveAttribute('href', '/projects');

  const writing = page.getByRole('region', { name: 'Latest writing' });
  await expect(
    writing.getByRole('link', { name: /Saga Pattern/ })
  ).toBeVisible();
});

test('project cards are plain, focusable links', async ({ page }) => {
  await page.goto('/');
  const link = page
    .getByRole('region', { name: 'Featured projects' })
    .getByRole('link', { name: /notifyhub/ });
  await link.focus();
  await expect(link).toBeFocused();
  await expect(link).toHaveAttribute('href', /^https:\/\/github\.com\//);
});
