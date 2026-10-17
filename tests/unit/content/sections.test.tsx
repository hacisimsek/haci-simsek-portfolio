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
      within(roles[0]).getByText('Jan 2025 – Present')
    ).toBeInTheDocument();
    expect(
      within(roles[1]).getByText('Jun 2022 – Jan 2025')
    ).toBeInTheDocument();
    expect(
      within(roles[4]).getByRole('heading', { name: 'Project Manager' })
    ).toBeInTheDocument();
  });

  it('renders highlighted technologies in bold', () => {
    render(<Career />);
    expect(
      screen.getAllByText('Java 21', { selector: 'strong' })[0]
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

  it('opens the current role and folds earlier highlights', () => {
    render(<Career />);
    const roles = screen.getAllByRole('article');
    // Only the current role is open; even the earlier Sisal role folds.
    expect(roles[0].querySelector('details')).toBeNull();
    expect(roles[0].querySelectorAll('li').length).toBeGreaterThan(0);
    // Earlier roles keep their highlights one click away.
    for (const role of roles.slice(1)) {
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

describe('Career typography', () => {
  it('names the Nuevo clients in the summary, not only in the fold', () => {
    for (const locale of ['en', 'tr'] as const) {
      const { unmount } = render(<Career />, { locale });
      const nuevo = screen.getByRole('listitem', {
        name: 'Nuevo Software House',
      });
      const summary = [...nuevo.querySelectorAll('p')].find(
        (p) => !p.closest('details') && /Türk Petrol/.test(p.textContent ?? '')
      );
      expect(summary?.textContent).toMatch(/AvivaSA.*Kordsa.*Tavuk Dünyası/);
      unmount();
    }
  });

  it('sets every role summary at 15px', () => {
    render(<Career />);
    for (const role of screen.getAllByRole('article'))
      expect(role.querySelector('p[class*="text-[0.9375rem]"]')).not.toBeNull();
  });

  it('does not repeat the company period on a single-role company', () => {
    render(<Career />);
    const telenity = screen.getByRole('listitem', { name: 'Telenity' });
    expect(telenity.textContent!.split('Jun 2021 – Aug 2021')).toHaveLength(2);
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

  it('lists the certification and languages after the degrees', () => {
    render(<Education />);
    const certification = screen.getByText('Certification', { selector: 'dt' });
    expect(certification.nextElementSibling).toHaveTextContent(
      'Advanced Java Programming (TDD)'
    );
    const languages = screen.getByText('Languages', { selector: 'dt' });
    expect(languages.nextElementSibling).toHaveTextContent(
      'Turkish (native) · English (B2)'
    );
    render(<Education />, { locale: 'tr' });
    expect(
      screen.getByText('Sertifika', { selector: 'dt' })
    ).toBeInTheDocument();
    expect(
      screen.getByText('Diller', { selector: 'dt' }).nextElementSibling
    ).toHaveTextContent('Türkçe (anadil) · İngilizce (B2)');
  });
});

describe('Skills', () => {
  it('groups the tools by category', () => {
    render(<Skills />);
    const group = screen.getByText('Messaging and databases').closest('div')!;
    expect(within(group).getByText('Kafka')).toBeInTheDocument();
    expect(within(group).getByText('MongoDB')).toBeInTheDocument();
    const testing = screen.getByText('Testing and quality').closest('div')!;
    expect(within(testing).getByText('JUnit 5')).toBeInTheDocument();
  });
});
