import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import Header from '@/components/Header';

describe('Header', () => {
  it('links every primary section', () => {
    render(<Header />);

    const expected = {
      Home: '/',
      Projects: '/projects',
      Articles: '/articles',
      Contact: '/contact',
    };

    for (const [name, href] of Object.entries(expected)) {
      for (const link of screen.getAllByRole('link', { name })) {
        expect(link).toHaveAttribute('href', href);
      }
    }
  });

  it('exposes named theme and navigation toggles', () => {
    render(<Header />);
    expect(
      screen.getByRole('button', { name: 'Toggle theme' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Toggle navigation' })
    ).toBeInTheDocument();
  });

  it('opens and closes the mobile menu', async () => {
    const user = userEvent.setup();
    render(<Header />);

    const toggle = screen.getByRole('button', { name: 'Toggle navigation' });
    const mobileMenu = screen.getAllByRole('navigation').at(-1)!.parentElement!;

    expect(mobileMenu).toHaveClass('max-h-0');
    await user.click(toggle);
    expect(mobileMenu).toHaveClass('max-h-80');
    await user.click(toggle);
    expect(mobileMenu).toHaveClass('max-h-0');
  });
});
