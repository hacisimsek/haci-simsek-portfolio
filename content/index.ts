import type { L10n, Locale } from './types';

export const DEFAULT_LOCALE: Locale = 'en';

export function t<T>(value: L10n<T>, locale: Locale = DEFAULT_LOCALE): T {
  return value[locale];
}
