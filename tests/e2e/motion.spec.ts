import { expect, test, waitForEntranceAnimations } from './fixtures';

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

test.describe('smooth scrolling side effects', () => {
  test.use({ reducedMotion: 'no-preference' });

  test('a reload keeps the restored scroll position', async ({ page }) => {
    await page.goto('/');
    await waitForEntranceAnimations(page);
    await page.evaluate(() => window.scrollTo(0, 1500));
    await page.waitForTimeout(300);
    await page.reload();
    await page.waitForFunction(() =>
      document.documentElement.classList.contains('lenis')
    );
    await page.waitForTimeout(500);

    expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(1000);
  });

  test('the page does not scroll behind the open palette', async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() =>
      document.documentElement.classList.contains('lenis')
    );
    await page.keyboard.press('Control+k');
    await expect(page.getByRole('combobox')).toBeFocused();

    await page.mouse.move(20, 400);
    await page.mouse.wheel(0, 1200);
    await page.waitForTimeout(600);

    expect(await page.evaluate(() => window.scrollY)).toBe(0);
  });
});
