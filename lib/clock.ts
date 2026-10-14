import type { Locale } from '@/content';

const formatters = new Map<Locale, Intl.DateTimeFormat>();

// Always Istanbul time, whatever time zone the visitor or server is in.
export function formatClock(date: Date, locale: Locale): string {
  let format = formatters.get(locale);
  if (!format) {
    format = new Intl.DateTimeFormat(locale, {
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
      timeZone: 'Europe/Istanbul',
    });
    formatters.set(locale, format);
  }
  return format.format(date);
}
