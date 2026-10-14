import { expect, test } from './fixtures';

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
    await expect(page.locator('meta[name="theme-color"]')).toHaveCount(2);
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
  expect((await manifest.json()).name).toBe('Haci Simsek');
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
