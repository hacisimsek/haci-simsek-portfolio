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

  it('lists every rotating role for assistive tech', () => {
    render(<Hero />, { locale: 'tr' });
    const list = screen.getByRole('list', { name: 'Roller' });
    expect(list.querySelectorAll('li')).toHaveLength(4);
  });

  it('links to projects and contact', () => {
    render(<Hero />);
    expect(screen.getByRole('link', { name: /View Projects/ })).toHaveAttribute(
      'href',
      '/projects'
    );
    expect(
      screen.getByRole('link', { name: /Start a Conversation/ })
    ).toHaveAttribute('href', '/contact');
  });
});
