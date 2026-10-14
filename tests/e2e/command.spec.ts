import { expect, test, waitForHydration } from './fixtures';

// The handler accepts both modifiers; Control is deterministic on every OS.
const shortcut = 'Control+k';

test.describe('command palette', () => {
  test('navigates to a page from the keyboard', async ({ page }) => {
    await page.goto('/');
    await waitForHydration(page);
    await page.keyboard.press(shortcut);
    const dialog = page.getByRole('dialog', { name: 'Command palette' });
    await expect(dialog).toBeVisible();
    await expect(page.getByRole('combobox')).toBeFocused();

    await page.keyboard.type('projects');
    await page.keyboard.press('Enter');

    await expect(page).toHaveURL(/\/projects$/);
    await expect(dialog).toBeHidden();
  });

  test('switches to English from the Turkish site', async ({ page }) => {
    await page.goto('/tr');
    await page.getByRole('button', { name: /Komut paleti/ }).click();
    await page.getByRole('option', { name: 'English' }).click();

    await expect(page).toHaveURL(/:\d+\/$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });

  test('switches to the light theme', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /Command palette/ }).click();
    await page.getByRole('option', { name: 'Light theme' }).click();

    await expect(page.locator('html')).toHaveClass(/light/);
  });
});
