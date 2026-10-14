import { expect, test } from './fixtures';

test.describe('hero visual with motion', () => {
  test.use({ reducedMotion: 'no-preference' });

  test('upgrades the CSS orb to a WebGL sphere', async ({ page, viewport }) => {
    test.skip((viewport?.width ?? 0) < 1024, 'phones only get the CSS orb');
    await page.goto('/');
    await expect(page.locator('[data-orb]').first()).toBeAttached();
    await expect(page.locator('canvas[data-sphere]')).toBeVisible({
      timeout: 8000,
    });
  });
});

test.describe('hero visual with reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('keeps the CSS orb and never downloads three.js', async ({ page }) => {
    const chunks: string[] = [];
    page.on('response', async (response) => {
      if (response.url().endsWith('.js')) {
        const body = await response.text().catch(() => '');
        if (body.includes('WebGLRenderer')) chunks.push(response.url());
      }
    });
    await page.goto('/');
    await expect(page.locator('[data-orb]:visible').first()).toBeVisible();
    await page.waitForTimeout(3000);
    await expect(page.locator('canvas[data-sphere]')).toHaveCount(0);
    expect(chunks).toEqual([]);
  });
});

test.describe('hero visual on a phone', () => {
  test.use({
    reducedMotion: 'no-preference',
    viewport: { width: 390, height: 844 },
  });

  test('shows only the CSS orb and never downloads three.js', async ({
    page,
  }) => {
    const chunks: string[] = [];
    page.on('response', async (response) => {
      if (response.url().endsWith('.js')) {
        const body = await response.text().catch(() => '');
        if (body.includes('WebGLRenderer')) chunks.push(response.url());
      }
    });
    await page.goto('/');
    await expect(page.locator('[data-orb]:visible').first()).toBeVisible();
    await page.waitForTimeout(3000);
    await expect(page.locator('canvas[data-sphere]')).toHaveCount(0);
    expect(chunks).toEqual([]);
  });
});

test.describe('running sphere', () => {
  test.use({ reducedMotion: 'no-preference' });

  test.beforeEach(async ({ page, viewport }) => {
    test.skip((viewport?.width ?? 0) < 1024, 'phones only get the CSS orb');
    await page.goto('/');
    await expect(page.locator('canvas[data-sphere]')).toBeVisible({
      timeout: 8000,
    });
  });

  test('pauses offscreen and resumes when back in view', async ({ page }) => {
    const sphere = page.locator('canvas[data-sphere]');
    await expect(sphere).toHaveAttribute('data-running', 'true');
    await page.evaluate(() => window.scrollTo(0, 3000));
    await expect(sphere).toHaveAttribute('data-running', 'false');
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect(sphere).toHaveAttribute('data-running', 'true');
  });

  test('follows the theme without a reload', async ({ page }) => {
    const sphere = page.locator('canvas[data-sphere]');
    const before = await sphere.getAttribute('data-palette');
    await page.getByRole('button', { name: 'Toggle theme' }).click();
    await expect(sphere).not.toHaveAttribute('data-palette', before!);
  });

  test('falls back to the CSS orb when the GPU context is lost', async ({
    page,
  }) => {
    await page.locator('canvas[data-sphere]').evaluate((canvas) => {
      const gl = (canvas as HTMLCanvasElement).getContext('webgl2');
      gl?.getExtension('WEBGL_lose_context')?.loseContext();
    });
    await expect(page.locator('canvas[data-sphere]')).toHaveCount(0);
    const orb = page.locator('[data-orb]:visible').first();
    await expect(orb).toBeVisible();
    await expect
      .poll(() =>
        orb.evaluate((el) => getComputedStyle(el.parentElement!).opacity)
      )
      .toBe('1');
  });

  test('keeps the canvas sized to its box with a capped pixel ratio', async ({
    page,
  }) => {
    const sphere = page.locator('canvas[data-sphere]');
    await page.setViewportSize({ width: 1600, height: 1000 });
    await expect
      .poll(() =>
        sphere.evaluate((canvas) => {
          const c = canvas as HTMLCanvasElement;
          const ratio = c.width / c.getBoundingClientRect().width;
          return ratio > 0.99 && ratio <= 1.75;
        })
      )
      .toBe(true);
  });
});
