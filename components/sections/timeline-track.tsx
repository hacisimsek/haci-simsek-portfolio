'use client';

import { m, useScroll, useSpring } from 'motion/react';
import { useRef, type ReactNode } from 'react';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';

// The coloured line fills as the timeline scrolls past the middle of the
// viewport. Server and reduced motion render it full.
export default function TimelineTrack({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 70%', 'end 70%'],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <div ref={ref} className="relative">
      <div
        aria-hidden
        className="absolute top-3 bottom-0 left-[11px] w-px bg-border/80 sm:left-[155px]"
      >
        <m.div
          data-timeline-fill
          className="h-full w-full origin-top bg-gradient-to-b from-primary via-accent to-primary"
          style={reduceMotion ? undefined : { scaleY: progress }}
        />
      </div>
      {children}
    </div>
  );
}
