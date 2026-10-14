import type { EducationItem } from './types';

export const education: EducationItem[] = [
  {
    id: 'bau-eee',
    school: { en: 'Bahçeşehir University', tr: 'Bahçeşehir Üniversitesi' },
    location: { en: 'Istanbul, Turkey', tr: 'İstanbul, Türkiye' },
    degree: {
      en: 'BSc, Electrical and Electronics Engineering',
      tr: 'Lisans, Elektrik-Elektronik Mühendisliği',
    },
    track: 'major',
    trackLabel: { en: 'Major', tr: 'Ana dal' },
    start: '2017-09',
    end: '2021-06',
    notes: { en: ['Full scholarship'], tr: ['Tam burslu'] },
  },
  {
    id: 'bau-se',
    school: { en: 'Bahçeşehir University', tr: 'Bahçeşehir Üniversitesi' },
    location: { en: 'Istanbul, Turkey', tr: 'İstanbul, Türkiye' },
    degree: {
      en: 'BSc, Software Engineering',
      tr: 'Yazılım Mühendisliği',
    },
    track: 'minor',
    trackLabel: { en: 'Minor', tr: 'Yan dal' },
    start: '2019-09',
    end: '2021-06',
    notes: { en: [], tr: [] },
  },
];
