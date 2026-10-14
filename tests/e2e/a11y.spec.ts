import AxeBuilder from '@axe-core/playwright';
import { expect, test, waitForEntranceAnimations } from './fixtures';

const paths = ['/', '/projects', '/articles', '/contact', '/tr', '/tr/contact'];

for (const theme of ['dark', 'light'] as const) {
  for (const path of paths) {
    test(`${path} (${theme}) has no accessibility violations`, async ({
      page,
    }) => {
      await page.addInitScript((value) => {
        localStorage.setItem('theme', value);
      }, theme);
      await page.goto(path);
      await waitForEntranceAnimations(page);

      const { violations } = await new AxeBuilder({ page }).analyze();
      const found = violations.flatMap((v) =>
        v.nodes.map((node) => `${v.id} (${v.impact}): ${node.target.join(' ')}`)
      );

      expect(found).toEqual([]);
    });
  }
}

for (const theme of ['dark', 'light'] as const) {
  test(`the open command palette (${theme}) has no accessibility violations`, async ({
    page,
  }) => {
    await page.addInitScript((value) => {
      localStorage.setItem('theme', value);
    }, theme);
    await page.goto('/');
    await page.getByRole('button', { name: /Command palette/ }).click();
    await expect(page.getByRole('combobox')).toBeFocused();
    await page.getByRole('option', { name: 'Projects' }).hover();

    const { violations } = await new AxeBuilder({ page })
      .include('[role="dialog"]')
      .analyze();
    const found = violations.flatMap((v) =>
      v.nodes.map((node) => `${v.id} (${v.impact}): ${node.target.join(' ')}`)
    );

    expect(found).toEqual([]);
  });
}
