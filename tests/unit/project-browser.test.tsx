import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ProjectBrowser from '@/components/collections/project-browser';
import { renderWithIntl as render } from './render';

const repos = [
  {
    name: 'notifyhub',
    description: 'Reminder platform',
    url: 'https://github.com/hacisimsek/notifyhub',
    language: 'Java',
    updatedAt: '2026-03-01T00:00:00Z',
  },
  {
    name: 'bff-application',
    description: 'Backend for frontend',
    url: 'https://github.com/hacisimsek/bff-application',
    language: 'Java',
    updatedAt: '2026-05-01T00:00:00Z',
  },
  {
    name: 'wordly',
    description: 'Word game',
    url: 'https://github.com/hacisimsek/wordly',
    language: 'TypeScript',
    updatedAt: '2026-01-01T00:00:00Z',
  },
];

// Rows are h3 under the "Selected projects" / "Other repositories" h2s.
const cards = () =>
  screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent);

describe('ProjectBrowser', () => {
  it('filters by search and announces the count', async () => {
    const user = userEvent.setup();
    render(<ProjectBrowser repos={repos} />);

    expect(screen.getByRole('status')).toHaveTextContent('Showing 3 of 3');
    await user.type(screen.getByLabelText('Search'), 'remind');

    expect(cards()).toEqual(['NotifyHub']);
    await waitFor(() =>
      expect(screen.getByRole('status')).toHaveTextContent('Showing 1 of 3')
    );
  });

  it('toggles a language filter', async () => {
    const user = userEvent.setup();
    render(<ProjectBrowser repos={repos} />);
    const filters = screen.getByRole('group', { name: 'Language' });

    const typescript = within(filters).getByRole('button', {
      name: 'TypeScript',
    });
    await user.click(typescript);
    expect(typescript).toHaveAttribute('aria-pressed', 'true');
    expect(cards()).toEqual(['Wordly']);

    await user.click(within(filters).getByRole('button', { name: 'All' }));
    expect(cards()).toHaveLength(3);
  });

  it('sorts by name', async () => {
    const user = userEvent.setup();
    render(<ProjectBrowser repos={repos} />);
    await user.selectOptions(screen.getByLabelText('Sort'), 'name');
    expect(cards()).toEqual(['NotifyHub', 'BFF application', 'Wordly']);
  });

  it('offers a reset when nothing matches, in Turkish too', async () => {
    const user = userEvent.setup();
    render(<ProjectBrowser repos={repos} />, { locale: 'tr' });
    await user.type(screen.getByLabelText('Ara'), 'xyzzy');

    await waitFor(() =>
      expect(screen.getByRole('status')).toHaveTextContent(
        '3 sonuçtan 0 tanesi'
      )
    );
    expect(screen.getByText('Eşleşen sonuç yok.')).toBeInTheDocument();
    await user.click(
      screen.getByRole('button', { name: 'Filtreleri sıfırla' })
    );
    expect(cards()).toHaveLength(3);
    expect(screen.getByLabelText('Ara')).toHaveValue('');
  });

  it('shows the count at once but announces it only after typing pauses', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    try {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<ProjectBrowser repos={repos} />);
      await user.type(screen.getByLabelText('Search'), 'remind');

      expect(
        screen.getByText('Showing 1 of 3', { selector: '[aria-hidden="true"]' })
      ).toBeInTheDocument();
      expect(screen.getByRole('status')).not.toHaveTextContent(
        'Showing 1 of 3'
      );
      await act(async () => {
        vi.advanceTimersByTime(500);
      });
      expect(screen.getByRole('status')).toHaveTextContent('Showing 1 of 3');
    } finally {
      vi.useRealTimers();
    }
  });

  it('leads with the authored picks, then the other repositories', () => {
    render(<ProjectBrowser repos={repos} />);
    const groups = screen.getAllByRole('heading', { level: 2 });
    expect(groups.map((h) => h.textContent)).toEqual([
      'Selected projects',
      'Other repositories',
    ]);
    const selected = groups[0].closest('section')!;
    expect(within(selected).getAllByRole('heading', { level: 3 })).toHaveLength(
      1
    );
    expect(selected).toHaveTextContent(/RabbitMQ with retries/);
    const others = groups[1].closest('section')!;
    expect(
      within(others)
        .getAllByRole('heading', { level: 3 })
        .map((h) => h.textContent)
    ).toEqual(['BFF application', 'Wordly']);
    expect(screen.queryByText(/Updated/)).toBeNull();
  });

  it('drops a group that a filter empties', async () => {
    const user = userEvent.setup();
    render(<ProjectBrowser repos={repos} />);
    await user.type(screen.getByLabelText('Search'), 'word game');
    expect(
      screen.queryByRole('heading', { level: 2, name: 'Selected projects' })
    ).toBeNull();
    expect(
      screen.getByRole('heading', { level: 2, name: 'Other repositories' })
    ).toBeInTheDocument();
  });

  it('rings filter chips with the site focus style', () => {
    render(<ProjectBrowser repos={repos} />);
    const chip = screen.getByRole('button', { name: 'TypeScript' });
    expect(chip).toHaveClass('focus-visible:ring-2', 'focus-visible:ring-ring');
  });
});
