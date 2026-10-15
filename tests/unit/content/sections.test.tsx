import { screen, within } from '@testing-library/react';
import { renderWithIntl as render } from '../render';
import { describe, expect, it } from 'vitest';
import Career from '@/components/sections/career';
import Education from '@/components/Education';
import Skills from '@/components/sections/skills';

describe('Career', () => {
  it('shows all five roles with their periods', () => {
    render(<Career />);
    const roles = screen.getAllByRole('article');
    expect(roles).toHaveLength(5);
    expect(
      within(roles[0]).getByText('Jan 2025 - Present')
    ).toBeInTheDocument();
    expect(
      within(roles[1]).getByText('Jun 2022 - Jan 2025')
    ).toBeInTheDocument();
    expect(
      within(roles[4]).getByRole('heading', { name: 'Project Manager' })
    ).toBeInTheDocument();
  });

  it('renders highlighted technologies in bold', () => {
    render(<Career />);
    expect(
      screen.getByText('Orion', { selector: 'strong' })
    ).toBeInTheDocument();
  });
});

describe('Career layout', () => {
  it('is titled honestly in both languages', () => {
    render(<Career />);
    expect(
      screen.getByRole('heading', { level: 2, name: "Where I've worked" })
    ).toBeInTheDocument();
    render(<Career />, { locale: 'tr' });
    expect(
      screen.getByRole('heading', { level: 2, name: 'Çalıştığım yerler' })
    ).toBeInTheDocument();
  });

  it('opens the current employer and folds earlier highlights', () => {
    render(<Career />);
    const roles = screen.getAllByRole('article');
    // Sisal (current): highlights are on the page, not folded.
    for (const role of roles.slice(0, 2)) {
      expect(role.querySelector('details')).toBeNull();
      expect(role.querySelectorAll('li').length).toBeGreaterThan(0);
    }
    // Earlier roles keep their highlights one click away.
    for (const role of roles.slice(2)) {
      const details = role.querySelector('details')!;
      expect(details).not.toBeNull();
      expect(details).not.toHaveAttribute('open');
      const summary = details.querySelector('summary')!;
      expect(summary).toHaveTextContent('What I did');
      // A visible cue that it opens, not the engine-dependent marker.
      expect(summary.querySelector('svg[aria-hidden="true"]')).not.toBeNull();
      expect(summary).toHaveClass('list-none');
    }
    // Each disclosure names its role, so they differ out of context.
    const names = roles
      .slice(2)
      .map((role) => role.querySelector('summary')!.textContent);
    expect(new Set(names).size).toBe(names.length);
    expect(names[0]).toContain('Software Engineer');
  });

  it('keeps role text to a readable measure', () => {
    render(<Career />);
    for (const role of screen.getAllByRole('article'))
      expect(role).toHaveClass('max-w-[70ch]');
  });
});

describe('Career timeline', () => {
  it('groups the Sisal promotion and labels non-employment roles', () => {
    render(<Career />);
    expect(screen.getByText('Promoted')).toBeInTheDocument();
    expect(screen.getByText('Internship')).toBeInTheDocument();
    expect(screen.getByText('Leadership')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem', { name: /./ })).toHaveLength(4);
  });
});

describe('Education', () => {
  it('shows the scholarship on the major', () => {
    render(<Education />);
    expect(screen.getByText('Full scholarship')).toBeInTheDocument();
    expect(screen.getByText('Major')).toBeInTheDocument();
    expect(screen.getByText('Minor')).toBeInTheDocument();
  });
});

describe('Skills', () => {
  it('groups the tools by category', () => {
    render(<Skills />);
    const group = screen.getByText('Messaging and data').closest('div')!;
    expect(within(group).getByText('Kafka')).toBeInTheDocument();
  });
});
