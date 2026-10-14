// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { formatClock } from '@/lib/clock';

describe('formatClock', () => {
  it('shows Istanbul time whatever the machine time zone is', () => {
    expect(formatClock(new Date('2026-10-14T09:05:00Z'), 'en')).toBe('12:05');
    expect(formatClock(new Date('2026-10-14T21:30:00Z'), 'tr')).toBe('00:30');
  });
});
