import { expect, test } from './fixtures';

test.use({ sphere: true });

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

test.describe('sphere resilience', () => {
  test.use({ reducedMotion: 'no-preference' });

  test.beforeEach(({ viewport }) => {
    test.skip((viewport?.width ?? 0) < 1024, 'phones only get the CSS orb');
  });

  test('a failed three.js download leaves the page and the orb intact', async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.route('**/_next/static/chunks/*.js', async (route) => {
      const response = await route.fetch();
      const body = await response.text();
      if (body.includes('WebGLRenderer')) return route.abort();
      return route.fulfill({ response, body });
    });
    await page.goto('/');
    await page.waitForTimeout(4000);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.locator('[data-orb]:visible').first()).toBeVisible();
    expect(errors).toEqual([]);
  });

  test('re-renders sharply when the pixel ratio changes', async ({ page }) => {
    await page.goto('/');
    const sphere = page.locator('canvas[data-sphere]');
    await expect(sphere).toBeVisible({ timeout: 8000 });
    const cdp = await page.context().newCDPSession(page);
    // CDP does not fire resolution media-query changes, so pair the new ratio
    // with a resize, as zooming does.
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1360,
      height: 720,
      deviceScaleFactor: 2,
      mobile: false,
    });
    await expect
      .poll(() =>
        sphere.evaluate((canvas) => {
          const c = canvas as HTMLCanvasElement;
          return (
            Math.round((c.width / c.getBoundingClientRect().width) * 100) / 100
          );
        })
      )
      .toBe(1.75);
  });

  test('keeps the sphere on a steady 30 Hz display', async ({ page }) => {
    // Needs a GPU that renders above 30 fps; CI renders WebGL on the CPU, where
    // falling back is the correct outcome. isSlow() unit tests cover the logic.
    test.skip(!!process.env.CI, 'needs a real GPU');
    // Halve rAF, as battery savers and 30 Hz monitors do.
    await page.addInitScript(() => {
      const raf = window.requestAnimationFrame.bind(window);
      window.requestAnimationFrame = (callback) =>
        raf(() => raf((time) => callback(time)));
    });
    await page.goto('/');
    const sphere = page.locator('canvas[data-sphere]');
    await expect(sphere).toBeVisible({ timeout: 8000 });
    await page.waitForTimeout(9000);
    await expect(sphere).toHaveCount(1);
  });
});

test.describe('sphere housekeeping', () => {
  test.use({ reducedMotion: 'no-preference' });

  test.beforeEach(async ({ page, viewport }) => {
    test.skip((viewport?.width ?? 0) < 1024, 'phones only get the CSS orb');
    await page.goto('/');
    await expect(page.locator('canvas[data-sphere]')).toBeVisible({
      timeout: 8000,
    });
  });

  test('scrolling does not re-run the palette', async ({ page }) => {
    await page.evaluate(() => {
      const canvas = document.querySelector('canvas[data-sphere]')!;
      (window as unknown as { paletteWrites: number }).paletteWrites = 0;
      new MutationObserver((records) => {
        (window as unknown as { paletteWrites: number }).paletteWrites +=
          records.length;
      }).observe(canvas, { attributeFilter: ['data-palette'] });
    });
    for (let i = 0; i < 3; i++) {
      await page.mouse.wheel(0, 300);
      await page.waitForTimeout(400);
    }
    expect(
      await page.evaluate(
        () => (window as unknown as { paletteWrites: number }).paletteWrites
      )
    ).toBe(0);
  });

  test('the hidden CSS orb stops animating', async ({ page }) => {
    await expect
      .poll(() =>
        page
          .locator('.hidden.lg\\:block .orb-core')
          .evaluate((el) => getComputedStyle(el).animationPlayState)
      )
      .toBe('paused');
  });
});

test.describe('phone orb', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('sits behind the name', async ({ page }) => {
    await page.goto('/');
    const orb = await page.locator('[data-orb]:visible').first().boundingBox();
    const name = await page.locator('h1 > span[aria-hidden]').boundingBox();
    expect(orb!.y).toBeLessThan(name!.y + name!.height);
    expect(orb!.y + orb!.height).toBeGreaterThan(name!.y);
  });
});

test.describe('sphere and live preference changes', () => {
  test.use({ reducedMotion: 'no-preference' });

  test.beforeEach(({ viewport }) => {
    test.skip((viewport?.width ?? 0) < 1024, 'phones only get the CSS orb');
  });

  test('turning on reduced motion stops the sphere', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto('/');
    await expect(page.locator('canvas[data-sphere]')).toBeVisible({
      timeout: 8000,
    });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(page.locator('canvas[data-sphere]')).toHaveCount(0);
    await expect(page.locator('[data-orb]:visible').first()).toBeVisible();
    expect(errors).toEqual([]);
  });

  test('losing the GPU context logs nothing', async ({ page }) => {
    const messages: string[] = [];
    page.on('console', (message) => {
      if (['warning', 'error'].includes(message.type())) {
        messages.push(message.text());
      }
    });
    await page.goto('/');
    await expect(page.locator('canvas[data-sphere]')).toBeVisible({
      timeout: 8000,
    });
    await page.locator('canvas[data-sphere]').evaluate((canvas) => {
      (canvas as HTMLCanvasElement)
        .getContext('webgl2')
        ?.getExtension('WEBGL_lose_context')
        ?.loseContext();
    });
    await expect(page.locator('canvas[data-sphere]')).toHaveCount(0);
    await page.waitForTimeout(300);
    // SwiftShader also logs driver performance notes; only three.js warnings count.
    expect(messages.filter((text) => /THREE\./.test(text))).toEqual([]);
  });
});
