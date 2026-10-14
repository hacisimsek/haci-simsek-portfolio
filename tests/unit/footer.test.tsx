import { screen } from '@testing-library/react';
import { renderWithIntl as render } from './render';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Footer from '@/components/Footer';

describe('Footer', () => {
  it('links each social icon to the right profile in a new tab', () => {
    render(<Footer />);

    const expected = {
      GitHub: 'https://github.com/hacisimsek',
      LinkedIn: 'https://www.linkedin.com/in/haci-simsek/',
      X: 'https://x.com/CodeWithHaci',
    };

    for (const [name, href] of Object.entries(expected)) {
      const link = screen.getByRole('link', { name });
      expect(link).toHaveAttribute('href', href);
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    }
  });

  it('points the call to action at the contact page', () => {
    render(<Footer />);
    expect(
      screen.getByRole('link', { name: /start a conversation/i })
    ).toHaveAttribute('href', '/contact');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('links the short build SHA when deployed', () => {
    vi.stubEnv(
      'VERCEL_GIT_COMMIT_SHA',
      '662ca9cc40dbccaac05477a86eccd1acefa7dd7c'
    );
    render(<Footer />);
    expect(screen.getByRole('link', { name: /662ca9c/ })).toHaveAttribute(
      'href',
      'https://github.com/hacisimsek/haci-simsek-portfolio/commit/662ca9cc40dbccaac05477a86eccd1acefa7dd7c'
    );
  });

  it('hides the build link outside a deployment', () => {
    vi.stubEnv('VERCEL_GIT_COMMIT_SHA', '');
    render(<Footer />);
    expect(screen.queryByRole('link', { name: /build/i })).toBeNull();
  });

  it('leaves the wordmark and the local time to the hero and About', () => {
    const { container } = render(<Footer />);
    expect(container.querySelector('footer > p')).toBeNull();
    expect(screen.queryByText(/Istanbul/)).toBeNull();
  });

  it('calls the build a "derleme" in Turkish', () => {
    vi.stubEnv(
      'VERCEL_GIT_COMMIT_SHA',
      '662ca9cc40dbccaac05477a86eccd1acefa7dd7c'
    );
    render(<Footer />, { locale: 'tr' });
    expect(
      screen.getByRole('link', { name: /derleme 662ca9c/ })
    ).toBeInTheDocument();
  });
});
