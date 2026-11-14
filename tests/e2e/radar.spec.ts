import { expect, test, waitForHydration } from './fixtures';

// The build reads the radar fixtures (tests/fixtures/radar) via the feed
// server, so these counts are stable.
test('the radar lists every source in lanes and searches across them', async ({
  page,
}) => {
  await page.goto('/radar');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'What’s rising in AI and on GitHub'
  );
  const rows = page.locator('main ol > li');
  await expect(rows).toHaveCount(11);
  await expect(
    page
      .getByRole('region', { name: /^Repositories/ })
      .getByRole('link', { name: 'acme/agent-kit' })
  ).toHaveAttribute('href', 'https://github.com/acme/agent-kit');
  // Ask HN has no link of its own; it opens the thread.
  await expect(
    page
      .getByRole('region', { name: /^News/ })
      .getByRole('link', { name: 'Ask HN: How do you evaluate LLM apps?' })
  ).toHaveAttribute('href', 'https://news.ycombinator.com/item?id=50300002');

  const papers = page.getByRole('region', { name: /^Papers/ });
  await expect(papers.locator('li')).toHaveCount(2);
  await expect(papers.locator('li').first()).toContainText(
    'Sparse Mixture of Agents'
  );
  // One pick per kind that has a score.
  await expect(
    page.getByRole('region', { name: 'Worth a look' }).locator('li')
  ).not.toHaveCount(0);

  await waitForHydration(page);
  await page.getByRole('searchbox').fill('sparse');
  await expect(rows).toHaveCount(1);
  await expect(page.getByRole('region', { name: 'Worth a look' })).toBeHidden();
});

test('the radar is in the menu and in Turkish', async ({ page }) => {
  await page.goto('/tr/radar');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Yapay zekâda ve GitHub’da yükselenler'
  );
});

// The time is Istanbul's; say so, or visitors elsewhere misread it.
test('the update time names its time zone', async ({ page }) => {
  for (const [path, label] of [
    ['/radar', /Updated \d{2}:\d{2}( [AP]M)? GMT\+3/],
    ['/tr/radar', /Güncellendi: \d{2}:\d{2} GMT\+3/],
  ] as const) {
    await page.goto(path);
    await expect(
      page.locator('header').filter({ has: page.locator('h1') })
    ).toContainText(label);
  }
});
