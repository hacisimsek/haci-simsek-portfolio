import type { Profile } from './types';

export const profile: Profile = {
  name: 'Hacı Şimşek',
  asciiName: 'Haci Simsek',
  title: { en: 'Backend Engineer', tr: 'Backend Mühendisi' },
  role: {
    en: 'Software Development Senior Specialist',
    tr: 'Kıdemli Yazılım Geliştirme Uzmanı',
  },
  currentCompany: 'Sisal',
  headline: {
    en: 'Backend engineer designing event-driven systems with Spring Boot and Kafka for high-traffic, regulated products.',
    tr: 'Yüksek trafikli, regülasyona tabi ürünler için Spring Boot ve Kafka ile event-driven sistemler tasarlayan backend mühendisi.',
  },
  intro: {
    en: 'For {years} years I have built Spring Boot microservices in regulated, high-traffic environments: services that talk over REST and SOAP or through Kafka and RabbitMQ, ship through CI/CD on Kubernetes, and are watched in production through logs, metrics and traces.',
    tr: '{years} yıldır regülasyona tabi, yüksek trafikli ortamlarda Spring Boot mikroservisleri geliştiriyorum: REST ve SOAP ya da Kafka ve RabbitMQ üzerinden konuşan, CI/CD ile Kubernetes’e çıkan ve production’da log, metrik ve trace’lerle izlenen servisler.',
  },
  bio: {
    en: [
      'At Sisal I have worked on end-to-end development for an international audience, first on the lottery and terminals platform and now on authentication and account services for AreaPrivata, Sisal’s customer account area.',
      'I graduated from Bahçeşehir University on a full scholarship, with a major in Electrical and Electronics Engineering and a minor in Software Engineering, and I share what I learn about architecture patterns through technical articles.',
    ],
    tr: [
      'Sisal’de uluslararası bir kitle için uçtan uca geliştirme yaptım; önce piyango ve terminaller platformunda, şimdi ise Sisal’in müşteri hesap alanı AreaPrivata için kimlik doğrulama ve hesap servislerinde çalışıyorum.',
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
      'Microservices & event-driven design',
      'Kafka & RabbitMQ',
      'CI/CD & Kubernetes',
      'Observability & performance',
    ],
    tr: [
      'Java ve Spring Boot',
      'Mikroservisler ve event-driven tasarım',
      'Kafka ve RabbitMQ',
      'CI/CD ve Kubernetes',
      'Gözlemlenebilirlik ve performans',
    ],
  },
  environment: {
    en: 'Regulated, high-traffic systems',
    tr: 'Regülasyona tabi, yüksek trafikli sistemler',
  },
  certifications: {
    en: ['Advanced Java Programming (TDD)'],
    tr: ['Advanced Java Programming (TDD)'],
  },
  languages: {
    en: ['Turkish (native)', 'English (B2)'],
    tr: ['Türkçe (anadil)', 'İngilizce (B2)'],
  },
};
