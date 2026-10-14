import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import TerminalDialog from '@/components/terminal/terminal-dialog';
import { renderWithIntl as render } from '../render';

function setup(locale: 'en' | 'tr' = 'en') {
  const onOpenChange = vi.fn();
  const user = userEvent.setup();
  render(<TerminalDialog open onOpenChange={onOpenChange} />, { locale });
  const input = screen.getByRole('textbox', {
    name: locale === 'en' ? 'Command' : 'Komut',
  });
  const log = screen.getByRole('log');
  return { user, input, log, onOpenChange };
}

describe('TerminalDialog', () => {
  it('opens as a named dialog with the prompt focused and a welcome line', () => {
    const { input, log } = setup();
    expect(
      screen.getByRole('dialog', { name: 'Terminal' })
    ).toBeInTheDocument();
    expect(input).toHaveFocus();
    expect(log).toHaveTextContent('Type help');
  });

  it('runs a command and echoes it', async () => {
    const { user, input, log } = setup();
    await user.type(input, 'whoami{Enter}');
    expect(log).toHaveTextContent('whoami');
    expect(log).toHaveTextContent('Hacı Şimşek');
    expect(input).toHaveValue('');
  });

  it('recalls history with the arrow keys', async () => {
    const { user, input } = setup();
    await user.type(input, 'help{Enter}whoami{Enter}');
    await user.keyboard('{ArrowUp}');
    expect(input).toHaveValue('whoami');
    await user.keyboard('{ArrowUp}');
    expect(input).toHaveValue('help');
    await user.keyboard('{ArrowDown}{ArrowDown}');
    expect(input).toHaveValue('');
  });

  it('completes commands with Tab without leaving the input', async () => {
    const { user, input, log } = setup();
    await user.type(input, 'sk');
    await user.keyboard('{Tab}');
    expect(input).toHaveValue('skills ');
    expect(input).toHaveFocus();
    await user.clear(input);
    await user.type(input, 's');
    await user.keyboard('{Tab}');
    expect(log).toHaveTextContent('skills');
    expect(log).toHaveTextContent('sudo');
  });

  it('clears the screen', async () => {
    const { user, input, log } = setup();
    await user.type(input, 'help{Enter}clear{Enter}');
    expect(log).toBeEmptyDOMElement();
  });

  it('shows unknown and HTML-looking input as plain text', async () => {
    const { user, input, log } = setup('tr');
    await user.type(input, '<img src=x onerror=alert(1)>{Enter}');
    expect(log).toHaveTextContent('komut bulunamadı: <img');
    expect(log.querySelector('img')).toBeNull();
  });

  it('renders links from command output', async () => {
    const { user, input, log } = setup();
    await user.type(input, 'contact{Enter}');
    expect(within(log).getByRole('link', { name: 'GitHub' })).toHaveAttribute(
      'href',
      'https://github.com/hacisimsek'
    );
  });

  it('closes with exit and with Escape', async () => {
    const { user, input, onOpenChange } = setup();
    await user.type(input, 'exit{Enter}');
    expect(onOpenChange).toHaveBeenCalledWith(false);
    onOpenChange.mockClear();
    await user.keyboard('{Escape}');
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
