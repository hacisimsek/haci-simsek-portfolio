'use client';

import { AnimatePresence, m } from 'motion/react';
import { useEffect, useState } from 'react';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';

// Visual only: callers expose the full list to assistive tech separately.
export default function WordRotate({
  words,
  interval = 2800,
}: {
  words: string[];
  interval?: number;
}) {
  const reduceMotion = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduceMotion || words.length < 2) return;
    const timer = window.setInterval(
      () => setIndex((current) => (current + 1) % words.length),
      interval
    );
    return () => window.clearInterval(timer);
  }, [reduceMotion, words.length, interval]);

  return (
    <span aria-hidden className="relative inline-grid">
      <AnimatePresence mode="wait" initial={false}>
        <m.span
          key={index}
          initial={{ opacity: 0, y: '0.4em' }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: '-0.4em' }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          {words[index]}
        </m.span>
      </AnimatePresence>
    </span>
  );
}
