import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import About from '@/components/sections/about';
import { renderWithIntl as render } from '../render';

describe('About', () => {
  it('reads as prose beside the portrait, not a bento of cards', () => {
    const { container } = render(<About />);
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: /systems that have to stay up/,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('img', { name: 'Hacı Şimşek' })
    ).toBeInTheDocument();
    expect(container.querySelector('.surface-card')).toBeNull();
  });

  it('states the years the same way as the hero', () => {
    render(<About />);
    expect(
      screen.getByText(/Software engineer with \d+\+ years of experience/)
    ).toBeInTheDocument();
  });

  it('does not repeat the role, the clock or the contact links', () => {
    render(<About />);
    expect(screen.queryByText(/Currently at/)).toBeNull();
    expect(screen.queryByText(/Local time/)).toBeNull();
    expect(screen.queryByRole('link', { name: 'GitHub' })).toBeNull();
  });

  it('keeps to the two text tones', () => {
    const { container } = render(<About />);
    expect(container.querySelector('[class*="text-foreground/"]')).toBeNull();
  });
});
