import type { FeaturedProject } from './types';

// Shown first on the home page, in this order. Each line restates the repo's
// README in plain words; the GitHub descriptions are not shown for these.
export const featuredProjects: FeaturedProject[] = [
  {
    name: 'ecommerce-microservices',
    flagship: true,
    summary: {
      en: 'Order, inventory, payment and shipping services kept consistent by a choreographed saga over Kafka, with a compensation for every step that can fail.',
      tr: 'Sipariş, stok, ödeme ve kargo servisleri Kafka üzerinde koreografi tabanlı bir saga ile tutarlı kalıyor; başarısız olabilecek her adımın bir telafisi var.',
    },
  },
  {
    name: 'notifyhub',
    summary: {
      en: 'Reminders fire through Kafka, delivery runs on RabbitMQ with retries and a dead-letter queue, and a React dashboard tracks every attempt.',
      tr: 'Hatırlatmalar Kafka ile tetikleniyor, teslimat RabbitMQ üzerinde yeniden deneme ve dead-letter kuyruğuyla çalışıyor, React paneli her denemeyi izliyor.',
    },
  },
  {
    name: 'strangler-fig-pattern',
    summary: {
      en: 'A legacy Spring Boot monolith moved to new code step by step, with old and new paths running side by side.',
      tr: 'Eski bir Spring Boot monoliti adım adım yeni koda taşınıyor; eski ve yeni yollar yan yana çalışıyor.',
    },
  },
  {
    name: 'circuit-breaker-pattern',
    summary: {
      en: 'A hand-written circuit breaker between an order and an inventory service.',
      tr: 'Sipariş ve stok servisleri arasında elle yazılmış bir circuit breaker.',
    },
  },
];
