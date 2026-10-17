import type { Role } from './types';

export const experience: Role[] = [
  {
    id: 'sisal-senior-specialist',
    company: { en: 'Sisal', tr: 'Sisal' },
    title: {
      en: 'Software Development Senior Specialist',
      tr: 'Kıdemli Yazılım Geliştirme Uzmanı',
    },
    team: { en: 'AreaPrivata', tr: 'AreaPrivata' },
    kind: 'employment',
    focus: {
      en: 'Backend and platform engineering',
      tr: 'Backend ve platform mühendisliği',
    },
    start: '2025-01',
    end: null,
    summary: {
      en: 'Building Spring Boot microservices and production-ready backend flows in a regulated digital gaming and payments environment.',
      tr: 'Regülasyona tabi dijital oyun ve ödeme ortamında Spring Boot mikroservisleri ve üretime hazır backend akışları geliştiriyorum.',
    },
    highlights: {
      en: [
        'Ran the proof of concept for moving from Spring Boot 2.x to 3.x and Java 11 to 21, then independently migrated all 30+ modules to **Java 21**.',
        'Build backend microservices for **AreaPrivata**, Sisal’s customer account area, with **Spring Boot**, **Spring MVC**, **JPA/Hibernate** and **Spring Security**, across authentication, registration, account, session, profile and content domains, plus **TypeScript**/**NestJS** services on **MongoDB**.',
        'Integrate third-party providers over **REST** and **SOAP**, with asynchronous messaging over **Kafka** and **RabbitMQ**, retry strategies and caching with **Redis Sentinel**.',
        'Led the migration of the infrastructure to a new API-driven model, defining standards and best practices for consistency across services.',
        'Take part in CI/CD, code reviews, automated tests and releases with **Maven**, **Git**, **Jenkins**, **GitLab CI**, **Docker**, **Kubernetes** and **Argo CD**.',
        'Troubleshoot production issues and tune SQL and JVM performance using logs, metrics and distributed tracing, plus load testing.',
      ],
      tr: [
        'Spring Boot 2.x’ten 3.x’e ve Java 11’den 21’e geçişin PoC çalışmasını yürüttüm; ardından 30’dan fazla modülün tamamını bağımsız olarak **Java 21**’e taşıdım.',
        'Sisal’in müşteri hesap alanı **AreaPrivata** için **Spring Boot**, **Spring MVC**, **JPA/Hibernate** ve **Spring Security** ile kimlik doğrulama, kayıt, hesap, oturum, profil ve içerik alanlarında backend mikroservisleri, ayrıca **MongoDB** üzerinde **TypeScript**/**NestJS** servisleri geliştiriyorum.',
        'Üçüncü taraf sağlayıcıları **REST** ve **SOAP** üzerinden entegre ediyorum; **Kafka** ve **RabbitMQ** ile asenkron mesajlaşma, yeniden deneme stratejileri ve **Redis Sentinel** ile önbellekleme kullanıyorum.',
        'Altyapının yeni API odaklı modele geçişine liderlik ettim; servisler arasında tutarlılık için standartları ve en iyi uygulamaları belirledim.',
        '**Maven**, **Git**, **Jenkins**, **GitLab CI**, **Docker**, **Kubernetes** ve **Argo CD** ile CI/CD, code review, otomatik test ve sürüm süreçlerinde yer alıyorum.',
        'Production sorunlarını log, metrik ve distributed tracing ile çözüyor, SQL ve JVM performansını iyileştiriyor, yük testi yapıyorum.',
      ],
    },
  },
  {
    id: 'sisal-software-engineer',
    company: { en: 'Sisal', tr: 'Sisal' },
    title: { en: 'Software Engineer', tr: 'Yazılım Mühendisi' },
    team: { en: 'Lottery and Terminals', tr: 'Piyango ve Terminaller' },
    kind: 'employment',
    focus: {
      en: 'Full-stack development',
      tr: 'Full-stack geliştirme',
    },
    start: '2022-06',
    end: '2025-01',
    summary: {
      en: 'Built end-to-end applications for the lottery and terminals platform.',
      tr: 'Piyango ve terminaller platformu için uçtan uca uygulamalar geliştirdim.',
    },
    highlights: {
      en: [
        'Member of the Lottery and Terminals team, developing applications end to end with **React.js**, **Java** and **OSGi** (a modular Java platform).',
        'Collaborated on global projects, joining international meetings and business trips that fed into strategic decisions.',
      ],
      tr: [
        'Piyango ve Terminaller ekibinde **React.js**, **Java** ve **OSGi** (modüler Java platformu) ile uçtan uca uygulama geliştirdim.',
        'Global projelerde uluslararası toplantılara ve iş seyahatlerine katılarak stratejik kararlara katkı verdim.',
      ],
    },
  },
  {
    id: 'nuevo-software-engineer',
    company: { en: 'Nuevo Software House', tr: 'Nuevo Software House' },
    title: { en: 'Software Engineer', tr: 'Yazılım Mühendisi' },
    kind: 'employment',
    focus: {
      en: 'Enterprise web applications',
      tr: 'Kurumsal web uygulamaları',
    },
    start: '2021-09',
    end: '2022-06',
    summary: {
      en: 'Delivered end-to-end web applications for enterprise clients such as Türk Petrol, AvivaSA, Kordsa and Tavuk Dünyası.',
      tr: 'Türk Petrol, AvivaSA, Kordsa ve Tavuk Dünyası gibi kurumsal müşteriler için uçtan uca web uygulamaları teslim ettim.',
    },
    highlights: {
      en: [
        'Built business-facing applications with **React.js** and **SharePoint** for clients including **Türk Petrol**, **AvivaSA**, **Kordsa** and **Tavuk Dünyası**.',
        'Balanced maintainability, user experience and client-specific workflows across enterprise implementations.',
        'Supported the design, implementation and release of tailored solutions with product and delivery teams.',
      ],
      tr: [
        '**Türk Petrol**, **AvivaSA**, **Kordsa** ve **Tavuk Dünyası** gibi müşteriler için **React.js** ve **SharePoint** ile iş uygulamaları geliştirdim.',
        'Kurumsal projelerde sürdürülebilirlik, kullanıcı deneyimi ve müşteriye özel iş akışları arasında denge kurdum.',
        'Ürün ve teslimat ekipleriyle birlikte müşteriye özel çözümlerin tasarımına, geliştirilmesine ve yayına alınmasına destek verdim.',
      ],
    },
  },
  {
    id: 'telenity-intern',
    company: { en: 'Telenity', tr: 'Telenity' },
    title: { en: 'Software Engineer Intern', tr: 'Stajyer Yazılım Mühendisi' },
    team: { en: 'VAS and Messaging', tr: 'VAS ve Mesajlaşma' },
    kind: 'internship',
    focus: { en: 'Telecom backend', tr: 'Telekom backend' },
    start: '2021-06',
    end: '2021-08',
    summary: {
      en: 'Started in telecom-focused backend development and messaging systems.',
      tr: 'Telekom odaklı backend geliştirme ve mesajlaşma sistemleriyle başladım.',
    },
    highlights: {
      en: [
        'Contributed to VAS and messaging features with **Java** and **Spring Boot**.',
        "Supported the company's work on **5G** technologies.",
        'Learned how scalable backend services behave in a demanding telecommunications environment.',
      ],
      tr: [
        '**Java** ve **Spring Boot** ile VAS ve mesajlaşma özelliklerine katkı verdim.',
        'Şirketin **5G** teknolojileri üzerindeki çalışmalarına destek oldum.',
        'Zorlu bir telekomünikasyon ortamında ölçeklenebilir backend servislerinin nasıl davrandığını öğrendim.',
      ],
    },
  },
  {
    id: 'bau-ai-society',
    company: {
      en: 'Bahçeşehir University AI Society',
      tr: 'Bahçeşehir Üniversitesi Yapay Zekâ Kulübü',
    },
    title: { en: 'Project Manager', tr: 'Proje Yöneticisi' },
    kind: 'leadership',
    focus: { en: 'Community and events', tr: 'Topluluk ve etkinlikler' },
    start: '2019-09',
    end: '2020-06',
    summary: {
      en: 'Organized AI-focused seminars, workshops and networking events for students and professionals.',
      tr: 'Öğrenciler ve profesyoneller için yapay zekâ odaklı seminerler, atölyeler ve networking etkinlikleri düzenledim.',
    },
    highlights: {
      en: [
        'Promoted **artificial intelligence** through educational initiatives that raised engagement in the academic community.',
        'Coordinated projects and events in a team-oriented environment.',
      ],
      tr: [
        'Akademik toplulukta ilgiyi artıran eğitim çalışmalarıyla **yapay zekâ** teknolojilerini tanıttım.',
        'Takım odaklı bir ortamda proje ve etkinlik koordinasyonu yaptım.',
      ],
    },
  },
];
