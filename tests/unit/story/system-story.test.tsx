import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import SystemStory from '@/components/story/system-story';
import SystemDiagram from '@/components/sections/system-diagram';
import { renderWithIntl as render } from '../render';

describe('SystemStory', () => {
  it('reads as a heading and four steps, with the panel left to sight', () => {
    const { container } = render(<SystemStory />);
    const section = screen.getByRole('region', {
      name: 'Designed for the day something breaks.',
    });
    expect(within(section).getAllByRole('heading', { level: 3 })).toHaveLength(
      4
    );
    // The Kafka panel pictures the steps; screen readers get the steps.
    const panel = container.querySelector('div.font-mono[aria-hidden="true"]');
    expect(panel).toHaveTextContent('orders');
  });

  it('shows the finished state where it does not scroll', () => {
    const { container } = render(<SystemStory />);
    // jsdom matches no media query, so this is the phone and reduced-motion
    // layout: every event written, the failure and the undo in their colours.
    expect(screen.getByRole('region')).toHaveAttribute('data-step', 'still');
    expect(container.querySelector('[data-event="1049"]')).toHaveClass(
      'border-destructive'
    );
    expect(screen.getByText(/stock\.released/)).toHaveClass('text-primary');
  });

  it('is translated', () => {
    render(<SystemStory />, { locale: 'tr' });
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Bir şeylerin bozulacağı gün için tasarlandı.',
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /Hatanın bir planı var/ })
    ).toBeInTheDocument();
  });
});

describe('SystemDiagram', () => {
  it('is decoration only', () => {
    const { container } = render(<SystemDiagram />);
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden');
  });
});

describe('SystemStory and reduced motion', () => {
  // The CSS pin follows prefers-reduced-motion live; so must the scroll logic.
  it('drops to the still layout when reduced motion turns on', async () => {
    const { act } = await import('@testing-library/react');
    const { vi } = await import('vitest');
    let reduce = false;
    const listeners = new Set<() => void>();
    const original = window.matchMedia;
    window.matchMedia = vi.fn((query: string) => ({
      matches: query.includes('reduce') ? reduce : true,
      media: query,
      onchange: null,
      addEventListener: (_: string, fn: () => void) => listeners.add(fn),
      removeEventListener: (_: string, fn: () => void) => listeners.delete(fn),
      addListener: (fn: () => void) => listeners.add(fn),
      removeListener: (fn: () => void) => listeners.delete(fn),
      dispatchEvent: () => true,
    })) as unknown as typeof window.matchMedia;
    try {
      render(<SystemStory />);
      expect(screen.getByRole('region')).not.toHaveAttribute(
        'data-step',
        'still'
      );
      reduce = true;
      act(() => listeners.forEach((fn) => fn()));
      expect(screen.getByRole('region')).toHaveAttribute('data-step', 'still');
    } finally {
      window.matchMedia = original;
    }
  });
});
