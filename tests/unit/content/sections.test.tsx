import { screen, within } from '@testing-library/react';
import { renderWithIntl as render } from '../render';
import { describe, expect, it } from 'vitest';
import Career from '@/components/Career';
import Education from '@/components/Education';
import Skills from '@/components/Skills';

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
    const group = screen
      .getByRole('heading', { name: 'Messaging and data' })
      .closest('article')!;
    expect(within(group).getByText('Kafka')).toBeInTheDocument();
  });
});
