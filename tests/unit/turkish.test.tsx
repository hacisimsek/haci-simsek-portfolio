import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Career from '@/components/sections/career';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { renderWithIntl } from './render';

describe('Turkish interface', () => {
  it('translates the header navigation and marks Turkish as current', () => {
    renderWithIntl(<Header />, { locale: 'tr' });
    expect(
      screen.getAllByRole('link', { name: 'Projeler' })[0]
    ).toBeInTheDocument();
    const switcher = screen.getByRole('navigation', { name: 'Dil' });
    expect(
      within(switcher).getByRole('link', { name: 'Türkçe' })
    ).toHaveAttribute('aria-current', 'true');
    expect(
      within(switcher).getByRole('link', { name: 'English' })
    ).not.toHaveAttribute('aria-current');
  });

  it('shows Turkish role titles and periods', () => {
    renderWithIntl(<Career />, { locale: 'tr' });
    const [current] = screen.getAllByRole('article');
    expect(
      within(current).getByRole('heading', {
        name: 'Kıdemli Yazılım Geliştirme Uzmanı',
      })
    ).toBeInTheDocument();
    expect(within(current).getByText('Oca 2025 - Halen')).toBeInTheDocument();
  });

  it('keeps the same social links in Turkish', () => {
    renderWithIntl(<Footer />, { locale: 'tr' });
    expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute(
      'href',
      'https://github.com/hacisimsek'
    );
    expect(
      screen.getByRole('link', { name: /bir konuşma başlat/i })
    ).toBeInTheDocument();
  });
});

describe('Turkish skills', () => {
  it('translates generic skill names and keeps product names', async () => {
    const { default: Skills } = await import('@/components/sections/skills');
    renderWithIntl(<Skills />, { locale: 'tr' });
    expect(screen.getAllByText('Yük testi').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Mikroservisler').length).toBeGreaterThan(0);
    expect(screen.queryByText('Load testing')).toBeNull();
    expect(screen.getAllByText('Kubernetes').length).toBeGreaterThan(0);
  });
});
