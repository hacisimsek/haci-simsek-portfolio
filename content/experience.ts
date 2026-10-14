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
        'Build backend microservices in the **AreaPrivata** ecosystem with **Java 11**, **Spring Boot** and **Maven**, across authentication, account, session, profile and content domains.',
        'Designed and optimized core services for registration, profile management and gateway communication.',
        'Built resilient integrations with asynchronous messaging over **RabbitMQ**, retry strategies and caching with **Redis Sentinel**.',
        'Led the migration of the infrastructure to a new API-driven model, defining standards and best practices for consistency across services.',
        'Work with DevOps on deployment and monitoring with **Kubernetes** and **ArgoCD**, plus observability, load testing and performance tuning.',
      ],
      tr: [
        '**AreaPrivata** ekosisteminde **Java 11**, **Spring Boot** ve **Maven** ile kimlik doğrulama, hesap, oturum, profil ve içerik alanlarında backend mikroservisleri geliştiriyorum.',
        'Kayıt, profil yönetimi ve gateway iletişimi için temel servisleri tasarlayıp optimize ettim.',
        '**RabbitMQ** üzerinden asenkron mesajlaşma, yeniden deneme stratejileri ve **Redis Sentinel** ile önbellekleme kullanarak dayanıklı entegrasyonlar kurdum.',
        'Altyapının yeni API odaklı modele geçişine liderlik ettim; servisler arasında tutarlılık için standartları ve en iyi uygulamaları belirledim.',
        'DevOps ekibiyle **Kubernetes** ve **ArgoCD** üzerinden dağıtım ve izleme, ayrıca gözlemlenebilirlik, yük testi ve performans iyileştirme üzerinde çalışıyorum.',
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
      en: 'Full-stack and authentication',
      tr: 'Full-stack ve kimlik doğrulama',
    },
    start: '2022-06',
    end: '2025-01',
    summary: {
      en: 'Built authentication infrastructure and end-to-end applications for the lottery and gaming platform.',
      tr: 'Piyango ve oyun platformu için kimlik doğrulama altyapısı ve uçtan uca uygulamalar geliştirdim.',
    },
    highlights: {
      en: [
        'Designed and implemented the **Orion** module, a new authentication infrastructure integrated with the full-stack application, using **React.js**, **Java** and **OSGi** for scalability, security and compatibility.',
        'Member of the Lottery and Terminals team, developing applications end to end with **React.js** and **OSGi**.',
        'Collaborated on global projects, joining international meetings and business trips that fed into strategic decisions.',
      ],
      tr: [
        'Full-stack uygulamayla entegre çalışan yeni kimlik doğrulama altyapısı **Orion** modülünü **React.js**, **Java** ve **OSGi** kullanarak ölçeklenebilirlik, güvenlik ve uyumluluk odağıyla tasarlayıp geliştirdim.',
        'Piyango ve Terminaller ekibinde **React.js** ve **OSGi** ile uçtan uca uygulama geliştirdim.',
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
      en: 'Delivered end-to-end web applications for enterprise clients across multiple industries.',
      tr: 'Farklı sektörlerdeki kurumsal müşteriler için uçtan uca web uygulamaları teslim ettim.',
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
