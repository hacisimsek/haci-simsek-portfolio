import { expect, revealHeaderControls, test } from './fixtures';

for (const { path, ogLocale } of [
  { path: '/', ogLocale: 'en_US' },
  { path: '/tr', ogLocale: 'tr_TR' },
]) {
  test(`${path} carries structured data and social metadata`, async ({
    page,
  }) => {
    await page.goto(path);
    const scripts = page.locator('script[type="application/ld+json"]');
    await expect(scripts).toHaveCount(1);
    const data = JSON.parse((await scripts.textContent()) ?? '{}');
    const types = data['@graph'].map(
      (node: { '@type': string }) => node['@type']
    );
    expect(types).toEqual(['Person', 'WebSite']);

    const meta = (selector: string) =>
      page.locator(selector).getAttribute('content');
    expect(await meta('meta[property="og:locale"]')).toBe(ogLocale);
    expect(await meta('meta[property="og:title"]')).toBeTruthy();
    expect(await meta('meta[property="og:description"]')).toBeTruthy();
    expect(await meta('meta[name="twitter:card"]')).toBe('summary_large_image');
  });
}

test('crawl files are served at the site root', async ({ request }) => {
  const sitemap = await request.get('/sitemap.xml');
  expect(sitemap.status()).toBe(200);
  expect(sitemap.headers()['content-type']).toContain('xml');
  const xml = await sitemap.text();
  expect(xml.match(/<loc>/g)).toHaveLength(8);
  expect(xml).toContain('hreflang="tr"');

  const robots = await request.get('/robots.txt');
  expect(await robots.text()).toContain(
    'Sitemap: https://hacisimsek.com/sitemap.xml'
  );

  const manifest = await request.get('/manifest.webmanifest');
  expect((await manifest.json()).name).toBe('Hacı Şimşek');
});

test('generated icons are linked and served without a redirect', async ({
  page,
  request,
}) => {
  await page.goto('/tr');
  for (const rel of ['icon', 'apple-touch-icon']) {
    const href = await page.locator(`link[rel="${rel}"]`).getAttribute('href');
    const response = await request.get(href!, { maxRedirects: 0 });
    expect(response.status(), href!).toBe(200);
    expect(response.headers()['content-type']).toBe('image/png');
  }
});

test('each language has its own Open Graph image, served without a redirect', async ({
  page,
  request,
}) => {
  const urls: string[] = [];
  for (const path of ['/', '/tr']) {
    await page.goto(path);
    const image = await page
      .locator('meta[property="og:image"]')
      .getAttribute('content');
    expect(image, path).toMatch(/^https:\/\/hacisimsek\.com\//);
    await expect(
      page.locator('meta[property="og:image:width"]')
    ).toHaveAttribute('content', '1200');
    await expect(
      page.locator('meta[property="og:image:height"]')
    ).toHaveAttribute('content', '630');
    await expect(page.locator('meta[name="twitter:image"]')).toHaveCount(1);

    const local = new URL(image!).pathname + new URL(image!).search;
    const response = await request.get(local, { maxRedirects: 0 });
    expect(response.status(), local).toBe(200);
    expect(response.headers()['content-type']).toBe('image/png');
    urls.push(local);
  }
  expect(urls[0]).not.toBe(urls[1]);
});

test('pages and metadata files carry the security headers', async ({
  request,
}) => {
  for (const path of ['/', '/tr/contact', '/sitemap.xml']) {
    const headers = (await request.get(path)).headers();
    expect(headers['x-content-type-options'], path).toBe('nosniff');
    expect(headers['referrer-policy'], path).toBe(
      'strict-origin-when-cross-origin'
    );
    expect(headers['x-frame-options'], path).toBe('DENY');
    expect(headers['permissions-policy'], path).toContain('camera=()');
  }
});

test('analytics stay off outside Vercel', async ({ page }) => {
  const insights: string[] = [];
  page.on('request', (request) => {
    if (request.url().includes('/_vercel/')) insights.push(request.url());
  });
  await page.goto('/');
  await page.waitForTimeout(1500);
  expect(insights).toEqual([]);
});

for (const { path, title } of [
  { path: '/projects', title: /Projects/ },
  { path: '/tr/contact', title: /İletişim/ },
]) {
  test(`${path} shares its own URL and title`, async ({ page }) => {
    await page.goto(path);
    const content = (selector: string) =>
      page.locator(selector).getAttribute('content');
    expect(await content('meta[property="og:url"]')).toBe(
      `https://hacisimsek.com${path}`
    );
    expect(await content('meta[property="og:title"]')).toMatch(title);
    expect(await content('meta[name="twitter:title"]')).toMatch(title);
    expect(await content('meta[property="og:image"]')).toContain(
      'opengraph-image'
    );
  });
}

test('the browser chrome colour follows the site theme, not the OS', async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/');
  const themeColor = page.locator('meta[name="theme-color"]');
  await expect(themeColor).toHaveCount(1);
  // The site defaults to dark even on a light OS.
  await expect(themeColor).toHaveAttribute('content', '#05070f');
  await revealHeaderControls(page);
  await page.getByRole('button', { name: 'Toggle theme' }).click();
  await expect(themeColor).toHaveAttribute('content', '#f9fafd');
});

test('legacy /favicon.ico serves the generated icon', async ({ request }) => {
  const response = await request.get('/favicon.ico', { maxRedirects: 0 });
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toBe('image/png');
});

test('Open Graph images exist only for real locales', async ({ request }) => {
  const response = await request.get('/xx/opengraph-image/card');
  expect(response.status()).toBe(404);
});

test('cards credit the X account', async ({ page }) => {
  for (const path of ['/', '/projects']) {
    await page.goto(path);
    await expect(page.locator('meta[name="twitter:creator"]')).toHaveAttribute(
      'content',
      '@CodeWithHaci'
    );
  }
});

test('analytics code is not shipped outside Vercel', async ({
  page,
  request,
}) => {
  await page.goto('/');
  const sources = await page
    .locator('script[src]')
    .evaluateAll((scripts) =>
      scripts.map((script) => (script as HTMLScriptElement).src)
    );
  for (const src of sources) {
    const body = await (await request.get(src)).text();
    expect(body, src).not.toContain('/_vercel/insights');
  }
});

test('Open Graph image alt text follows the language', async ({ page }) => {
  const alts: string[] = [];
  for (const path of ['/', '/tr', '/tr/projects']) {
    await page.goto(path);
    alts.push(
      (await page
        .locator('meta[property="og:image:alt"]')
        .getAttribute('content')) ?? ''
    );
  }
  expect(alts[0]).toContain('Software Development Senior Specialist');
  expect(alts[1]).toContain('Kıdemli Yazılım Geliştirme Uzmanı');
  expect(alts[2]).toBe(alts[1]);
});
