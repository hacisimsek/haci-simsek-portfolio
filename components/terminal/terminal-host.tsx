'use client';

import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { TERMINAL_OPEN_EVENT } from '@/lib/terminal/open';

const loadDialog = () => import('./terminal-dialog');
const TerminalDialog = lazy(loadDialog);

// Always mounted, tiny: waits for openTerminal() and loads the dialog on
// first use. Focus goes back to whatever was focused when it opened.
export default function TerminalHost() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const opener = useRef<HTMLElement | null>(null);

  useEffect(() => {
    function onOpen() {
      opener.current =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;
      setMounted(true);
      setOpen(true);
    }
    window.addEventListener(TERMINAL_OPEN_EVENT, onOpen);
    return () => window.removeEventListener(TERMINAL_OPEN_EVENT, onOpen);
  }, []);

  if (!mounted) return null;
  return (
    <Suspense fallback={null}>
      <TerminalDialog
        open={open}
        onOpenChange={setOpen}
        returnFocusTo={opener}
      />
    </Suspense>
  );
}
