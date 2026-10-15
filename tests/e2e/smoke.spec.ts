import { expect, test } from './fixtures';

const pages = [
  { path: '/', heading: /Software engineer building backend/ },
  { path: '/projects', heading: /Selected builds/ },
  { path: '/articles', heading: /Writing where implementation detail/ },
  { path: '/contact', heading: /^Let.s talk$/ },
];

for (const { path, heading } of pages) {
  test(`${path} responds 200 and renders its heading`, async ({ page }) => {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(
      page.getByRole('heading', { level: 1, name: heading })
    ).toBeVisible();
  });
}

test('unknown routes return 404', async ({ page }) => {
  const response = await page.goto('/this-page-does-not-exist');
  expect(response?.status()).toBe(404);
});

test('projects and articles render the feeds from the fixture server', async ({
  page,
}) => {
  await page.goto('/projects');
  // The fixture keeps 3 of its 8 repos; the live API returns many more.
  await expect(page.locator('main a[target="_blank"]')).toHaveCount(3);
  await expect(
    page.getByRole('heading', { name: 'NotifyHub', exact: true })
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'forked-lib', exact: true })
  ).toHaveCount(0);

  await page.goto('/articles');
  await expect(page.locator('main a[target="_blank"]')).toHaveCount(3);
  const saga = page.getByRole('link', { name: /What is the Saga Pattern\?/ });
  await expect(saga).toHaveAttribute(
    'href',
    'https://medium.com/@hacisimsek/what-is-the-saga-pattern-aaea405280dc'
  );
});

test('the Turkish home page is served under /tr', async ({ page }) => {
  const response = await page.goto('/tr');
  expect(response?.status()).toBe(200);
  await expect(page.locator('html')).toHaveAttribute('lang', 'tr');
});
