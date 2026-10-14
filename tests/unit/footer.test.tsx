import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
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
});
