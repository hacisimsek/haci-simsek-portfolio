import { expect, test } from './fixtures';

test('home shows the restored career and the skills section', async ({
  page,
}) => {
  await page.goto('/');
  await expect(
    page.getByRole('heading', {
      name: 'Software Development Senior Specialist',
    })
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Project Manager' })
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Tools I use to ship and run systems' })
  ).toBeVisible();
  await expect(
    page.getByText('Full scholarship', { exact: true })
  ).toBeVisible();
});
