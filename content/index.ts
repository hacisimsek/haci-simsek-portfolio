import type { L10n, Locale } from './types';

export const DEFAULT_LOCALE: Locale = 'en';

export function t<T>(value: L10n<T>, locale: Locale = DEFAULT_LOCALE): T {
  return value[locale];
}

export { education } from './education';
export { experience } from './experience';
export { profile } from './profile';
export { skills } from './skills';
export { socials } from './socials';
export type * from './types';
