// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { careerYears, formatPeriod, formatYearMonth } from '@/lib/dates';

describe('formatYearMonth', () => {
  it('formats as a short month and year', () => {
    expect(formatYearMonth('2022-06')).toBe('Jun 2022');
    expect(formatYearMonth('2019-09')).toBe('Sep 2019');
  });
});

describe('formatPeriod', () => {
  it('joins start and end', () => {
    expect(formatPeriod('2022-06', '2025-01')).toBe('Jun 2022 - Jan 2025');
  });

  it('shows Present for an ongoing role', () => {
    expect(formatPeriod('2025-01', null)).toBe('Jan 2025 - Present');
  });
});

describe('careerYears', () => {
  it('counts whole years only', () => {
    expect(careerYears('2021-06', new Date('2026-05-31T12:00:00Z'))).toBe(4);
    expect(careerYears('2021-06', new Date('2026-06-01T12:00:00Z'))).toBe(5);
    expect(careerYears('2021-06', new Date('2026-10-14T12:00:00Z'))).toBe(5);
  });
});

describe('Turkish dates', () => {
  it('uses Turkish month names and "Halen" for ongoing roles', () => {
    expect(formatYearMonth('2022-06', 'tr')).toBe('Haz 2022');
    expect(formatPeriod('2025-01', null, 'tr')).toBe('Oca 2025 - Halen');
  });
});
