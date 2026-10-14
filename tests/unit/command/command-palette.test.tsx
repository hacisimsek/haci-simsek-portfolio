import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import CommandPalette from '@/components/command/command-palette';
import { profile } from '@/content';
import { renderWithIntl as render } from '../render';

describe('CommandPalette', () => {
  it('opens with Ctrl+K as a dialog named by the translated title', async () => {
    const user = userEvent.setup();
    render(<CommandPalette />);

    await user.keyboard('{Control>}k{/Control}');

    expect(
      await screen.findByRole('dialog', { name: 'Command palette' })
    ).toBeInTheDocument();
  });

  it('finds Turkish labels typed without diacritics', async () => {
    const user = userEvent.setup();
    render(<CommandPalette />, { locale: 'tr' });

    await user.click(screen.getByRole('button', { name: /Komut paleti/ }));
    await user.type(await screen.findByRole('combobox'), 'iletisim');

    expect(
      screen.getByRole('option', { name: 'İletişim' })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('option', { name: 'Projeler' })
    ).not.toBeInTheDocument();
  });

  it('closes on Escape and returns focus to the trigger', async () => {
    const user = userEvent.setup();
    render(<CommandPalette />);

    const trigger = screen.getByRole('button', { name: /Command palette/ });
    await user.click(trigger);
    await screen.findByRole('dialog');
    await user.keyboard('{Escape}');

    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    );
    expect(trigger).toHaveFocus();
  });

  it('copies the email address and confirms in place', async () => {
    const user = userEvent.setup();
    render(<CommandPalette />);

    await user.click(screen.getByRole('button', { name: /Command palette/ }));
    await user.click(await screen.findByRole('option', { name: 'Copy email' }));

    expect(await navigator.clipboard.readText()).toBe(profile.email);
    expect(screen.getByRole('option', { name: 'Copied' })).toBeInTheDocument();
  });
});

describe('CommandPalette shortcut', () => {
  it('ignores auto-repeat while the keys are held', async () => {
    render(<CommandPalette />);
    fireEvent.keyDown(window, { key: 'k', ctrlKey: true });
    fireEvent.keyDown(window, { key: 'k', ctrlKey: true, repeat: true });

    expect(
      await screen.findByRole('dialog', { name: 'Command palette' })
    ).toBeInTheDocument();
  });
});
