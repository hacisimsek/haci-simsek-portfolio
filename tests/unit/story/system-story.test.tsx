import { act, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import SystemDiagram from '@/components/sections/system-diagram';
import HeroStory from '@/components/story/hero-story';
import StoryStage from '@/components/story/story-stage';
import SystemStory from '@/components/story/system-story';
import { renderWithIntl as render } from '../render';

describe('SystemStory', () => {
  it('reads as a heading and four steps, with the picture left to sight', () => {
    const { container } = render(<SystemStory />);
    const section = screen.getByRole('region', {
      name: 'Designed for the day something breaks.',
    });
    expect(within(section).getAllByRole('heading', { level: 3 })).toHaveLength(
      4
    );
    expect(container.querySelectorAll('[data-story-step]')).toHaveLength(4);
    // The drawing pictures the steps; screen readers get the steps.
    expect(container.querySelector('svg[data-diagram]')).toHaveAttribute(
      'aria-hidden'
    );
  });

  it('pictures the finished story where it does not scroll', () => {
    const { container } = render(<SystemStory />);
    expect(container.querySelector('svg[data-diagram]')).toHaveClass(
      'system-finished'
    );
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

  it('adds one layer per story step', () => {
    const { container } = render(<SystemDiagram />);
    expect(
      [...container.querySelectorAll('[data-at]')].map((layer) =>
        layer.getAttribute('data-at')
      )
    ).toEqual(['0', '1', '2', '3']);
  });

  // Accent is the forward flow, red the failure, purple the undo.
  it('keeps the colour rule: failure red, compensation purple', () => {
    const { container } = render(<SystemDiagram />);
    const failure = container.querySelector('[data-at="2"]')!;
    expect(
      within(failure as HTMLElement).getByText('circuit open')
    ).toHaveClass('fill-destructive');
    expect(
      within(failure as HTMLElement).getByText(/stock\.released/)
    ).toHaveClass('fill-primary');
    expect(
      container.querySelector('[data-at="1"] text')!.getAttribute('class')
    ).toContain('fill-accent');
  });
});

describe('HeroStory', () => {
  it('shares one stage between the hero and the story', () => {
    const { container } = render(<HeroStory />);
    const stage = container.querySelector('.hero-story')!;
    expect(stage.querySelector('#top')).not.toBeNull();
    expect(stage.querySelector('#story')).not.toBeNull();
    // The hero's drawing and the story's finished picture.
    expect(stage.querySelectorAll('svg[data-diagram]')).toHaveLength(2);
  });
});

describe('StoryStage and reduced motion', () => {
  // The CSS follows prefers-reduced-motion live; so must the scroll logic.
  it('drops to the still layout when reduced motion turns on', () => {
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
      const { container } = render(
        <StoryStage>
          <p>stage</p>
        </StoryStage>
      );
      const stage = container.firstElementChild as HTMLElement;
      expect(stage.dataset.step).not.toBe('still');
      reduce = true;
      act(() => listeners.forEach((fn) => fn()));
      expect(stage.dataset.step).toBe('still');
    } finally {
      window.matchMedia = original;
    }
  });
});
