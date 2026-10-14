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
