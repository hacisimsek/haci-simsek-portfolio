import { expect, test, waitForEntranceAnimations } from './fixtures';

const bar = (page: import('@playwright/test').Page) =>
  page.locator('header [data-glass]').first();

test('the header bar is frosted glass', async ({ page }) => {
  await page.goto('/');
  const style = await bar(page).evaluate((el) => {
    const s = getComputedStyle(el);
    return { filter: s.backdropFilter, background: s.backgroundColor };
  });

  expect(style.filter).toContain('blur(14px)');
  // Translucent: the computed colour carries an alpha below 1.
  expect(style.background).toMatch(/\/ 0?\.\d+\)$/);
});

test('reduced transparency falls back to a solid bar', async ({
  page,
  browserName,
}) => {
  test.skip(browserName !== 'chromium', 'CDP media emulation');
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Emulation.setEmulatedMedia', {
    features: [{ name: 'prefers-reduced-transparency', value: 'reduce' }],
  });
  await page.goto('/');

  const style = await bar(page).evaluate((el) => {
    const s = getComputedStyle(el);
    return { filter: s.backdropFilter, background: s.backgroundColor };
  });
  const card = await page.evaluate(() => {
    const probe = document.createElement('div');
    probe.style.backgroundColor = 'var(--card)';
    document.body.append(probe);
    const value = getComputedStyle(probe).backgroundColor;
    probe.remove();
    return value;
  });

  expect(style.filter).toBe('none');
  expect(style.background).toBe(card);
});

test('the header stays in view while scrolling', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.scrollTo(0, 1200));
  await expect
    .poll(() => page.evaluate(() => window.scrollY))
    .toBeGreaterThan(600);

  const top = await bar(page).evaluate((el) => el.getBoundingClientRect().top);
  expect(top).toBeGreaterThanOrEqual(0);
  expect(top).toBeLessThan(40);
});

// A filled opacity animation on an ancestor makes it the backdrop root, and
// the blur then only sees the header itself instead of the page behind it.
test('no finished entrance animation stays applied above the glass', async ({
  page,
}) => {
  await page.goto('/');
  await waitForEntranceAnimations(page);

  const lingering = await bar(page).evaluate((el) => {
    const found: string[] = [];
    for (let node = el.parentElement; node; node = node.parentElement) {
      for (const animation of node.getAnimations()) {
        found.push(
          `${node.tagName}: ${(animation as CSSAnimation).animationName}`
        );
      }
    }
    return found;
  });

  expect(lingering).toEqual([]);
});
