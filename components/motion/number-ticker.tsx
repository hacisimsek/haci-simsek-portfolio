'use client';

import { useEffect, useRef } from 'react';

const DURATION = 1200;
const easeOut = (t: number) => 1 - (1 - t) ** 3;

// The server renders the final value. A ticker that starts below the fold
// counts up from zero when it scrolls into view; one already on screen keeps
// its value so nothing flashes.
export default function NumberTicker({
  value,
  locale,
  suffix = '',
}: {
  value: number;
  locale: string;
  // Shown visually by the caller; repeated here for screen readers.
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const formatted = new Intl.NumberFormat(locale).format(value);

  useEffect(() => {
    const node = ref.current;
    if (
      !node ||
      typeof IntersectionObserver === 'undefined' ||
      matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }
    const format = new Intl.NumberFormat(locale);
    let frame = 0;
    let first = true;
    const observer = new IntersectionObserver(([entry]) => {
      if (first) {
        first = false;
        if (entry.isIntersecting) {
          observer.disconnect();
          return;
        }
        node.textContent = format.format(0);
        return;
      }
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min(1, (now - start) / DURATION);
        node.textContent = format.format(Math.round(easeOut(progress) * value));
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    });
    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      node.textContent = format.format(value);
    };
  }, [value, locale]);

  return (
    <>
      <span ref={ref} aria-hidden className="tabular-nums">
        {formatted}
      </span>
      <span className="sr-only">
        {formatted}
        {suffix}
      </span>
    </>
  );
}
