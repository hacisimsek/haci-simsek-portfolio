import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ProjectRow from '@/components/projects/project-row';
import { renderWithIntl as render } from './render';

const repo = {
  name: 'notifyhub',
  description: 'Reminder platform',
  url: 'https://github.com/hacisimsek/notifyhub',
  language: 'Java',
  updatedAt: '2026-10-12T09:00:00Z',
};

describe('ProjectRow', () => {
  it('writes its own meta line with the separator kept on the line', () => {
    render(<ProjectRow repo={repo} />);
    // The default matcher collapses whitespace, so check the raw text.
    expect(screen.getByText(/^Java.· Updated Oct 2026$/).textContent).toBe(
      'Java\u00a0· Updated Oct 2026'
    );
  });

  it('drops the language when GitHub has none', () => {
    render(<ProjectRow repo={{ ...repo, language: null }} />, {
      locale: 'tr',
    });
    expect(screen.getByText('Güncelleme: Eki 2026')).toBeInTheDocument();
  });

  it('builds one date formatter per locale, not one per row', () => {
    const spy = vi.spyOn(Intl, 'DateTimeFormat');
    render(
      <ul>
        <ProjectRow repo={repo} />
        <ProjectRow repo={{ ...repo, name: 'other', url: repo.url + '2' }} />
      </ul>,
      { locale: 'tr' }
    );
    expect(spy.mock.calls.length).toBeLessThanOrEqual(1);
    spy.mockRestore();
  });
});
