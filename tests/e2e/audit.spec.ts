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

test.describe('phone controls', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('header controls and filter chips are at least 44px', async ({
    page,
  }) => {
    const small = async () =>
      page.evaluate(() =>
        [
          ...document.querySelectorAll(
            'header button, header nav[aria-label] a, [role="group"] button'
          ),
        ]
          .filter((el) => {
            const r = el.getBoundingClientRect();
            return r.width > 0 && (r.width < 44 || r.height < 44);
          })
          .map((el) => el.textContent?.trim() || el.getAttribute('aria-label'))
      );
    await page.goto('/');
    expect(await small()).toEqual([]);
    // Language and theme move into the phone menu.
    await page.getByRole('button', { name: 'Toggle navigation' }).click();
    await expect(
      page.locator('header').getByRole('button', { name: 'Toggle theme' })
    ).toBeVisible();
    expect(await small()).toEqual([]);
    await page.goto('/articles');
    expect(await small()).toEqual([]);
  });
});

test.describe('desktop controls', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test('stay compact', async ({ page }) => {
    await page.goto('/');
    const heights = await page
      .locator('header button:visible')
      .evaluateAll((els) => els.map((el) => el.getBoundingClientRect().height));
    // Sub-pixel layout rounding.
    expect(Math.max(...heights)).toBeLessThanOrEqual(40.5);
  });
});

test.describe('text at 200%', () => {
  test.use({ viewport: { width: 320, height: 700 } });

  test('nothing visible is clipped', async ({ page }) => {
    for (const path of ['/', '/contact']) {
      await page.goto(path);
      await page.evaluate(() => {
        document.documentElement.style.fontSize = '200%';
      });
      const clipped = await page.evaluate(() =>
        [...document.querySelectorAll('h1,h2,h3,p,a,button')]
          .filter(
            (el) =>
              !el.classList.contains('sr-only') &&
              getComputedStyle(el).overflow === 'hidden' &&
              el.scrollWidth > el.clientWidth + 2
          )
          .map((el) => el.textContent?.trim().slice(0, 30))
      );
      expect(clipped, path).toEqual([]);
    }
  });
});

test.describe('one authored motion moment', () => {
  test.use({ reducedMotion: 'no-preference' });

  test('sections do not each run an entrance animation', async ({ page }) => {
    for (const path of ['/', '/projects', '/contact']) {
      await page.goto(path);
      const entrances = await page.evaluate(
        () =>
          document
            .getAnimations()
            .filter(
              (animation) =>
                (animation as CSSAnimation).animationName === 'fade-up'
            ).length + document.querySelectorAll('.fade-up').length
      );
      expect(entrances, path).toBe(0);
    }
  });
});

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('keeps colour feedback but drops movement', async ({ page }) => {
    await page.goto('/');
    const link = page.locator('header nav a').first();
    const transition = await link.evaluate((el) => {
      const style = getComputedStyle(el);
      return {
        duration: parseFloat(style.transitionDuration),
        property: style.transitionProperty,
      };
    });
    expect(transition.duration).toBeGreaterThanOrEqual(0.1);
    expect(transition.property).not.toMatch(/transform|translate|all/);

    const moving = await page.evaluate(() =>
      [...document.querySelectorAll('.aurora-blob, .letter, .marquee > ul')]
        .map((el) => getComputedStyle(el).animationName)
        .filter((name) => name !== 'none')
    );
    expect(moving).toEqual([]);
  });
});

test('no eyebrow labels or gradient text on any page', async ({ page }) => {
  for (const path of [
    '/',
    '/tr',
    '/projects',
    '/articles',
    '/contact',
    '/does-not-exist',
  ]) {
    await page.goto(path);
    const found = await page.evaluate(() => ({
      eyebrows: document.querySelectorAll('.eyebrow').length,
      gradientText: [...document.querySelectorAll('body *')].filter(
        (el) => getComputedStyle(el).backgroundClip === 'text'
      ).length,
    }));
    expect(found, path).toEqual({ eyebrows: 0, gradientText: 0 });
  }
});

test.describe('phone primary actions', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('logo, menu call to action and form submit are at least 44px', async ({
    page,
  }) => {
    const size = (locator: import('@playwright/test').Locator) =>
      locator.evaluate((el) => {
        const r = el.getBoundingClientRect();
        return Math.min(r.width, r.height);
      });
    await page.goto('/');
    expect(await size(page.locator('header a').first())).toBeGreaterThanOrEqual(
      44
    );
    await page.getByRole('button', { name: 'Toggle navigation' }).click();
    const cta = page
      .locator('header')
      .getByRole('link', { name: "Let's Talk" })
      .last();
    await expect(cta).toBeVisible();
    expect(await size(cta)).toBeGreaterThanOrEqual(44);
    await page.goto('/contact');
    expect(
      await size(page.getByRole('button', { name: 'Send Message' }))
    ).toBeGreaterThanOrEqual(44);
  });
});
