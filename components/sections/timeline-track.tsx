'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';

// The coloured line fills as the timeline passes 70% of the viewport height.
// Server and reduced motion render it full.
export default function TimelineTrack({ children }: { children: ReactNode }) {
  const track = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLDivElement>(null);
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    const line = fill.current;
    if (reduceMotion || !track.current || !line) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = track.current!.getBoundingClientRect();
      const progress = (window.innerHeight * 0.7 - rect.top) / rect.height;
      line.style.transform = `scaleY(${Math.min(1, Math.max(0, progress))})`;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      line.style.transform = '';
    };
  }, [reduceMotion]);

  return (
    <div ref={track} className="relative">
      <div
        aria-hidden
        className="absolute top-3 bottom-0 left-[11px] w-px bg-border/80 sm:left-[155px]"
      >
        <div
          ref={fill}
          data-timeline-fill
          className="h-full w-full origin-top bg-accent transition-transform duration-200 ease-out"
        />
      </div>
      {children}
    </div>
  );
}
