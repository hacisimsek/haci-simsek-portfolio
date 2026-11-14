'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';
import { useStoryEnabled } from '@/hooks/use-story-enabled';

// Writes which story step the reader has reached onto the stage as
// data-step: "hero" before the first step, then 0..3; "still" where the story
// does not scroll. CSS does the rest. A plain rAF-throttled scroll listener,
// not motion's useScroll: that one drives scroll-timeline animations that
// never finish and keep document.getAnimations() busy.
export default function StoryStage({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const wide = useStoryEnabled();
  const reduce = usePrefersReducedMotion();
  const scrolling = wide && !reduce;

  useEffect(() => {
    const stage = ref.current;
    if (!stage) return;
    if (!scrolling) {
      stage.dataset.step = 'still';
      return;
    }
    const steps = stage.querySelectorAll<HTMLElement>('[data-story-step]');
    let frame = 0;
    const update = () => {
      frame = 0;
      // A step is reached once its top passes a little above mid-screen.
      const line = window.innerHeight * 0.55;
      let reached = -1;
      steps.forEach((step, index) => {
        if (step.getBoundingClientRect().top < line) reached = index;
      });
      stage.dataset.step = reached < 0 ? 'hero' : String(reached);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    schedule();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [scrolling]);

  return (
    <div ref={ref} data-step="hero" className={className}>
      {children}
    </div>
  );
}
