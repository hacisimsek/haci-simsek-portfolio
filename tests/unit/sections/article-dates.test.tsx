import { screen } from '@testing-library/react';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import ArticleBrowser from '@/components/collections/article-browser';
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

  it('formats the article list in Istanbul time', () => {
    render(<ArticleBrowser articles={[article]} />);
    expect(screen.getByText('Jan 2, 2026')).toBeInTheDocument();
  });

  // Posts are occasional; on the home page a date only says how long ago.
  it('leaves dates off the home page writing list', () => {
    const { container } = render(<LatestWriting articles={[article]} />);
    expect(container.querySelector('time')).toBeNull();
    expect(
      screen.getByRole('heading', { level: 2, name: 'Writing' })
    ).toBeInTheDocument();
  });
});
