'use client';

import { ReactLenis, useLenis } from 'lenis/react';
import { useEffect } from 'react';
import { usePathname } from '@/i18n/navigation';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';

function ResetOnNavigate() {
  const lenis = useLenis();
  const pathname = usePathname();

  useEffect(() => {
    lenis?.scrollTo(0, { immediate: true });
  }, [lenis, pathname]);

  return null;
}

// Lenis runs on the root scroller, so it renders next to the page rather than
// wrapping it; toggling it never remounts the content.
export default function SmoothScroll() {
  const reduceMotion = usePrefersReducedMotion();
  if (reduceMotion) return null;

  return (
    <ReactLenis root options={{ lerp: 0.1, anchors: true }}>
      <ResetOnNavigate />
    </ReactLenis>
  );
}
