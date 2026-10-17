import AxeBuilder from '@axe-core/playwright';
import {
  expect,
  test,
  waitForEntranceAnimations,
  waitForHydration,
  type Page,
} from './fixtures';

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
    // Measure the settled dialog, not a frame of its fade-in.
    await waitForEntranceAnimations(page);
    const { violations } = await new AxeBuilder({ page })
      .include('[role="dialog"]')
      .analyze();
    expect(violations.map((v) => `${v.id}: ${v.nodes.length}`)).toEqual([]);
  });
}

test('after navigating, focus starts at the new page content', async ({
  page,
}) => {
  await page.goto('/projects');
  const input = await openFromPalette(page);
  await input.fill('sudo hire-me');
  await input.press('Enter');
  await expect(page).toHaveURL(/\/contact$/);
  await expect(page.locator('main')).toBeFocused();
});

for (const { width, minSize, maxSize } of [
  { width: 390, minSize: 16, maxSize: 99 },
  { width: 1280, minSize: 0, maxSize: 15 },
]) {
  test(`inputs are ${width < 640 ? 'at least 16px on phones' : 'compact on desktop'}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto('/');
    const input = await openFromPalette(page);
    const size = (locator: typeof input) =>
      locator.evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
    expect(await size(input)).toBeGreaterThanOrEqual(minSize);
    expect(await size(input)).toBeLessThanOrEqual(maxSize);
    await page.keyboard.press('Escape');
    await waitForHydration(page);
    await page.keyboard.press('Control+k');
    const combobox = page.getByRole('combobox');
    expect(await size(combobox)).toBeGreaterThanOrEqual(minSize);
    expect(await size(combobox)).toBeLessThanOrEqual(maxSize);
  });
}
