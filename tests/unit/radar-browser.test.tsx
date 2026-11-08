import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import RadarBrowser from '@/components/radar/radar-browser';
import type { RadarItem } from '@/lib/feeds/radar';
import { renderWithIntl as render } from './render';

const post = (
  id: string,
  source: RadarItem['source'],
  points: number
): RadarItem => ({
  id,
  source,
  kind: 'post',
  title: id,
  url: `https://example.com/${id}`,
  summary: '',
  publishedAt: '2026-11-01T00:00:00Z',
  rank: 0,
  points,
  icon: 'https://www.google.com/s2/favicons?domain=example.com&sz=64',
});

const bar = (title: string) =>
  screen
    .getByRole('link', { name: title })
    .closest('li')!
    .querySelector<HTMLElement>('[aria-hidden] > div')!.style.width;

describe('RadarBrowser', () => {
  // DEV reactions and Lobsters votes are on different scales.
  it('measures each post against the best of its own source', () => {
    render(
      <RadarBrowser
        items={[
          post('dev-top', 'devto', 400),
          post('dev-half', 'devto', 200),
          post('lobsters-top', 'lobsters', 40),
        ]}
        picks={[]}
      />
    );
    expect(bar('dev-top')).toBe('100%');
    expect(bar('dev-half')).toBe('50%');
    expect(bar('lobsters-top')).toBe('100%');
  });
});
