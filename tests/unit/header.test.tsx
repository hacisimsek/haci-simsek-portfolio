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

  it('announces the menu state and closes it with Escape', async () => {
    const user = userEvent.setup();
    render(<Header />);
    const toggle = screen.getByRole('button', { name: 'Toggle navigation' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    const panel = document.getElementById(
      toggle.getAttribute('aria-controls')!
    );
    expect(panel).not.toBeNull();

    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await user.tab();
    await user.keyboard('{Escape}');
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(panel).toHaveClass('max-h-0');
    expect(toggle).toHaveFocus();
  });

  it('leaves Escape to an open dialog above the menu', async () => {
    const user = userEvent.setup();
    render(<Header />);
    const toggle = screen.getByRole('button', { name: 'Toggle navigation' });
    await user.click(toggle);
    // A dialog (e.g. the command palette) handles Escape first.
    const claim = (event: KeyboardEvent) => event.preventDefault();
    document.addEventListener('keydown', claim, { capture: true });
    await user.keyboard('{Escape}');
    document.removeEventListener('keydown', claim, { capture: true });
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
  });

  it('does not pull focus out of the page when Escape closes the menu', async () => {
    const user = userEvent.setup();
    render(
      <>
        <Header />
        <input aria-label="Elsewhere" />
      </>
    );
    const toggle = screen.getByRole('button', { name: 'Toggle navigation' });
    await user.click(toggle);
    const field = screen.getByRole('textbox', { name: 'Elsewhere' });
    field.focus();
    await user.keyboard('{Escape}');
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(field).toHaveFocus();
  });

  it('leaves a modified click on the skip link to the browser', () => {
    render(<Header />);
    const skip = screen.getByRole('link', { name: 'Skip to content' });
    const event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      ctrlKey: true,
    });
    skip.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(false);
  });
});
