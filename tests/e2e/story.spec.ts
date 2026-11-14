import type { Page } from '@playwright/test';
import { expect, test, waitForHydration } from './fixtures';

const stage = (page: Page) => page.locator('.hero-story');
const story = (page: Page) => page.locator('#story');
const diagram = (page: Page) => page.locator('.hero-story-diagram');

// Scrolls so the given story step sits at 40% of the viewport, past the line
// that marks it reached; -1 is the top of the page.
async function scrollToStep(page: Page, step: number) {
  await page.evaluate((step) => {
    if (step < 0) return window.scrollTo({ top: 0, behavior: 'instant' });
    const el = document.querySelector(`[data-story-step="${step}"]`)!;
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: top - window.innerHeight * 0.4,
      behavior: 'instant',
    });
  }, step);
}

const layerOpacity = (page: Page, at: number) =>
  diagram(page)
    .locator(`[data-at="${at}"]`)
    .evaluate((el) => Number(getComputedStyle(el).opacity));

test.describe('on a desktop with motion', () => {
  test.use({ reducedMotion: 'no-preference' });

  test.beforeEach(async ({ page }, testInfo) => {
    test.skip(
      testInfo.project.name !== 'desktop',
      'The story scrolls on wide screens with a fine pointer and motion.'
    );
    await page.goto('/');
    await waitForHydration(page);
  });

  test('keeps the hero diagram in place and walks the four steps', async ({
    page,
  }) => {
    await expect(stage(page)).toHaveAttribute('data-step', 'hero');
    const tops = [(await diagram(page).boundingBox())!.y];
    for (const step of [0, 1, 2, 3]) {
      await scrollToStep(page, step);
      await expect(stage(page)).toHaveAttribute('data-step', String(step));
      tops.push((await diagram(page).boundingBox())!.y);
    }
    // Sticky from the first screen: the drawing beside the name is the one
    // the steps light up.
    expect(Math.max(...tops) - Math.min(...tops)).toBeLessThan(2);
  });

  test('lights each layer once its step is reached, and keeps it', async ({
    page,
  }) => {
    await expect.poll(() => layerOpacity(page, 0)).toBe(0);
    await scrollToStep(page, 1);
    await expect.poll(() => layerOpacity(page, 1)).toBe(1);
    await expect.poll(() => layerOpacity(page, 0)).toBe(1);
    // The failure is not shown before its step.
    expect(await layerOpacity(page, 2)).toBe(0);
    await scrollToStep(page, 3);
    for (const at of [0, 1, 2, 3]) {
      await expect.poll(() => layerOpacity(page, at)).toBe(1);
    }
  });

  test('scrolls back the way it came', async ({ page }) => {
    await scrollToStep(page, 3);
    await expect(stage(page)).toHaveAttribute('data-step', '3');
    await scrollToStep(page, 0);
    await expect(stage(page)).toHaveAttribute('data-step', '0');
    await scrollToStep(page, -1);
    await expect(stage(page)).toHaveAttribute('data-step', 'hero');
  });
});

test.describe('everywhere else', () => {
  test('shows the finished story as a still section', async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name === 'desktop',
      'Phones and reduced motion get the still layout.'
    );
    await page.goto('/');
    await waitForHydration(page);
    await expect(stage(page)).toHaveAttribute('data-step', 'still');
    const box = (await story(page).boundingBox())!;
    const viewport = page.viewportSize()!;
    // Not a tall scroll track: about as tall as its content.
    expect(box.height).toBeLessThan(viewport.height * 2.2);
    await expect(story(page).getByRole('heading', { level: 3 })).toHaveCount(4);
    // Below sm the picture is left out; the steps carry the meaning.
    if (testInfo.project.name === 'mobile') return;
    const picture = story(page).locator('svg[data-diagram]');
    await expect(picture).toBeVisible();
    for (const at of [0, 1, 2, 3]) {
      await expect(picture.locator(`[data-at="${at}"]`)).toHaveCSS(
        'opacity',
        '1'
      );
    }
  });
});

test('reads the same in Turkish', async ({ page }, testInfo) => {
  await page.goto('/tr');
  // The longer Turkish label still starts right of the topic's lanes (x 393).
  // Phones show no drawing.
  const labelLeft =
    testInfo.project.name === 'mobile'
      ? 399
      : await page
          .locator('svg[data-diagram] [data-at="1"] text')
          .first()
          .evaluate((el) => (el as SVGTextElement).getBBox().x);
  expect(labelLeft).toBeGreaterThan(398);
  await expect(
    story(page).getByRole('heading', { level: 2 })
  ).toHaveAccessibleName('Bir şeylerin bozulacağı gün için tasarlandı.');
  await expect(
    story(page).getByRole('heading', { name: 'Hatanın bir planı var' })
  ).toBeVisible();
});
