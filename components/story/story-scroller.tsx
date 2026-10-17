'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';
import { useStoryEnabled } from '@/hooks/use-story-enabled';
import { progress, storyAt, toVars } from '@/lib/story';

// Turns the scroll position into the scene's custom properties. No
// transitions, keyframes or scroll timelines: the scene is exactly where the
// scroll says, and still when the page is.
export default function StoryScroller({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const enabled = useStoryEnabled();
  // Reduced motion keeps the window facing the visitor; the terminal still
  // fills as the page scrolls.
  const still = usePrefersReducedMotion();

  useEffect(() => {
    const track = root.current?.firstElementChild;
    const scene = track?.querySelector<HTMLElement>('[data-story-scene]');
    if (!enabled || !track || !scene) return;
    const section = track.closest('section') ?? track;
    const counter = scene.querySelector('[data-story-migrated]');
    let frame = 0;
    let listening = false;

    const update = () => {
      frame = 0;
      const rect = track.getBoundingClientRect();
      const story = storyAt(
        progress(rect.top, rect.height, window.innerHeight),
        still
      );
      for (const [name, value] of Object.entries(toVars(story))) {
        scene.style.setProperty(name, value);
      }
      const act = `${story.act}`;
      if (section.getAttribute('data-act') !== act) {
        section.setAttribute('data-act', act);
      }
      const migrated = `${Math.round(story.migrated)}`;
      if (counter && counter.textContent !== migrated) {
        counter.textContent = migrated;
      }
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    // Listen only while the story is on or near the screen.
    const listen = (on: boolean) => {
      if (on === listening) return;
      listening = on;
      if (on) {
        window.addEventListener('scroll', schedule, { passive: true });
        schedule();
      } else {
        window.removeEventListener('scroll', schedule);
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => listen(entry.isIntersecting),
      { rootMargin: '50% 0px' }
    );
    observer.observe(track);
    window.addEventListener('resize', schedule);
    update();

    return () => {
      observer.disconnect();
      listen(false);
      window.removeEventListener('resize', schedule);
      cancelAnimationFrame(frame);
    };
  }, [enabled, still]);

  return <div ref={root}>{children}</div>;
}
