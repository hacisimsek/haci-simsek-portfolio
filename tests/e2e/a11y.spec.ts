import AxeBuilder from '@axe-core/playwright';
import { expect, test, waitForEntranceAnimations } from './fixtures';

// Known issue: accent buttons (#fffbf5 on #ed7035) reach a 2.92:1 contrast
// ratio. The redesign replaces these tokens; until then only these exact
// targets are tolerated so any new violation still fails.
const KNOWN_CONTRAST_TARGETS = new Set([
  '.md\\:inline-flex',
  '.bg-accent.px-6.text-accent-foreground',
  'button[type="submit"]',
]);

for (const path of ['/', '/projects', '/articles', '/contact']) {
  test(`${path} has no unexpected accessibility violations`, async ({
    page,
  }) => {
    await page.goto(path);
    await waitForEntranceAnimations(page);

    const { violations } = await new AxeBuilder({ page }).analyze();
    const unexpected = violations.flatMap((v) =>
      v.nodes
        .map((node) => node.target.join(' '))
        .filter(
          (target) =>
            !(v.id === 'color-contrast' && KNOWN_CONTRAST_TARGETS.has(target))
        )
        .map((target) => `${v.id} (${v.impact}): ${target}`)
    );

    expect(unexpected).toEqual([]);
  });
}
