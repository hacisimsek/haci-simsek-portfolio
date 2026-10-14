import { test as base, type Page } from '@playwright/test';

// Fixed responses for the two third-party feeds the pages fetch in the
// browser, so e2e runs never depend on GitHub rate limits or rss2json.
const githubRepos = [
  {
    name: 'ecommerce-microservices',
    description:
      'Spring Boot microservices with an orchestration-based Saga Pattern.',
    html_url: 'https://github.com/hacisimsek/ecommerce-microservices',
    updated_at: '2026-10-01T10:00:00Z',
    language: 'Java',
  },
  {
    name: 'notifyhub',
    description: 'Smart reminder and notification platform.',
    html_url: 'https://github.com/hacisimsek/notifyhub',
    updated_at: '2026-10-12T10:00:00Z',
    language: 'Java',
  },
];

const mediumFeed = {
  status: 'ok',
  items: [
    {
      title: 'Understanding Circuit Breaker Pattern in Microservices',
      description: '<p>How circuit breakers keep failures contained.</p>',
      guid: 'https://medium.com/@hacisimsek/circuit-breaker',
      categories: ['microservices', 'resilience'],
      content: '<p>Body</p>',
    },
  ],
};

export async function stubExternalFeeds(page: Page) {
  await page.route('https://api.github.com/users/hacisimsek/repos', (route) =>
    route.fulfill({ json: githubRepos })
  );
  await page.route('https://api.rss2json.com/**', (route) =>
    route.fulfill({ json: mediumFeed })
  );
}

// Waits for finite animations such as the .fade-up entrance. Infinite ones
// (animate-pulse loading skeletons) never finish and are ignored.
export async function waitForEntranceAnimations(page: Page) {
  await page.waitForFunction(() =>
    document
      .getAnimations()
      .every(
        (a) =>
          a.playState !== 'running' ||
          a.effect?.getTiming().iterations === Infinity
      )
  );
}

export const test = base.extend<{ externalFeeds: void }>({
  externalFeeds: [
    async ({ page }, use) => {
      await stubExternalFeeds(page);
      await use();
    },
    { auto: true },
  ],
});

export { expect } from '@playwright/test';
