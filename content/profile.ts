import type { Profile } from './types';

export const profile: Profile = {
  name: 'Hacı Şimşek',
  asciiName: 'Haci Simsek',
  role: {
    en: 'Software Development Senior Specialist',
    tr: 'Kıdemli Yazılım Geliştirme Uzmanı',
  },
  currentCompany: 'Sisal',
  headline: {
    en: 'Software engineer building backend and distributed systems for high-traffic environments.',
    tr: 'Yüksek trafikli ortamlar için backend ve dağıtık sistemler geliştiren yazılım mühendisi.',
  },
  intro: {
    en: 'Software engineer with {years} years of experience building backend and full-stack solutions across regulated, high-traffic environments. Strong in Java, Spring Boot, distributed systems, CI/CD, and cloud-native delivery, with additional frontend experience in React and Next.js.',
    tr: 'Regülasyona tabi, yüksek trafikli ortamlarda backend ve full-stack çözümler geliştirme konusunda {years} yıllık deneyime sahip yazılım mühendisi. Java, Spring Boot, dağıtık sistemler, CI/CD ve cloud-native teslimat konularında güçlü; React ve Next.js ile frontend deneyimi de var.',
  },
  bio: {
    en: [
      'At Sisal I have worked on end-to-end development for an international audience, first on the lottery and terminals platform and now on authentication and account services in the AreaPrivata ecosystem.',
      'I graduated from Bahçeşehir University on a full scholarship, with a major in Electrical and Electronics Engineering and a minor in Software Engineering, and I share what I learn about architecture patterns through technical articles.',
    ],
    tr: [
      "Sisal'de uluslararası bir kitle için uçtan uca geliştirme yaptım; önce piyango ve terminaller platformunda, şimdi ise AreaPrivata ekosisteminde kimlik doğrulama ve hesap servislerinde çalışıyorum.",
      'Bahçeşehir Üniversitesi Elektrik-Elektronik Mühendisliği bölümünden tam burslu olarak, Yazılım Mühendisliği yan dalıyla mezun oldum; mimari desenler hakkında öğrendiklerimi teknik yazılarla paylaşıyorum.',
    ],
  },
  location: {
    en: 'Istanbul, engineering systems for international-scale products',
    tr: 'İstanbul’dan, uluslararası ölçekte ürünler için sistemler geliştiriyorum',
  },
  city: { en: 'Istanbul', tr: 'İstanbul' },
  email: 'hacisimsek23@gmail.com',
  careerStart: '2021-06',
  expertise: {
    en: [
      'Java & Spring Boot',
      'Distributed systems',
      'CI/CD and observability',
      'Cloud-native architecture',
    ],
    tr: [
      'Java ve Spring Boot',
      'Dağıtık sistemler',
      'CI/CD ve gözlemlenebilirlik',
      'Cloud-native mimari',
    ],
  },
  environment: {
    en: 'Regulated, high-traffic systems',
    tr: 'Regülasyona tabi, yüksek trafikli sistemler',
  },
};
