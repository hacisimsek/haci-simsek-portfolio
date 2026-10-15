import { expect, test } from './fixtures';

test.describe('desktop header', () => {
  test.skip(({ isMobile }) => isMobile, 'the phone header has its own menu');

  test('has three nav links and one contact button', async ({ page }) => {
    await page.goto('/');
    const nav = page.locator('header nav').first();
    await expect(nav.getByRole('link')).toHaveText([
      'Home',
      'Projects',
      'Articles',
    ]);
    await expect(
      page.locator('header').getByRole('link', { name: 'Contact' }).first()
    ).toBeVisible();
    await expect(page.getByText("Let's Talk")).toHaveCount(0);
  });

  for (const [path, current] of [
    ['/', 'Home'],
    ['/projects', 'Projects'],
    ['/tr/articles', 'Yazılar'],
  ] as const) {
    test(`marks ${current} as the current page on ${path}`, async ({
      page,
    }) => {
      await page.goto(path);
      const marked = page
        .locator('header nav')
        .first()
        .locator('[aria-current="page"]');
      await expect(marked).toHaveCount(1);
      await expect(marked).toHaveText(current);
    });
  }
});

test('every contact call to action uses the same words', async ({ page }) => {
  await page.goto('/');
  await expect(
    page
      .locator('main')
      .getByRole('link', { name: 'Start a conversation', exact: true })
  ).toHaveCount(1);
  await expect(
    page
      .locator('footer')
      .getByRole('link', { name: 'Start a conversation', exact: true })
  ).toHaveCount(1);
});

test('the name keeps its Turkish letters', async ({ page, request }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Hacı Şimşek/);
  await expect(page.locator('footer')).toContainText('Hacı Şimşek');
  await expect(page.getByRole('img', { name: 'Hacı Şimşek' })).toHaveCount(1);
  const manifest = await (await request.get('/manifest.webmanifest')).json();
  expect(manifest.name).toBe('Hacı Şimşek');
});

test('the hero facts keep separators off line starts', async ({ page }) => {
  await page.goto('/');
  const text = await page.getByText(/^\d+\+ years of experience/).textContent();
  expect(text).toContain(' · ');
  expect(text).not.toMatch(/ ·/);
});

test('project rows fade their colour on hover', async ({ page }) => {
  await page.goto('/');
  const row = page
    .getByRole('region', { name: 'Featured projects' })
    .getByRole('link', { name: /^NotifyHub/ });
  const property = await row.evaluate(
    (el) => getComputedStyle(el).transitionProperty
  );
  expect(property).toMatch(/color|all/);
});

test.describe('on a phone', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('section links and the footer call to action are 44px tall', async ({
    page,
  }) => {
    await page.goto('/');
    for (const link of [
      page.getByRole('link', { name: 'All projects' }),
      page.getByRole('link', { name: 'All articles' }),
      page
        .locator('footer')
        .getByRole('link', { name: 'Start a conversation' }),
    ]) {
      const box = await link.boundingBox();
      expect(box!.height).toBeGreaterThanOrEqual(44);
    }
  });
});

test('keyboard focus is clearly visible on list rows and disclosures', async ({
  page,
}) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  for (const target of [
    page
      .getByRole('region', { name: 'Featured projects' })
      .getByRole('link', { name: /^NotifyHub/ }),
    page.locator('#career summary').first(),
  ]) {
    await target.focus();
    const outline = await target.evaluate((el) => {
      const style = getComputedStyle(el);
      return {
        style: style.outlineStyle,
        width: parseFloat(style.outlineWidth),
      };
    });
    expect(outline.style).toBe('solid');
    expect(outline.width).toBeGreaterThanOrEqual(2);
  }
});

for (const { path, width } of [
  { path: '/', width: 1440 },
  { path: '/tr', width: 320 },
]) {
  test(`section titles carry the saga step ring on ${path} at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto(path);
    const rings = await page
      .locator('main h2.section-title')
      .evaluateAll((titles) =>
        titles.map((title) => {
          const ring = getComputedStyle(title, '::before');
          return {
            width: parseFloat(ring.borderTopWidth),
            round: ring.borderTopLeftRadius,
            shown: ring.content !== 'none',
            // Centred on the first line: (line height - ring) / 2.
            offset: Math.abs(
              parseFloat(ring.marginTop) -
                (parseFloat(getComputedStyle(title).lineHeight) -
                  parseFloat(ring.height)) /
                  2
            ),
          };
        })
      );
    expect(rings.length).toBeGreaterThan(3);
    for (const ring of rings) {
      expect(ring.shown).toBe(true);
      expect(ring.width).toBeGreaterThanOrEqual(2);
      expect(ring.round).not.toBe('0px');
      expect(ring.offset).toBeLessThanOrEqual(1);
    }
  });
}

test.describe('phone menu', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('Escape closes it and returns focus to the button', async ({ page }) => {
    await page.goto('/');
    const toggle = page.getByRole('button', { name: 'Toggle navigation' });
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Escape');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(toggle).toBeFocused();
  });
});
