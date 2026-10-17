import type { Profile } from './types';

export const profile: Profile = {
  name: 'Hacı Şimşek',
  asciiName: 'Haci Simsek',
  title: { en: 'Java Backend Developer', tr: 'Java Backend Geliştirici' },
  role: {
    en: 'Software Development Senior Specialist',
    tr: 'Kıdemli Yazılım Geliştirme Uzmanı',
  },
  currentCompany: 'Sisal',
  headline: {
    en: 'Java backend developer building Spring Boot microservices and distributed systems for high-traffic environments.',
    tr: 'Yüksek trafikli ortamlar için Spring Boot mikroservisleri ve dağıtık sistemler geliştiren Java backend geliştirici.',
  },
  intro: {
    en: 'For {years} years I have built Spring Boot microservices in regulated, high-traffic environments: REST and SOAP APIs, JPA/Hibernate, Kafka and RabbitMQ, SQL, and delivery through CI/CD, Docker and Kubernetes. I test with JUnit and Mockito, review code, troubleshoot production and tune performance, and also build TypeScript/NestJS services on MongoDB and React frontends.',
    tr: '{years} yıldır regülasyona tabi, yüksek trafikli ortamlarda Spring Boot mikroservisleri geliştiriyorum: REST ve SOAP API’ler, JPA/Hibernate, Kafka ve RabbitMQ, SQL; CI/CD, Docker ve Kubernetes ile teslimat. JUnit ve Mockito ile test yazıyor, code review yapıyor, production sorunlarını çözüp performansı iyileştiriyorum; MongoDB üzerinde TypeScript/NestJS servisleri ve React arayüzleri de geliştiriyorum.',
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
