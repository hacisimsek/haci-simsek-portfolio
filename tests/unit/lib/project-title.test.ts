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
    ['CircuitBreakerAppWithSpringBoot', 'Circuit Breaker App With Spring Boot'],
    ['JavaStreamApi', 'Java Stream API'],
    ['SwiftAndIOSApplications', 'Swift And iOS Applications'],
    ['100DaysOfJava', '100 Days Of Java'],
    ['movieApp', 'Movie App'],
    ['bdd', 'BDD'],
    ['we-are-sisal', 'We are Sisal'],
    ['api-gateway-pattern', 'API gateway pattern'],
    ['springboot-microservice-app', 'Spring Boot microservice app'],
  ])('turns %s into "%s"', (slug, title) => {
    expect(projectTitle(slug)).toBe(title);
  });

  it('falls back to the slug when there is nothing to title', () => {
    expect(projectTitle('')).toBe('');
    expect(projectTitle('--')).toBe('--');
  });
});
