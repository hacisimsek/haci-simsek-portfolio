'use client';

import { ReactLenis, useLenis } from 'lenis/react';
import { useEffect, useRef } from 'react';
import { usePathname } from '@/i18n/navigation';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';

function ResetOnNavigate() {
  const lenis = useLenis();
  const pathname = usePathname();
  const previous = useRef(pathname);

  // Only on real route changes: running on mount would undo the browser's
  // scroll restoration after a reload. Hash links (/#about) scroll to their
  // section instead.
  useEffect(() => {
    if (previous.current === pathname) return;
    previous.current = pathname;
    if (window.location.hash) return;
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
    <ReactLenis root options={{ lerp: 0.1 }}>
      <ResetOnNavigate />
    </ReactLenis>
  );
}
