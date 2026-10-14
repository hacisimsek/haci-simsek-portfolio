import { screen } from '@testing-library/react';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import LatestWriting from '@/components/sections/latest-writing';
import { renderWithIntl as render } from '../render';

// 22:30 UTC on 1 Jan is already 2 Jan in Istanbul.
const article = {
  title: 'Late post',
  url: 'https://medium.com/@hacisimsek/late',
  excerpt: '',
  categories: [],
  thumbnail: '',
  publishedAt: '2026-01-01T22:30:00.000Z',
};

const originalTz = process.env.TZ;

describe('article dates', () => {
  // Vercel renders in UTC; the date must still be Istanbul's.
  beforeAll(() => {
    process.env.TZ = 'UTC';
  });
  afterAll(() => {
    process.env.TZ = originalTz;
  });

  it('formats the writing cards in Istanbul time', () => {
    render(<LatestWriting articles={[article]} />);
    expect(screen.getByText('Jan 2, 2026')).toBeInTheDocument();
  });
});
