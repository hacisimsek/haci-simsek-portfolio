import type { FeaturedProject, L10n } from './types';

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
    name: 'gateway-bench',
    summary: {
      en: 'The same API gateway built twice, in Rust (axum) and Java 25 (Spring Cloud Gateway on virtual threads), and load-tested on the same 2 CPUs: Rust carried 20k requests a second, Java about 4.6k.',
      tr: 'Aynı API gateway iki kez yazıldı, Rust (axum) ve Java 25 ile (sanal thread’lerde Spring Cloud Gateway), ve aynı 2 CPU üzerinde yük testi yapıldı: Rust saniyede 20 bin isteği taşıdı, Java yaklaşık 4,6 bin.',
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

// Left off the projects page: this site, a mixed collection, and early
// exercises that no longer say much about the work.
export const hiddenRepos = [
  'haci-simsek-portfolio',
  'Java-Spring',
  'SwiftAndIOSApplications',
  'LoadBalancerWithJava',
];

// The other repos' lines, each restating the README (or, where there is none,
// the GitHub description) in plain words; the GitHub text is not shown.
export const repoSummaries: Record<string, L10n> = {
  'bff-application': {
    en: 'The Backend for Frontend pattern in a Spring Boot microservices project.',
    tr: 'Spring Boot mikroservis projesinde Backend for Frontend deseni.',
  },
  'url-shortener-service': {
    en: 'A Spring Boot service that turns long URLs into short links and redirects them.',
    tr: 'Uzun URL’leri kısa bağlantılara çeviren ve yönlendiren bir Spring Boot servisi.',
  },
  'restaurant-reservation-system': {
    en: 'Table booking on Spring Boot and PostgreSQL: reservations with email confirmations, table management, an admin dashboard and Spring Security.',
    tr: 'Spring Boot ve PostgreSQL ile masa rezervasyonu: e-posta onaylı rezervasyonlar, masa yönetimi, yönetim paneli ve Spring Security.',
  },
  'springboot-microservice-app': {
    en: 'A full-stack e-commerce app on Spring Boot.',
    tr: 'Spring Boot üzerinde full-stack bir e-ticaret uygulaması.',
  },
  'task-management-app': {
    en: 'A task manager with a Spring Boot backend and a React client, run with Docker Compose.',
    tr: 'Spring Boot backend ve React arayüzlü, Docker Compose ile çalışan bir görev yöneticisi.',
  },
  'real-time-chat-app': {
    en: 'A chat on Java WebSockets with a React client.',
    tr: 'Java WebSocket üzerinde, React arayüzlü bir sohbet uygulaması.',
  },
  'timeless-talks': {
    en: 'A React chat with historical figures, answered by generative AI.',
    tr: 'Tarihî kişilerle sohbet edilen, cevapları üretken yapay zekâdan gelen bir React uygulaması.',
  },
};
