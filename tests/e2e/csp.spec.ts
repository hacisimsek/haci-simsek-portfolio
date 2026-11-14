import { expect, test } from './fixtures';

// The policy must not block anything the site itself loads.
for (const path of [
  '/',
  '/projects',
  '/articles',
  '/radar',
  '/contact',
  '/tr',
]) {
  test(`${path} loads with nothing blocked by the CSP`, async ({ page }) => {
    const blocked: string[] = [];
    page.on('console', (message) => {
      if (/Content Security Policy/i.test(message.text())) {
        blocked.push(message.text());
      }
    });
    const response = await page.goto(path);
    expect(response?.headers()['content-security-policy']).toContain(
      "frame-ancestors 'none'"
    );
    await page.waitForLoadState('load');
    // Scroll so lazy images load too.
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1500);
    expect(blocked).toEqual([]);
  });
}
