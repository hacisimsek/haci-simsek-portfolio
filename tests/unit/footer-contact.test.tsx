import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Footer from '@/components/Footer';
import { renderWithIntl as render } from './render';

const path = vi.hoisted(() => ({ current: '/contact' }));

vi.mock('@/i18n/navigation', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/i18n/navigation')>()),
  usePathname: () => path.current,
}));

describe('Footer on the contact page', () => {
  it('drops the closing band that would point back to this page', () => {
    render(<Footer />);
    expect(
      screen.queryByRole('heading', { name: 'Open to the right conversation' })
    ).toBeNull();
    // The quiet bottom row stays.
    expect(screen.getByRole('link', { name: 'GitHub' })).toBeInTheDocument();
  });

  it('keeps it everywhere else', () => {
    path.current = '/projects';
    render(<Footer />);
    expect(
      screen.getByRole('heading', { name: 'Open to the right conversation' })
    ).toBeInTheDocument();
  });
});
