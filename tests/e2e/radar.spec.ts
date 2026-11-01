import { expect, test, waitForHydration } from './fixtures';

// The build reads the radar fixtures (tests/fixtures/radar) via the feed
// server, so these counts are stable.
test('the radar lists every source and filters by type', async ({ page }) => {
  await page.goto('/radar');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'What’s rising in AI and on GitHub'
  );
  const rows = page.locator('main ol > li');
  await expect(rows).toHaveCount(10);
  await expect(
    page.getByRole('link', { name: 'acme/agent-kit' })
  ).toHaveAttribute('href', 'https://github.com/acme/agent-kit');
  // Ask HN has no link of its own; it opens the thread.
  await expect(
    page.getByRole('link', { name: 'Ask HN: How do you evaluate LLM apps?' })
  ).toHaveAttribute('href', 'https://news.ycombinator.com/item?id=50300002');

  await waitForHydration(page);
  await page.getByRole('button', { name: 'Papers' }).click();
  await expect(rows).toHaveCount(2);
  await expect(rows.first()).toContainText('Sparse Mixture of Agents');
});

test('the radar is in the menu and in Turkish', async ({ page }) => {
  await page.goto('/tr/radar');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Yapay zekâda ve GitHub’da yükselenler'
  );
});
