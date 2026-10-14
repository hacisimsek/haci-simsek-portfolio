import { test as base, type Page } from '@playwright/test';

export { expect } from '@playwright/test';
export type { Page } from '@playwright/test';

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

// Waits for finite animations such as the hero letter entrance. Infinite ones
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

// The palette trigger gets data-shortcut="ready" once its ⌘K listener is
// attached. React tags nodes during hydration, before effects run, so a
// hydrated trigger alone can still miss an early key press.
export async function waitForHydration(page: Page) {
  await page.waitForSelector('[aria-keyshortcuts][data-shortcut="ready"]', {
    state: 'attached',
  });
}

// On phones the language and theme controls live in the menu; open it when
// the menu button is showing so tests can reach them on every project.
export async function revealHeaderControls(page: Page) {
  const menu = page.getByRole('button', {
    name: /Toggle navigation|Menüyü aç\/kapat/,
  });
  if (await menu.isVisible()) {
    await waitForHydration(page);
    await menu.click();
  }
}
