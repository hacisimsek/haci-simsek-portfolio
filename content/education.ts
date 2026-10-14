import type { EducationItem } from './types';

export const education: EducationItem[] = [
  {
    id: 'bau-eee',
    school: { en: 'Bahçeşehir University' },
    location: { en: 'Istanbul, Turkey' },
    degree: { en: 'BSc, Electrical and Electronics Engineering' },
    track: 'major',
    trackLabel: { en: 'Major' },
    start: '2017-09',
    end: '2021-06',
    notes: { en: ['Full scholarship'] },
  },
  {
    id: 'bau-se',
    school: { en: 'Bahçeşehir University' },
    location: { en: 'Istanbul, Turkey' },
    degree: { en: 'BSc, Software Engineering' },
    track: 'minor',
    trackLabel: { en: 'Minor' },
    start: '2019-09',
    end: '2021-06',
    notes: { en: [] },
  },
];
