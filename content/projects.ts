import type { FeaturedProject } from './types';

// Shown first on the home page, in this order; the rest of the grid fills
// with the most recently updated repos.
export const featuredProjects: FeaturedProject[] = [
  { name: 'ecommerce-microservices', flagship: true },
  { name: 'notifyhub' },
  { name: 'circuit-breaker-pattern' },
  { name: 'strangler-fig-pattern' },
  { name: 'bff-application' },
  { name: 'url-shortener-service' },
];
