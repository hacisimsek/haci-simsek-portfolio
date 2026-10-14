import type { SkillCategory } from './types';

export const skills: SkillCategory[] = [
  {
    id: 'languages',
    title: { en: 'Languages' },
    items: ['Java', 'JavaScript'],
  },
  {
    id: 'backend',
    title: { en: 'Backend' },
    items: ['Spring Boot', 'Maven', 'OSGi', 'REST APIs'],
  },
  {
    id: 'messaging-data',
    title: { en: 'Messaging and data' },
    items: ['RabbitMQ', 'Kafka', 'Redis', 'PostgreSQL', 'MySQL'],
  },
  {
    id: 'cloud-devops',
    title: { en: 'Cloud and delivery' },
    items: ['Kubernetes', 'ArgoCD', 'Docker', 'CI/CD'],
  },
  {
    id: 'observability',
    title: { en: 'Observability' },
    items: ['Grafana', 'Prometheus', 'Load testing'],
  },
  {
    id: 'frontend',
    title: { en: 'Frontend' },
    items: ['React', 'Next.js', 'SharePoint'],
  },
  {
    id: 'architecture',
    title: { en: 'Architecture' },
    items: [
      'Microservices',
      'Saga pattern',
      'Circuit breaker',
      'Backend for frontend',
      'Clean architecture',
    ],
  },
];
