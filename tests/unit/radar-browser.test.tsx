import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import RadarBrowser from '@/components/radar/radar-browser';
import RadarRow from '@/components/radar/radar-row';
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

describe('RadarRow', () => {
  // Google has no icon for some small sites; show where the item came from.
  it("falls back to the source's own icon when the site has none", () => {
    render(
      <ul>
        <RadarRow
          item={{
            ...post('obscure', 'lobsters', 5),
            icon: 'https://www.google.com/s2/favicons?domain=obscure.example&sz=64',
          }}
          date="Nov 7"
          count={String}
          max={5}
          fresh={false}
        />
      </ul>
    );
    const icon = screen
      .getByRole('link', { name: 'obscure' })
      .closest('li')!
      .querySelector('img')!;
    fireEvent.error(icon);
    expect(decodeURIComponent(icon.src)).toContain('domain=lobste.rs');
  });
});
