import type { Page } from '@playwright/test';

export { expect, test } from '@playwright/test';

// Waits for finite animations such as the .fade-up entrance. Infinite ones
// (e.g. animate-pulse) never finish and are ignored.
export async function waitForEntranceAnimations(page: Page) {
  await page.waitForFunction(() =>
    document
      .getAnimations()
      .every(
        (a) =>
          a.playState !== 'running' ||
          a.effect?.getTiming().iterations === Infinity
      )
  );
}
