import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Career from '@/components/sections/career';
import { renderWithIntl as render } from '../render';

// The current employer is the one with an open-ended role, wherever it sits
// in the list.
vi.mock('@/content', async (importOriginal) => {
  const content = await importOriginal<typeof import('@/content')>();
  return { ...content, experience: [...content.experience].reverse() };
});

describe('Career with reordered data', () => {
  it('still opens the current employer', () => {
    render(<Career />);
    const current = screen
      .getAllByRole('article')
      .find((role) => role.textContent?.includes('Present'))!;
    expect(current.querySelector('details')).toBeNull();
  });
});
