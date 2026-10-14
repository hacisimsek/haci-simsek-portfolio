import type { Locale, YearMonth } from '@/content/types';

const PRESENT: Record<Locale, string> = { en: 'Present' };

function parse(value: YearMonth) {
  const [year, month] = value.split('-').map(Number);
  return { year, month };
}

export function formatYearMonth(value: YearMonth, locale: Locale = 'en') {
  const { year, month } = parse(value);
  return new Intl.DateTimeFormat(locale, {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(year, month - 1, 1)));
}

export function formatPeriod(
  start: YearMonth,
  end: YearMonth | null,
  locale: Locale = 'en'
) {
  const to = end ? formatYearMonth(end, locale) : PRESENT[locale];
  return `${formatYearMonth(start, locale)} - ${to}`;
}

export function careerYears(start: YearMonth, today: Date = new Date()) {
  const { year, month } = parse(start);
  const months =
    (today.getUTCFullYear() - year) * 12 + (today.getUTCMonth() + 1 - month);
  return Math.floor(months / 12);
}
