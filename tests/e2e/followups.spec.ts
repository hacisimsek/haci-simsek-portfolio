import { expect, test } from './fixtures';

test('the below-the-fold portrait is not preloaded', async ({ page }) => {
  await page.goto('/');
  const preloads = await page
    .locator('link[rel="preload"][as="image"]')
    .evaluateAll((links) =>
      links.map(
        (link) =>
          link.getAttribute('imagesrcset') ?? link.getAttribute('href') ?? ''
      )
    );
  expect(preloads.filter((src) => /portrait/.test(src))).toEqual([]);
  await expect(page.getByRole('img', { name: 'Hacı Şimşek' })).toHaveAttribute(
    'loading',
    'lazy'
  );
});

for (const path of ['/does-not-exist', '/tr/olmayan-sayfa']) {
  test(`${path} shows the 404 status`, async ({ page }) => {
    await page.goto(path);
    await expect(page.getByText(/exit status 404/)).toBeVisible();
  });
}
