import type { Page } from '@playwright/test';
import {
  expect,
  test,
  waitForEntranceAnimations,
  waitForHydration,
} from './fixtures';

// Scrolls so the story's track is at progress p (0 = pinned, 1 = released).
async function scrollToProgress(page: Page, p: number) {
  await page.evaluate((p) => {
    const track = document.querySelector('[data-story-scene]')!.parentElement!;
    const top = track.getBoundingClientRect().top + window.scrollY;
    const range = track.clientHeight - window.innerHeight;
    window.scrollTo({ top: top + p * range, behavior: 'instant' });
  }, p);
}

const story = (page: Page) => page.locator('#story');
const sceneVar = (page: Page, name: string) =>
  page
    .locator('[data-story-scene]')
    .evaluate((element, name) => element.style.getPropertyValue(name), name);

test.describe('on a desktop with motion', () => {
  test.use({ reducedMotion: 'no-preference' });

  test.beforeEach(async ({ page }, testInfo) => {
    test.skip(
      testInfo.project.name !== 'desktop',
      'The full story plays on wide screens with a fine pointer and motion.'
    );
    await page.goto('/');
    await waitForHydration(page);
  });

  test('pins the window and plays the acts as the page scrolls', async ({
    page,
  }) => {
    const scene = page.locator('[data-story-scene]');
    const tops: number[] = [];
    for (const [p, act] of [
      [0.1, '0'],
      [0.5, '1'],
      [0.95, '2'],
    ] as const) {
      await scrollToProgress(page, p);
      await expect(story(page)).toHaveAttribute('data-act', act);
      tops.push((await scene.boundingBox())!.y);
    }
    // Sticky: the stage stays put while the page scrolls past.
    expect(Math.max(...tops) - Math.min(...tops)).toBeLessThan(2);
    await expect(page.locator('[data-story-migrated]')).toHaveText('30');
  });

  test('turns the window to face the visitor before the terminal types', async ({
    page,
  }) => {
    await scrollToProgress(page, 0.05);
    await expect(story(page)).toHaveAttribute('data-act', '0');
    expect(parseFloat(await sceneVar(page, '--rx'))).toBeGreaterThan(40);
    await scrollToProgress(page, 0.5);
    await expect(story(page)).toHaveAttribute('data-act', '1');
    expect(await sceneVar(page, '--rx')).toBe('0deg');
    expect(Number(await sceneVar(page, '--lines'))).toBeGreaterThan(0);
  });

  test('never moves on its own and lets entrance animations settle', async ({
    page,
  }) => {
    await scrollToProgress(page, 0.5);
    await expect(story(page)).toHaveAttribute('data-act', '1');
    await waitForEntranceAnimations(page);
    const inStory = await page.evaluate(
      () =>
        document.getAnimations().filter((animation) => {
          const target = (animation.effect as KeyframeEffect).target;
          return target instanceof Element && target.closest('#story');
        }).length
    );
    expect(inStory).toBe(0);
  });

  test('does not widen the page with the camera close in', async ({ page }) => {
    await scrollToProgress(page, 0.5);
    await expect(story(page)).toHaveAttribute('data-act', '1');
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth
      )
    ).toBe(true);
  });
});

test.describe('on short laptop screens', () => {
  test.use({ reducedMotion: 'no-preference' });

  for (const viewport of [
    { width: 1280, height: 720 },
    { width: 1440, height: 680 },
    { width: 1366, height: 768 },
  ]) {
    test(`keeps the window clear of the header and the outro at ${viewport.width}×${viewport.height}`, async ({
      page,
    }, testInfo) => {
      test.skip(testInfo.project.name !== 'desktop', 'Desktop only.');
      await page.setViewportSize(viewport);
      await page.goto('/');
      await waitForHydration(page);
      const box = (selector: string) =>
        page.locator(selector).first().boundingBox();

      await scrollToProgress(page, 0.5);
      await expect(story(page)).toHaveAttribute('data-act', '1');
      const header = (await box('header'))!;
      expect((await box('.story-window'))!.y).toBeGreaterThanOrEqual(
        header.y + header.height
      );

      await scrollToProgress(page, 0.95);
      await expect(story(page)).toHaveAttribute('data-act', '2');
      const window = (await box('.story-window'))!;
      const outro = (await box('.story-outro p'))!;
      expect(window.y + window.height).toBeLessThanOrEqual(outro.y);
    });
  }

  test('is skipped below 40rem of height', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'Desktop only.');
    await page.setViewportSize({ width: 1440, height: 600 });
    await page.goto('/');
    await expect(story(page)).toBeHidden();
  });
});

test.describe('with reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('lays the finished run out as a still section', async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name === 'mobile',
      'Phones get the hero saga instead.'
    );
    await page.goto('/');
    await waitForHydration(page);
    await story(page).scrollIntoViewIfNeeded();
    const window = page.locator('.story-window');
    expect(
      await window.evaluate((element) => getComputedStyle(element).transform)
    ).toBe('none');
    expect(
      await page
        .locator('[data-story-scene]')
        .evaluate((element) => getComputedStyle(element).position)
    ).not.toBe('sticky');
    await expect(page.locator('[data-story-migrated]')).toHaveText('30');
    await expect(page.locator('.story-line').last()).toHaveCSS('opacity', '1');
    await expect(page.locator('.story-outro p')).toHaveCSS('opacity', '1');
  });
});

test('is not drawn on phones', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Covers the mobile project.');
  await page.goto('/');
  await expect(story(page)).toBeHidden();
  // The hero saga carries the idea instead.
  await expect(
    page.getByRole('figure', { name: 'An order saga' })
  ).toBeVisible();
});
