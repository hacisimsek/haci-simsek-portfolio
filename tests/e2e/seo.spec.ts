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
