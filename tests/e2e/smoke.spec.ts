import { expect, test } from './fixtures';

const pages = [
  { path: '/', heading: /Software engineer building backend/ },
  { path: '/projects', heading: /Selected builds/ },
  { path: '/articles', heading: /Writing where implementation detail/ },
  { path: '/contact', heading: /Let.s talk about architecture/ },
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

test('projects and articles render the stubbed feeds', async ({ page }) => {
  await page.goto('/projects');
  await expect(page.getByText('ecommerce-microservices')).toBeVisible();

  await page.goto('/articles');
  await expect(
    page.getByText('Understanding Circuit Breaker Pattern in Microservices')
  ).toBeVisible();
});
