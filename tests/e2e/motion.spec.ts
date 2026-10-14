import { expect, test } from './fixtures';

test.describe('with motion', () => {
  test.use({ reducedMotion: 'no-preference' });

  test('aurora drifts, Lenis scrolls and the progress bar follows', async ({
    page,
  }) => {
    await page.goto('/');
    const blob = page.locator('[data-aurora] [data-blob]').first();
    await expect(blob).toHaveCount(1);
    expect(
      await blob.evaluate((el) => getComputedStyle(el).animationName)
    ).not.toBe('none');
    await expect(page.locator('html')).toHaveClass(/\blenis\b/);

    const bar = page.locator('[data-scroll-progress]');
    await expect(bar).toHaveCount(1);
    await page.mouse.wheel(0, 2000);
    await expect
      .poll(() =>
        bar.evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).a)
      )
      .toBeGreaterThan(0.05);
  });
});

test.describe('with reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('everything holds still and content is visible', async ({ page }) => {
    await page.goto('/');
    const blob = page.locator('[data-aurora] [data-blob]').first();
    expect(
      await blob.evaluate((el) => getComputedStyle(el).animationName)
    ).toBe('none');
    await expect(page.locator('html')).not.toHaveClass(/\blenis\b/);
    await expect(page.locator('[data-scroll-progress]')).toHaveCount(0);
    expect(
      await page
        .locator('.fade-up')
        .first()
        .evaluate((el) => getComputedStyle(el).opacity)
    ).toBe('1');
  });
});
