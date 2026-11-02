'use client';

import { useEffect } from 'react';

// One listener for every `.spotlight` element: it writes the pointer's
// position inside the element as --mx/--my, which the CSS glow reads.
export default function Spotlight() {
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const onMove = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const element = target.closest<HTMLElement>('.spotlight');
      if (!element) return;
      const box = element.getBoundingClientRect();
      element.style.setProperty('--mx', `${event.clientX - box.left}px`);
      element.style.setProperty('--my', `${event.clientY - box.top}px`);
    };
    document.addEventListener('pointermove', onMove, { passive: true });
    return () => document.removeEventListener('pointermove', onMove);
  }, []);
  return null;
}
