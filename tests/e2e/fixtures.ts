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

// React tags DOM nodes it has hydrated with internal keys; once the palette
// trigger carries one, global listeners such as the ⌘K shortcut are attached.
export async function waitForHydration(page: Page) {
  await page.waitForFunction(() => {
    const trigger = document.querySelector('[aria-keyshortcuts]');
    return (
      !!trigger && Object.keys(trigger).some((key) => key.startsWith('__react'))
    );
  });
}
