import { expect, test } from './fixtures';

// Pins the fixes from the Impeccable audit.

test('blur is reserved for the header', async ({ page }) => {
  await page.goto('/');
  const blurred = await page.evaluate(
    () =>
      [...document.querySelectorAll('*')].filter((el) => {
        const value = getComputedStyle(el).backdropFilter;
        return value && value !== 'none';
      }).length
  );
  // The header bar and its (collapsed) mobile menu.
  expect(blurred).toBeLessThanOrEqual(2);
});

test.describe('hero name', () => {
  test.use({ reducedMotion: 'no-preference' });

  test('is fully visible from the first frame', async ({ page }) => {
    await page.goto('/', { waitUntil: 'commit' });
    await page.waitForSelector('h1 .letter');
    const opacities = await page
      .locator('h1 .letter')
      .evaluateAll((letters) =>
        letters.map((letter) => getComputedStyle(letter).opacity)
      );
    expect(new Set(opacities)).toEqual(new Set(['1']));
  });
});
