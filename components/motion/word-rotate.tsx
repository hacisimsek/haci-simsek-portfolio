'use client';

import { useEffect, useState } from 'react';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';

// Visual only: callers expose the full list to assistive tech separately.
// Each word remounts (new key) and replays the CSS .word-in animation.
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
    <span aria-hidden className="inline-block">
      <span key={index} className={index > 0 ? 'word-in inline-block' : ''}>
        {words[index]}
      </span>
    </span>
  );
}
