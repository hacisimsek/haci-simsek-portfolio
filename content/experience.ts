import type { Role } from './types';

export const experience: Role[] = [
  {
    id: 'sisal-senior-specialist',
    company: 'Sisal',
    title: { en: 'Software Development Senior Specialist' },
    team: { en: 'AreaPrivata' },
    kind: 'employment',
    focus: { en: 'Backend and platform engineering' },
    start: '2025-01',
    end: null,
    summary: {
      en: 'Building Spring Boot microservices and production-ready backend flows in a regulated digital gaming and payments environment.',
    },
    highlights: {
      en: [
        'Build backend microservices in the **AreaPrivata** ecosystem with **Java 11**, **Spring Boot** and **Maven**, across authentication, account, session, profile and content domains.',
        'Designed and optimized core services for registration, profile management and gateway communication.',
        'Built resilient integrations with asynchronous messaging over **RabbitMQ**, retry strategies and caching with **Redis Sentinel**.',
        'Led the migration of the infrastructure to a new API-driven model, defining standards and best practices for consistency across services.',
        'Work with DevOps on deployment and monitoring with **Kubernetes** and **ArgoCD**, plus observability, load testing and performance tuning.',
      ],
    },
  },
  {
    id: 'sisal-software-engineer',
    company: 'Sisal',
    title: { en: 'Software Engineer' },
    team: { en: 'Lottery and Terminals' },
    kind: 'employment',
    focus: { en: 'Full-stack and authentication' },
    start: '2022-06',
    end: '2025-01',
    summary: {
      en: 'Built authentication infrastructure and end-to-end applications for the lottery and gaming platform.',
    },
    highlights: {
      en: [
        'Designed and implemented the **Orion** module, a new authentication infrastructure integrated with the full-stack application, using **React.js**, **Java** and **OSGi** for scalability, security and compatibility.',
        'Member of the Lottery and Terminals team, developing applications end to end with **React.js** and **OSGi**.',
        'Collaborated on global projects, joining international meetings and business trips that fed into strategic decisions.',
      ],
    },
  },
  {
    id: 'nuevo-software-engineer',
    company: 'Nuevo Software House',
    title: { en: 'Software Engineer' },
    kind: 'employment',
    focus: { en: 'Enterprise web applications' },
    start: '2021-09',
    end: '2022-06',
    summary: {
      en: 'Delivered end-to-end web applications for enterprise clients across multiple industries.',
    },
    highlights: {
      en: [
        'Built business-facing applications with **React.js** and **SharePoint** for clients including **Türk Petrol**, **AvivaSA**, **Kordsa** and **Tavuk Dünyası**.',
        'Balanced maintainability, user experience and client-specific workflows across enterprise implementations.',
        'Supported the design, implementation and release of tailored solutions with product and delivery teams.',
      ],
    },
  },
  {
    id: 'telenity-intern',
    company: 'Telenity',
    title: { en: 'Software Engineer Intern' },
    kind: 'internship',
    focus: { en: 'Telecom backend' },
    start: '2021-06',
    end: '2021-08',
    summary: {
      en: 'Started in telecom-focused backend development and messaging systems.',
    },
    highlights: {
      en: [
        'Contributed to VAS and messaging features with **Java** and **Spring Boot**.',
        "Supported the company's work on **5G** technologies.",
        'Learned how scalable backend services behave in a demanding telecommunications environment.',
      ],
    },
  },
  {
    id: 'bau-ai-society',
    company: 'Bahçeşehir University AI Society',
    title: { en: 'Project Manager' },
    kind: 'leadership',
    focus: { en: 'Community and events' },
    start: '2019-09',
    end: '2020-06',
    summary: {
      en: 'Organized AI-focused seminars, workshops and networking events for students and professionals.',
    },
    highlights: {
      en: [
        'Promoted **artificial intelligence** through educational initiatives that raised engagement in the academic community.',
        'Coordinated projects and events in a team-oriented environment.',
      ],
    },
  },
];
