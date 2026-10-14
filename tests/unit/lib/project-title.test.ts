import { describe, expect, it } from 'vitest';
import { projectTitle } from '@/lib/project-title';

describe('projectTitle', () => {
  it.each([
    ['ecommerce-microservices', 'E-commerce microservices'],
    ['notifyhub', 'NotifyHub'],
    ['bff-application', 'BFF application'],
    ['url-shortener-service', 'URL shortener service'],
    ['circuit-breaker-pattern', 'Circuit breaker pattern'],
    ['foo_bar-baz', 'Foo bar baz'],
  ])('turns %s into "%s"', (slug, title) => {
    expect(projectTitle(slug)).toBe(title);
  });
});
