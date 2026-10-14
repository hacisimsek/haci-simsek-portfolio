import { test } from '@playwright/test';
import { waitForEntranceAnimations } from './fixtures';

// Uses the plain Playwright test (no feed stubs) and stalls the feed on
// purpose: loading skeletons keep an infinite animation running.
test('entrance-animation wait survives a stalled feed', async ({ page }) => {
  await page.route('https://api.rss2json.com/**', () => {});
  await page.goto('/articles');
  await waitForEntranceAnimations(page);
});
