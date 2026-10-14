import { expect, test } from './fixtures';

test('home stats count the fixture feeds', async ({ page }) => {
  await page.goto('/');
  const stats = page.getByRole('region', { name: 'At a glance' });
  const repos = stats.locator('div', { hasText: 'Open-source repos' });
  await expect(repos.locator('dd .sr-only')).toHaveText('3');
  const articles = stats.locator('div', { hasText: 'Articles' });
  await expect(articles.locator('dd .sr-only')).toHaveText('3');
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

test('tilting project cards still fade their border colour', async ({
  page,
}) => {
  await page.goto('/');
  const card = page
    .getByRole('region', { name: 'Featured projects' })
    .getByRole('link', { name: /notifyhub/ });
  const transition = await card.evaluate(
    (el) => getComputedStyle(el).transitionProperty
  );
  expect(transition).toContain('transform');
  expect(transition).toContain('border-color');
});
