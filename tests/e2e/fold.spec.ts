import { expect, test } from './fixtures';

// Phones see the lead skills and the first career bullets; one button per
// section opens the rest. Wider screens see everything and no button.
test('skills fold on phones and open with one button', async ({ page }) => {
  await page.goto('/');
  const skills = page.locator('#skills');
  const extra = skills.getByText('Spring Security', { exact: true });
  const button = skills.getByRole('button', { name: /^Show \d+ more$/ });

  if ((page.viewportSize()?.width ?? 0) >= 768) {
    await expect(extra).toBeVisible();
    await expect(button).toBeHidden();
    return;
  }

  await expect(extra).toBeHidden();
  await button.click();
  await expect(extra).toBeVisible();
  await expect(
    skills.getByRole('button', { name: 'Show less' })
  ).toHaveAttribute('aria-expanded', 'true');
});

test('about keeps its first paragraph on phones and folds the rest', async ({
  page,
}) => {
  await page.goto('/');
  const about = page.locator('#about');
  const later = about.getByText(/Bahçeşehir University/);
  const button = about.getByRole('button', { name: 'Read more' });

  if ((page.viewportSize()?.width ?? 0) >= 768) {
    await expect(later).toBeVisible();
    await expect(button).toBeHidden();
    return;
  }

  await expect(about.getByText(/Spring Boot microservices/)).toBeVisible();
  await expect(later).toBeHidden();
  await button.click();
  await expect(later).toBeVisible();
});
