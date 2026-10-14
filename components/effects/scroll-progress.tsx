'use client';

import { useScroll, useSpring } from 'motion/react';
import * as m from 'motion/react-m';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';

export default function ScrollProgress() {
  const reduceMotion = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 40,
    restDelta: 0.001,
  });

  if (reduceMotion) return null;

  return (
    <m.div
      data-scroll-progress
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-gradient-to-r from-primary via-accent to-primary"
      style={{ scaleX }}
    />
  );
}
