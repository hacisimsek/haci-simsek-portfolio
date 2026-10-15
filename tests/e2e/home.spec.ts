import { expect, test } from './fixtures';

test('home has no stats strip and no rotating words', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('region', { name: 'At a glance' })).toHaveCount(
    0
  );
  await expect(page.getByText(/\d+\+ years of experience\s·\s/)).toBeVisible();
  await page.waitForTimeout(3500);
  await expect(page.locator('.word-in')).toHaveCount(0);
});

test('home shows each fact once', async ({ page }) => {
  await page.goto('/');
  await expect(
    page.getByRole('link', { name: /What is the Saga Pattern\?/ })
  ).toHaveCount(1);
  // The clock tile was filler; the page no longer shows a local time.
  await expect(page.getByText(/Local time/)).toHaveCount(0);
  // No wordmark in the footer; the name appears only in the copyright line.
  await expect(page.locator('footer > p')).toHaveCount(0);
});

test('home features fixture projects and articles', async ({ page }) => {
  await page.goto('/');
  const projects = page.getByRole('region', { name: 'Featured projects' });
  await expect(
    projects.getByRole('link', { name: /^E-commerce microservices/ })
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
    .getByRole('link', { name: /^NotifyHub/ });
  await link.focus();
  await expect(link).toBeFocused();
  await expect(link).toHaveAttribute('href', /^https:\/\/github\.com\//);
});

test('home never puts a card inside a card', async ({ page }) => {
  await page.goto('/');
  const nested = await page
    .locator('.surface-card, .section-shell')
    .evaluateAll(
      (cards) =>
        cards.filter((card) =>
          card.parentElement?.closest('.surface-card, .section-shell')
        ).length
    );
  expect(nested).toBe(0);
});

test.describe('on a phone', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('the name starts near the top of the first screen', async ({ page }) => {
    await page.goto('/');
    const box = await page.getByRole('heading', { level: 1 }).boundingBox();
    expect(box!.y).toBeLessThan(200);
  });
});

test('projects are a ruled list, not cards', async ({ page }) => {
  for (const [path, scope] of [
    ['/', page.getByRole('region', { name: 'Featured projects' })],
    ['/projects', page.locator('main ol')],
  ] as const) {
    await page.goto(path);
    await expect(
      scope.locator('a[href^="https://github.com/"]').first()
    ).toBeVisible();
    await expect(scope.locator('.surface-card, .meta-chip')).toHaveCount(0);
  }
});

test.describe('project rows on a phone', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('are comfortable touch targets', async ({ page }) => {
    await page.goto('/projects');
    const rows = page.locator('main a[href^="https://github.com/"]');
    for (const box of await rows.evaluateAll((links) =>
      links.map((link) => link.getBoundingClientRect().height)
    )) {
      expect(box).toBeGreaterThanOrEqual(44);
    }
  });
});

test('career, skills and education are set as type, not cards', async ({
  page,
}) => {
  await page.goto('/');
  for (const id of ['career', 'skills', 'education']) {
    const section = page.locator(`section#${id}`);
    await expect(section).toHaveCount(1);
    await expect(section.locator('.surface-card, .meta-chip')).toHaveCount(0);
  }
});

test('no wide-tracked uppercase labels and no monospace chips', async ({
  page,
}) => {
  await page.goto('/');
  const offenders = await page.evaluate(() =>
    [...document.querySelectorAll('main *')]
      .filter((el) => {
        const style = getComputedStyle(el);
        const tracked =
          style.textTransform === 'uppercase' &&
          parseFloat(style.letterSpacing) > 1;
        const monoChip =
          el.classList.contains('meta-chip') && /mono/i.test(style.fontFamily);
        return tracked || monoChip;
      })
      .map((el) => el.textContent?.trim())
  );
  expect(offenders).toEqual([]);
});

test('articles are typographic rows without stock thumbnails', async ({
  page,
}) => {
  for (const [path, scope] of [
    ['/', page.getByRole('region', { name: 'Latest writing' })],
    ['/articles', page.locator('main ol')],
  ] as const) {
    await page.goto(path);
    await expect(scope.getByRole('link').first()).toBeVisible();
    await expect(scope.locator('img, .surface-card, .meta-chip')).toHaveCount(
      0
    );
  }
});

test('page headings are not boxed', async ({ page }) => {
  for (const path of [
    '/projects',
    '/articles',
    '/contact',
    '/does-not-exist',
  ]) {
    await page.goto(path);
    const boxed = await page
      .getByRole('heading', { level: 1 })
      .evaluate((h1) => Boolean(h1.closest('.section-shell, .surface-card')));
    expect(boxed, path).toBe(false);
  }
});

test('contact notes are not cards inside a card', async ({ page }) => {
  await page.goto('/contact');
  const nested = await page
    .locator('.surface-card, .section-shell')
    .evaluateAll(
      (cards) =>
        cards.filter((card) =>
          card.parentElement?.closest('.surface-card, .section-shell')
        ).length
    );
  expect(nested).toBe(0);
});

test('separators never start a line', async ({ page }) => {
  for (const path of ['/', '/projects', '/articles', '/contact']) {
    await page.goto(path);
    const breakable = await page.evaluate(() => {
      const walker = document.createTreeWalker(
        document.querySelector('main')!,
        NodeFilter.SHOW_TEXT
      );
      const found: string[] = [];
      while (walker.nextNode()) {
        const text = walker.currentNode.textContent ?? '';
        if (/ ·/.test(text)) found.push(text.trim());
      }
      return found;
    });
    expect(breakable, path).toEqual([]);
  }
});

test('each contact note is a heading', async ({ page }) => {
  await page.goto('/contact');
  await expect(
    page.locator('main').getByRole('heading', { level: 2 })
  ).toHaveCount(4);
  // Headings are not allowed inside a definition term.
  await expect(page.locator('dt :is(h1, h2, h3, h4, h5, h6)')).toHaveCount(0);
});

test('about is prose, not cards', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#about')).toBeVisible();
  await expect(page.locator('#about .surface-card')).toHaveCount(0);
});

test('featured projects carry authored lines', async ({ page }) => {
  await page.goto('/');
  const region = page.getByRole('region', { name: 'Featured projects' });
  const rows = region.locator('a[href^="https://github.com/"]');
  const count = await rows.count();
  expect(count).toBeGreaterThan(0);
  expect(count).toBeLessThanOrEqual(4);
  // Only authored picks: no stand-in row with a raw GitHub description.
  await expect(region).not.toContainText('URL shortener');
  await expect(region).toContainText('event-driven saga');
  await expect(region).not.toContainText('orchestration-based');
});
