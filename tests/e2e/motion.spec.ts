import {
  expect,
  test,
  waitForEntranceAnimations,
  waitForHydration,
} from './fixtures';

test.describe('with motion', () => {
  test.use({ reducedMotion: 'no-preference' });

  test('no background layers, Lenis scrolls and the progress bar follows', async ({
    page,
  }) => {
    await page.goto('/');
    await expect(page.locator('[data-aurora], .grain, .page-grid')).toHaveCount(
      0
    );
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
    await expect(page.locator('html')).not.toHaveClass(/\blenis\b/);
    await expect(page.locator('[data-scroll-progress]')).toHaveCount(0);
    expect(
      await page
        .locator('#about')
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
    await waitForHydration(page);
    await page.keyboard.press('Control+k');
    await expect(page.getByRole('combobox')).toBeFocused();

    await page.mouse.move(20, 400);
    await page.mouse.wheel(0, 1200);
    await page.waitForTimeout(600);

    expect(await page.evaluate(() => window.scrollY)).toBe(0);
  });
});

test.describe('career timeline', () => {
  const fillScale = (page: import('@playwright/test').Page) =>
    page.locator('[data-timeline-fill]').evaluate((el) => {
      const transform = getComputedStyle(el).transform;
      return transform === 'none' ? 1 : new DOMMatrix(transform).d;
    });

  test.describe('with motion', () => {
    test.use({ reducedMotion: 'no-preference' });

    test('the line fills as the timeline scrolls', async ({ page }) => {
      await page.goto('/');
      await waitForHydration(page);
      await page.locator('#career').scrollIntoViewIfNeeded();
      await expect.poll(() => fillScale(page)).toBeLessThan(0.6);
      await page.evaluate(() =>
        window.scrollTo(0, document.documentElement.scrollHeight)
      );
      await expect.poll(() => fillScale(page)).toBeGreaterThan(0.95);
    });
  });

  test.describe('with reduced motion', () => {
    test.use({ reducedMotion: 'reduce' });

    test('the line is drawn in full', async ({ page }) => {
      await page.goto('/');
      expect(await fillScale(page)).toBe(1);
    });
  });
});

test.describe('one authored motion moment', () => {
  test.use({ reducedMotion: 'no-preference' });

  for (const path of ['/', '/projects']) {
    test(`${path} has no marquee, beam or tilt`, async ({ page }) => {
      await page.goto(path);
      await expect(page.locator('.marquee, .border-beam, .tilt')).toHaveCount(
        0
      );
    });
  }

  test('nothing loops forever', async ({ page }) => {
    await page.goto('/');
    const looping = await page.evaluate(() =>
      document
        .getAnimations()
        .filter(
          (animation) =>
            animation.effect?.getComputedTiming().iterations === Infinity
        )
        .map((animation) => {
          const target = (animation.effect as KeyframeEffect).target;
          return target instanceof Element ? target.className : '';
        })
    );
    expect(looping).toEqual([]);
  });
});
