import AxeBuilder from '@axe-core/playwright';
import { expect, test, waitForHydration } from './fixtures';

const message = 'We need help moving our checkout to services.';

test('sends a message from the keyboard', async ({ page }) => {
  let body = '';
  await page.route('https://formspree.io/**', async (route) => {
    body = route.request().postData() ?? '';
    await route.fulfill({ status: 200, json: { ok: true } });
  });
  await page.goto('/contact');
  await waitForHydration(page);

  await page.getByLabel('Name').fill('Ada');
  await page.getByLabel('Email').fill('ada@example.com');
  await page.getByLabel('Message').fill(message);
  await page.getByLabel('Email').press('Enter');

  await expect(page.getByRole('status', { name: /Thanks/ })).toBeFocused();
  expect(JSON.parse(body)).toEqual({
    topic: 'role',
    name: 'Ada',
    email: 'ada@example.com',
    message,
  });
});

test('shows a retry message when Formspree fails', async ({ page }) => {
  await page.route('https://formspree.io/**', (route) =>
    route.fulfill({ status: 500, body: '' })
  );
  await page.goto('/tr/contact');
  await waitForHydration(page);

  await page.getByLabel('Ad').fill('Ada');
  await page.getByLabel('E-posta').fill('ada@example.com');
  await page.getByLabel('Mesaj').fill(message);
  await page.getByRole('button', { name: 'Mesajı gönder' }).click();

  // Next renders its own route announcer with role="alert" outside main.
  await expect(page.locator('form').getByRole('alert')).toContainText(
    'gönderilemedi'
  );
});

test('the error state has no accessibility violations', async ({ page }) => {
  await page.goto('/contact');
  await waitForHydration(page);
  await page.getByRole('button', { name: 'Send Message' }).click();
  await expect(page.getByLabel('Name')).toHaveAttribute('aria-invalid', 'true');

  const { violations } = await new AxeBuilder({ page })
    .include('form')
    .analyze();
  expect(violations.map((v) => v.id)).toEqual([]);
});

test('the contact page speaks to roles and technical conversations', async ({
  page,
}) => {
  await page.goto('/contact');
  const main = page.locator('main');
  await expect(
    main.getByRole('heading', { level: 2, name: 'About a role' })
  ).toBeVisible();
  await expect(
    main.getByRole('heading', { level: 2, name: 'A technical conversation' })
  ).toBeVisible();
  await expect(main).toContainText('not actively looking');
  await expect(main).not.toContainText('create the most value');
});

test('the contact page leads with the email and has no closing band', async ({
  page,
}) => {
  await page.goto('/contact');
  await expect(
    page.locator('main').getByRole('heading', { level: 2 }).first()
  ).toHaveText('Direct email');
  await expect(
    page.getByRole('heading', { name: 'Open to the right conversation' })
  ).toHaveCount(0);
});

test('the Turkish contact page has no closing band either', async ({
  page,
}) => {
  await page.goto('/tr/contact');
  await expect(
    page.getByRole('heading', { name: 'Doğru tekliflere açığım' })
  ).toHaveCount(0);
});
