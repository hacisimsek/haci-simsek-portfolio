import { expect, test } from './fixtures';

const steps = (page: import('@playwright/test').Page) =>
  page
    .getByRole('figure', { name: 'An order saga, running live' })
    .locator('li');

test('the hero shows the live saga, not a canvas', async ({ page }) => {
  await page.goto('/');
  const saga = page.getByRole('figure', {
    name: 'An order saga, running live',
  });
  await expect(saga).toBeVisible();
  await expect(steps(page)).toHaveCount(4);
  await expect(page.locator('canvas')).toHaveCount(0);
});

test.describe('with motion', () => {
  test.use({ reducedMotion: 'no-preference' });

  test('runs by itself', async ({ page }) => {
    await page.goto('/');
    await expect(steps(page).first()).toHaveAttribute(
      'data-status',
      'running',
      {
        timeout: 6000,
      }
    );
  });
});

test.describe('with reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('stays still until the visitor runs it', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(4000);
    for (const status of await steps(page).evaluateAll((items) =>
      items.map((item) => item.getAttribute('data-status'))
    )) {
      expect(status).toBe('done');
    }

    await page.getByRole('button', { name: 'Run with a failure' }).click();
    await expect(steps(page).nth(2)).toHaveAttribute('data-status', 'failed', {
      timeout: 6000,
    });
    await expect(
      page.getByRole('status').filter({ hasText: 'refunded' })
    ).toHaveText('Inventory failed. Payment refunded and order cancelled.', {
      timeout: 6000,
    });
    // The result stays on screen.
    await page.waitForTimeout(4000);
    await expect(steps(page).nth(2)).toHaveAttribute('data-status', 'failed');
  });
});

test.describe('on a phone', () => {
  test.use({ viewport: { width: 320, height: 720 } });

  test('fits the screen', async ({ page }) => {
    await page.goto('/');
    const width = await page.evaluate(
      () => document.documentElement.scrollWidth
    );
    expect(width).toBeLessThanOrEqual(320);
    await expect(
      page.getByRole('figure', { name: 'An order saga, running live' })
    ).toBeVisible();
  });
});
