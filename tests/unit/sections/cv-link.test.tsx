import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Career from '@/components/sections/career';
import { profile } from '@/content';
import { renderWithIntl as render } from '../render';

describe('CV download', () => {
  it('ships the PDF the profile points to', () => {
    expect(profile.cv).toBe('/haci-simsek-cv.pdf');
    expect(existsSync(join(process.cwd(), 'public', profile.cv))).toBe(true);
  });

  it('is offered beside the career history', () => {
    render(<Career />);
    const link = screen.getByRole('link', { name: /Download CV/ });
    expect(link).toHaveAttribute('href', '/haci-simsek-cv.pdf');
    expect(link).toHaveAttribute('download');
  });

  // The CV is in English; the Turkish site says so.
  it('says the CV is in English on the Turkish site', () => {
    render(<Career />, { locale: 'tr' });
    expect(
      screen.getByRole('link', { name: /CV’yi indir.*İngilizce/ })
    ).toHaveAttribute('href', '/haci-simsek-cv.pdf');
  });
});
