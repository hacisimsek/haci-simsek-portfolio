import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import AboutBento from '@/components/sections/about-bento';
import { renderWithIntl as render } from '../render';

describe('AboutBento', () => {
  it('computes the years of experience in the intro', () => {
    render(<AboutBento />);
    expect(
      screen.getByText(/Software engineer with \d+ years of experience/)
    ).toBeInTheDocument();
    expect(screen.queryByText(/\{years\}/)).toBeNull();
  });

  it('shows the portrait and current role', () => {
    render(<AboutBento />);
    expect(
      screen.getByRole('img', { name: 'Hacı Şimşek' })
    ).toBeInTheDocument();
    expect(
      screen.getByText('Software Development Senior Specialist')
    ).toBeInTheDocument();
  });

  it('leaves education and articles to their own sections', () => {
    render(<AboutBento />);
    expect(screen.queryByText('Education')).toBeNull();
    expect(screen.queryByText(/Full scholarship/)).toBeNull();
    expect(screen.queryByText('Latest article')).toBeNull();
  });

  it('renders a time placeholder until the client clock starts', () => {
    render(<AboutBento />);
    expect(screen.getByText(/Local time in Istanbul/)).toBeInTheDocument();
  });
});
