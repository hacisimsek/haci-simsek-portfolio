import type { SkillCategory } from './types';

// Product and language names stay the same in both locales; generic
// practices are translated.
export const skills: SkillCategory[] = [
  {
    id: 'languages',
    title: { en: 'Languages', tr: 'Diller' },
    items: {
      en: ['Java', 'JavaScript'],
      tr: ['Java', 'JavaScript'],
    },
  },
  {
    id: 'backend',
    title: { en: 'Backend', tr: 'Backend' },
    items: {
      en: ['Spring Boot', 'Maven', 'OSGi', 'REST APIs'],
      tr: ['Spring Boot', 'Maven', 'OSGi', 'REST API’ler'],
    },
  },
  {
    id: 'messaging-data',
    title: { en: 'Messaging and data', tr: 'Mesajlaşma ve veri' },
    items: {
      en: ['RabbitMQ', 'Kafka', 'Redis', 'PostgreSQL', 'MySQL'],
      tr: ['RabbitMQ', 'Kafka', 'Redis', 'PostgreSQL', 'MySQL'],
    },
  },
  {
    id: 'cloud-devops',
    title: { en: 'Cloud and delivery', tr: 'Bulut ve teslimat' },
    items: {
      en: ['Kubernetes', 'ArgoCD', 'Docker', 'CI/CD'],
      tr: ['Kubernetes', 'ArgoCD', 'Docker', 'CI/CD'],
    },
  },
  {
    id: 'observability',
    title: { en: 'Observability', tr: 'Gözlemlenebilirlik' },
    items: {
      en: ['Grafana', 'Prometheus', 'Load testing'],
      tr: ['Grafana', 'Prometheus', 'Yük testi'],
    },
  },
  {
    id: 'frontend',
    title: { en: 'Frontend', tr: 'Frontend' },
    items: {
      en: ['React', 'Next.js', 'SharePoint'],
      tr: ['React', 'Next.js', 'SharePoint'],
    },
  },
  {
    id: 'architecture',
    title: { en: 'Architecture', tr: 'Mimari' },
    items: {
      en: [
        'Microservices',
        'Saga pattern',
        'Circuit breaker',
        'Backend for frontend',
        'Clean architecture',
      ],
      tr: [
        'Mikroservisler',
        'Saga deseni',
        'Circuit breaker',
        'Backend for frontend (BFF)',
        'Temiz mimari',
      ],
    },
  },
];
