import AxeBuilder from '@axe-core/playwright';
import { expect, test, waitForHydration, type Page } from './fixtures';

async function openFromPalette(page: Page) {
  await waitForHydration(page);
  await page.keyboard.press('Control+k');
  await expect(page.getByRole('combobox')).toBeFocused();
  await page.keyboard.type('terminal');
  await page.keyboard.press('Enter');
  const input = page.getByRole('textbox', { name: /Command|Komut/ });
  await expect(input).toBeFocused();
  return input;
}

test('opens from the palette and answers whoami', async ({ page }) => {
  await page.goto('/');
  const input = await openFromPalette(page);
  await input.fill('whoami');
  await input.press('Enter');
  await expect(page.getByRole('log')).toContainText('Hacı Şimşek');
});

test('switches to Turkish and keeps working there', async ({ page }) => {
  // Two palette round trips and a locale navigation: slow on a busy runner.
  test.slow();
  await page.goto('/');
  const input = await openFromPalette(page);
  await input.fill('lang tr');
  await input.press('Enter');
  await expect(page).toHaveURL(/\/tr$/, { timeout: 10_000 });
  await expect(page.getByRole('dialog', { name: 'Terminal' })).toBeHidden();

  const turkish = await openFromPalette(page);
  await turkish.fill('help');
  await turkish.press('Enter');
  await expect(page.getByRole('log')).toContainText('Kullanılabilir komutlar');
});

test('sudo hire-me goes to the contact page', async ({ page }) => {
  await page.goto('/projects');
  const input = await openFromPalette(page);
  await input.fill('sudo hire-me');
  await input.press('Enter');
  await expect(page).toHaveURL(/\/contact$/);
  await expect(page.getByRole('dialog', { name: 'Terminal' })).toBeHidden();
});

test('the 404 page speaks terminal and opens the real one', async ({
  page,
}) => {
  const response = await page.goto('/does-not-exist');
  expect(response?.status()).toBe(404);
  await expect(page.getByText('cd /does-not-exist')).toBeVisible();
  await expect(page.getByText(/No such file or directory/)).toBeVisible();
  await waitForHydration(page);
  await page.getByRole('button', { name: 'Open terminal' }).click();
  await expect(page.getByRole('textbox', { name: 'Command' })).toBeFocused();
});

for (const theme of ['dark', 'light'] as const) {
  test(`the open terminal (${theme}) has no accessibility violations`, async ({
    page,
  }) => {
    await page.addInitScript((value) => {
      localStorage.setItem('theme', value);
    }, theme);
    await page.goto('/');
    const input = await openFromPalette(page);
    await input.fill('contact');
    await input.press('Enter');
    const { violations } = await new AxeBuilder({ page })
      .include('[role="dialog"]')
      .analyze();
    expect(violations.map((v) => `${v.id}: ${v.nodes.length}`)).toEqual([]);
  });
}
