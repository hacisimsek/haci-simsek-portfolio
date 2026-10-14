import { test as base, type Page } from '@playwright/test';

export { expect } from '@playwright/test';

// The WebGL sphere renders on the CPU in CI (no GPU), which slows every other
// test. Pages report a 2-core device (tier "low", CSS orb only) unless a spec
// opts in with test.use({ sphere: true }), which reports 8 cores.
export const test = base.extend<{ sphere: boolean }>({
  sphere: [false, { option: true }],
  page: async ({ page, sphere }, provide) => {
    await page.addInitScript(
      (cores) => {
        Object.defineProperty(navigator, 'hardwareConcurrency', {
          get: () => cores,
        });
      },
      sphere ? 8 : 2
    );
    await provide(page);
  },
});

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
