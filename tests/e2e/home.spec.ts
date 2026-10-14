import { expect, test } from './fixtures';

test('home stats count the fixture feeds', async ({ page }) => {
  await page.goto('/');
  const stats = page.getByRole('region', { name: 'At a glance' });
  const repos = stats.locator('div', { hasText: 'Open-source repos' });
  await expect(repos.locator('dd .sr-only')).toHaveText('3');
  const articles = stats.locator('div', { hasText: 'Articles' });
  await expect(articles.locator('dd .sr-only')).toHaveText('3');
});
