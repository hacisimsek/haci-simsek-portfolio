import { screen, within } from '@testing-library/react';
import { renderWithIntl as render } from './render';
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
    // The phone menu is the panel holding the second copy of the nav links.
    const mobileMenu = screen
      .getAllByRole('link', { name: 'Projects' })
      .at(-1)!
      .closest('[data-glass]')!;

    expect(mobileMenu).toHaveClass('max-h-0');
    await user.click(toggle);
    expect(mobileMenu).not.toHaveClass('max-h-0');
    // On phones the language and theme controls live in the menu.
    expect(
      within(mobileMenu as HTMLElement).getByRole('navigation', {
        name: 'Language',
      })
    ).toBeInTheDocument();
    expect(
      within(mobileMenu as HTMLElement).getByRole('button', {
        name: 'Toggle theme',
      })
    ).toBeInTheDocument();
    await user.click(toggle);
    expect(mobileMenu).toHaveClass('max-h-0');
  });
});
