'use client';

import { useLenis } from 'lenis/react';
import { useEffect } from 'react';

// Lenis ignores a dialog's scroll lock, so dialogs pause it while open. They
// can stack (the palette over the terminal), so it restarts only when the last
// one closes.
let paused = 0;

export function useLenisPause(active: boolean) {
  const lenis = useLenis();
  useEffect(() => {
    if (!active || !lenis) return;
    paused += 1;
    lenis.stop();
    return () => {
      paused -= 1;
      if (paused === 0) lenis.start();
    };
  }, [active, lenis]);
}
