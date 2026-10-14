import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Hero from '@/components/sections/hero';
import { renderWithIntl as render } from '../render';

describe('Hero', () => {
  it('names the page heading after the person, read once', () => {
    render(<Hero />);
    expect(
      screen.getByRole('heading', { level: 1, name: /^Hacı Şimşek/ })
    ).toBeInTheDocument();
  });

  it('keeps the headline inside the heading', () => {
    render(<Hero />);
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /Software engineer building backend/,
      })
    ).toBeInTheDocument();
  });

  it('states the career facts in one plain line', () => {
    render(<Hero />);
    expect(
      screen.getByText(
        /^\d+\+ years of experience\s·\sSoftware Development Senior Specialist at Sisal\s·\sIstanbul$/
      )
    ).toBeInTheDocument();
  });

  it('states the career facts in Turkish', () => {
    render(<Hero />, { locale: 'tr' });
    expect(
      screen.getByText(
        /^\d+\+ yıl deneyim\s·\sSisal bünyesinde Kıdemli Yazılım Geliştirme Uzmanı\s·\sİstanbul$/
      )
    ).toBeInTheDocument();
  });

  it('links to projects and contact', () => {
    render(<Hero />);
    expect(screen.getByRole('link', { name: /View Projects/ })).toHaveAttribute(
      'href',
      '/projects'
    );
    expect(
      screen.getByRole('link', { name: /Start a conversation/ })
    ).toHaveAttribute('href', '/contact');
  });

  it('drops the rotating role line', () => {
    render(<Hero />);
    expect(screen.queryByText('~/')).toBeNull();
    expect(screen.queryByRole('list')).toBeNull();
  });
});
