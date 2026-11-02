import type { Page } from '@playwright/test';
import { expect, test, waitForHydration } from './fixtures';

// Scrolls so the story's track is at progress p (0 = pinned, 1 = released).
async function scrollToProgress(page: Page, p: number) {
  await page.evaluate((p) => {
    const track = document.querySelector('#story')!;
    const top = track.getBoundingClientRect().top + window.scrollY;
    const range = track.clientHeight - window.innerHeight;
    window.scrollTo({ top: top + p * range, behavior: 'instant' });
  }, p);
}

const story = (page: Page) => page.locator('#story');

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

  test('pins the stage and walks the four steps as the page scrolls', async ({
    page,
  }) => {
    const panel = story(page).locator('div.font-mono[aria-hidden="true"]');
    const tops: number[] = [];
    for (const [p, step] of [
      [0.3, '0'],
      [0.45, '1'],
      [0.62, '2'],
      [0.95, '3'],
    ] as const) {
      await scrollToProgress(page, p);
      await expect(story(page)).toHaveAttribute('data-step', step);
      tops.push((await panel.boundingBox())!.y);
    }
    // Sticky: the stage stays put while the page scrolls past.
    expect(Math.max(...tops) - Math.min(...tops)).toBeLessThan(2);
  });

  test('marks the failure red and the compensation purple, never the reverse', async ({
    page,
  }) => {
    const failed = story(page).locator('[data-event="1049"]');
    await scrollToProgress(page, 0.45);
    await expect(failed).not.toHaveClass(/bg-destructive/);
    await scrollToProgress(page, 0.66);
    await expect(failed).toHaveClass(/bg-destructive/);
    await expect(story(page).getByText(/stock\.released/)).toHaveClass(
      /text-primary/
    );
  });

  test('scrolls back the way it came', async ({ page }) => {
    await scrollToProgress(page, 0.95);
    await expect(story(page)).toHaveAttribute('data-step', '3');
    await scrollToProgress(page, 0.3);
    await expect(story(page)).toHaveAttribute('data-step', '0');
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
    await expect(story(page)).toHaveAttribute('data-step', 'still');
    const box = (await story(page).boundingBox())!;
    const viewport = page.viewportSize()!;
    // Not a tall scroll track: about as tall as its content.
    expect(box.height).toBeLessThan(viewport.height * 2.2);
    await expect(story(page).getByRole('heading', { level: 3 })).toHaveCount(4);
  });
});

test('reads the same in Turkish', async ({ page }) => {
  await page.goto('/tr');
  await expect(
    story(page).getByRole('heading', { level: 2 })
  ).toHaveAccessibleName('Bir şeylerin bozulacağı gün için tasarlandı.');
  await expect(
    story(page).getByRole('heading', { name: 'Hatanın bir planı var' })
  ).toBeVisible();
});
