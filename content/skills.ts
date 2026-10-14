import type { SkillCategory } from './types';

export const skills: SkillCategory[] = [
  {
    id: 'languages',
    title: { en: 'Languages', tr: 'Diller' },
    items: ['Java', 'JavaScript'],
  },
  {
    id: 'backend',
    title: { en: 'Backend', tr: 'Backend' },
    items: ['Spring Boot', 'Maven', 'OSGi', 'REST APIs'],
  },
  {
    id: 'messaging-data',
    title: { en: 'Messaging and data', tr: 'Mesajlaşma ve veri' },
    items: ['RabbitMQ', 'Kafka', 'Redis', 'PostgreSQL', 'MySQL'],
  },
  {
    id: 'cloud-devops',
    title: { en: 'Cloud and delivery', tr: 'Bulut ve teslimat' },
    items: ['Kubernetes', 'ArgoCD', 'Docker', 'CI/CD'],
  },
  {
    id: 'observability',
    title: { en: 'Observability', tr: 'Gözlemlenebilirlik' },
    items: ['Grafana', 'Prometheus', 'Load testing'],
  },
  {
    id: 'frontend',
    title: { en: 'Frontend', tr: 'Frontend' },
    items: ['React', 'Next.js', 'SharePoint'],
  },
  {
    id: 'architecture',
    title: { en: 'Architecture', tr: 'Mimari' },
    items: [
      'Microservices',
      'Saga pattern',
      'Circuit breaker',
      'Backend for frontend',
      'Clean architecture',
    ],
  },
];
