import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const lenis = { stop: vi.fn(), start: vi.fn() };
vi.mock('lenis/react', () => ({ useLenis: () => lenis }));

const { useLenisPause } = await import('@/hooks/use-lenis-pause');

function Dialog({ open }: { open: boolean }) {
  useLenisPause(open);
  return null;
}

describe('useLenisPause', () => {
  // The palette can open over the terminal; closing it must not restart
  // smooth scrolling while the terminal is still open.
  it('restarts Lenis only when the last open dialog closes', () => {
    const terminal = render(<Dialog open />);
    const palette = render(<Dialog open />);
    expect(lenis.stop).toHaveBeenCalled();

    palette.rerender(<Dialog open={false} />);
    expect(lenis.start).not.toHaveBeenCalled();

    terminal.rerender(<Dialog open={false} />);
    expect(lenis.start).toHaveBeenCalledTimes(1);
  });
});
