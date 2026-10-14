import type { Profile } from './types';

export const profile: Profile = {
  name: 'Hacı Şimşek',
  asciiName: 'Haci Simsek',
  role: { en: 'Software Development Senior Specialist' },
  currentCompany: 'Sisal',
  headline: {
    en: 'Software engineer building backend and distributed systems for high-traffic environments.',
  },
  intro: {
    en: 'Software engineer with {years} years of experience building backend and full-stack solutions across regulated, high-traffic environments. Strong in Java, Spring Boot, distributed systems, CI/CD, and cloud-native delivery, with additional frontend experience in React and Next.js.',
  },
  bio: {
    en: [
      'At Sisal I have worked on end-to-end development for an international audience, first on the lottery and terminals platform and now on authentication and account services in the AreaPrivata ecosystem.',
      'I graduated from Bahçeşehir University on a full scholarship, with a major in Electrical and Electronics Engineering and a minor in Software Engineering, and I share what I learn about architecture patterns through technical articles.',
    ],
  },
  location: {
    en: 'Istanbul, engineering systems for international-scale products',
  },
  email: 'hacisimsek23@gmail.com',
  careerStart: '2021-06',
  expertise: {
    en: [
      'Java & Spring Boot',
      'Distributed systems',
      'CI/CD and observability',
      'Cloud-native architecture',
    ],
  },
  environment: { en: 'Regulated, high-traffic systems' },
};
