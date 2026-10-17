import { act, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import RequestStory from '@/components/story/request-story';
import { STORY_MEDIA } from '@/lib/story';
import { renderWithIntl as render } from '../render';

function storyPlays({ reduceMotion = false } = {}) {
  vi.spyOn(window, 'matchMedia').mockImplementation(
    (query) =>
      ({
        matches:
          query === STORY_MEDIA ||
          (reduceMotion && query === '(prefers-reduced-motion: reduce)'),
        media: query,
        addEventListener() {},
        removeEventListener() {},
      }) as unknown as MediaQueryList
  );
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      constructor(private callback: IntersectionObserverCallback) {}
      observe() {
        this.callback(
          [{ isIntersecting: true } as IntersectionObserverEntry],
          this as unknown as IntersectionObserver
        );
      }
      disconnect() {}
    }
  );
}

// Every box reports the same rect; the scroller reads the track's top.
function trackTop(top: number) {
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
    top,
    height: 4000,
    width: 800,
    left: 0,
    right: 800,
    bottom: top + 4000,
    x: 0,
    y: top,
    toJSON() {},
  });
}

async function scrollTo(p: number) {
  trackTop(-p * (4000 - window.innerHeight));
  await act(async () => {
    window.dispatchEvent(new Event('scroll'));
    await new Promise((resolve) => requestAnimationFrame(resolve));
  });
}

const scene = () => document.querySelector<HTMLElement>('[data-story-scene]')!;
const vars = (...names: string[]) =>
  names.map((name) => scene().style.getPropertyValue(name));

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('RequestStory', () => {
  it('is a section named by its headline, in both languages', () => {
    const { unmount } = render(<RequestStory />);
    expect(
      screen.getByRole('region', {
        name: 'Every upgrade starts with one command.',
      })
    ).toBeInTheDocument();
    expect(screen.getByText(/the migration I ran at Sisal/)).toHaveClass(
      'sr-only'
    );
    unmount();
    render(<RequestStory />, { locale: 'tr' });
    expect(
      screen.getByRole('region', {
        name: 'Her büyük geçiş tek bir komutla başlar.',
      })
    ).toBeInTheDocument();
  });

  it('is drawn everywhere; the CSS picks the scroll or the still layout', () => {
    render(<RequestStory />);
    expect(document.querySelector('#story')).not.toHaveClass('hidden');
  });

  it('keeps the terminal decorative and apart from the hero saga', () => {
    render(<RequestStory />);
    const window = document.querySelector('.story-camera')!;
    expect(window).toHaveAttribute('aria-hidden', 'true');
    expect(window.querySelector('a, button, input, [tabindex]')).toBeNull();
    expect(scene().querySelector('figure, .saga-pulse')).toBeNull();
    // The terminal tells the migration; the saga stays in the hero.
    expect(scene().textContent).not.toMatch(/PaymentFailed|compensated/);
  });

  it('starts with the headline and an empty terminal before any script runs', () => {
    render(<RequestStory />);
    expect(vars('--headline', '--lines', '--outro')).toEqual(['1', '0', '0']);
    expect(document.querySelector('#story')).toHaveAttribute('data-act', '0');
  });

  it('leaves the scene alone where the story does not play', async () => {
    render(<RequestStory />);
    await scrollTo(0.5);
    expect(vars('--lines')).toEqual(['0']);
  });

  it('follows the scroll: turns, types and counts the migration', async () => {
    storyPlays();
    render(<RequestStory />);

    await scrollTo(0.5);
    expect(document.querySelector('#story')).toHaveAttribute('data-act', '1');
    expect(vars('--rx')).toEqual(['0deg']);
    expect(Number(vars('--lines')[0])).toBeGreaterThan(0);

    await scrollTo(1);
    expect(document.querySelector('#story')).toHaveAttribute('data-act', '2');
    expect(document.querySelector('[data-story-migrated]')).toHaveTextContent(
      '30+'
    );
  });

  it('leaves the still layout alone with reduced motion', async () => {
    storyPlays({ reduceMotion: true });
    render(<RequestStory />);
    await scrollTo(0.5);
    // Nothing follows the scroll; the CSS shows the finished run.
    expect(vars('--lines')).toEqual(['0']);
    expect(document.querySelector('[data-story-migrated]')).toHaveTextContent(
      '30+'
    );
  });

  it('stops listening once unmounted', () => {
    storyPlays();
    const { unmount } = render(<RequestStory />);
    const remove = vi.spyOn(window, 'removeEventListener');
    unmount();
    expect(remove).toHaveBeenCalledWith('scroll', expect.any(Function));
  });
});
