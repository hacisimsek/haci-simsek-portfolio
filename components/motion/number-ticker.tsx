'use client';

import { animate } from 'motion/react';
import { useEffect, useRef } from 'react';

// The server renders the final value. A ticker that starts below the fold
// counts up from zero when it scrolls into view; one already on screen keeps
// its value so nothing flashes.
export default function NumberTicker({
  value,
  locale,
}: {
  value: number;
  locale: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const format = new Intl.NumberFormat(locale);
  const formatted = format.format(value);

  useEffect(() => {
    const node = ref.current;
    if (
      !node ||
      typeof IntersectionObserver === 'undefined' ||
      matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }
    const numberFormat = new Intl.NumberFormat(locale);
    let stop: (() => void) | undefined;
    let first = true;
    const observer = new IntersectionObserver(([entry]) => {
      if (first) {
        first = false;
        if (entry.isIntersecting) {
          observer.disconnect();
          return;
        }
        node.textContent = numberFormat.format(0);
        return;
      }
      if (!entry.isIntersecting) return;
      observer.disconnect();
      stop = animate(0, value, {
        duration: 1.2,
        ease: 'easeOut',
        onUpdate: (latest) => {
          node.textContent = numberFormat.format(Math.round(latest));
        },
      }).stop;
    });
    observer.observe(node);
    return () => {
      observer.disconnect();
      stop?.();
      node.textContent = numberFormat.format(value);
    };
  }, [value, locale]);

  return (
    <>
      <span ref={ref} aria-hidden className="tabular-nums">
        {formatted}
      </span>
      <span className="sr-only">{formatted}</span>
    </>
  );
}
