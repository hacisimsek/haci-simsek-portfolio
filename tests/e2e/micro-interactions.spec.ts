import { expect, test, waitForHydration } from './fixtures';

test.describe('pointer feedback', () => {
  test.skip(({ isMobile }) => isMobile, 'needs a fine pointer');

  test('one pill follows the pointer across the menu', async ({ page }) => {
    await page.goto('/projects');
    await waitForHydration(page);
    const nav = page.locator('header nav').first();
    const pill = nav.locator('span[aria-hidden]').first();
    await expect(pill).toHaveCSS('opacity', '0');

    const radar = nav.getByRole('link', { name: 'Radar' });
    await radar.hover();
    await expect(pill).toHaveCSS('opacity', '1');
    const box = await radar.boundingBox();
    await expect
      .poll(async () => (await pill.boundingBox())?.x)
      .toBeCloseTo(box!.x, 0);

    await page.mouse.move(5, 600);
    await expect(pill).toHaveCSS('opacity', '0');
  });

  test('rows track the pointer for their glow', async ({ page }) => {
    await page.goto('/projects');
    await waitForHydration(page);
    const row = page.locator('.spotlight').first();
    const box = (await row.boundingBox())!;
    await page.mouse.move(box.x + 40, box.y + 20);
    await page.mouse.move(box.x + 50, box.y + 24);
    await expect
      .poll(() => row.evaluate((el) => el.style.getPropertyValue('--mx')))
      .toBe('50px');
  });
});
