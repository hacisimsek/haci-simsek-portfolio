import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
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
  it('shows the language and no bulk "updated" date', () => {
    render(<ProjectRow repo={repo} />);
    expect(screen.getByText('Java')).toBeInTheDocument();
    expect(screen.queryByText(/Updated|Oct 2026/)).toBeNull();
  });

  it('shows no meta when GitHub has no language', () => {
    const { container } = render(
      <ProjectRow repo={{ ...repo, language: null }} />,
      { locale: 'tr' }
    );
    expect(container.textContent).not.toMatch(/Güncelleme|Java/);
  });

  it('shows the authored line for a featured repo, in each language', () => {
    const flagship = {
      ...repo,
      name: 'ecommerce-microservices',
      url: 'https://github.com/hacisimsek/ecommerce-microservices',
      description: 'Supports ACID via @transactional.',
    };
    const { unmount } = render(<ProjectRow repo={flagship} />);
    expect(
      screen.getByText(/event-driven saga over Kafka/)
    ).toBeInTheDocument();
    expect(screen.queryByText(/ACID/)).toBeNull();
    unmount();
    render(<ProjectRow repo={flagship} />, { locale: 'tr' });
    expect(screen.getByText(/olay tabanlı bir saga/)).toBeInTheDocument();
  });

  it('keeps the GitHub description for other repos', () => {
    render(
      <ProjectRow
        repo={{
          ...repo,
          name: 'wordly',
          url: 'https://github.com/hacisimsek/wordly',
        }}
      />
    );
    expect(screen.getByText('Reminder platform')).toBeInTheDocument();
  });
});
