'use client';

import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import {
  lazy,
  Suspense,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';

// The dialog, cmdk and the command list load on first use, not with the page.
const loadDialog = () => import('./command-dialog');
const loadMenu = () => import('./command-menu');
const CommandDialog = lazy(loadDialog);

const subscribe = () => () => {};
const isApple = () => /Mac|iPhone|iPad/.test(navigator.userAgent);
// The server can't know the platform; it renders the neutral "Ctrl K" label
// and the client switches to ⌘K after hydration.
const notApple = () => false;

export default function CommandPalette() {
  const t = useTranslations('Command');
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const apple = useSyncExternalStore(subscribe, isApple, notApple);

  function toggle(next: boolean) {
    if (next) setMounted(true);
    setOpen(next);
  }

  // Warm the chunks once the page is idle so the first ⌘K opens instantly.
  useEffect(() => {
    if (!('requestIdleCallback' in window)) return;
    const id = window.requestIdleCallback(() => {
      void loadDialog();
      void loadMenu();
    });
    return () => window.cancelIdleCallback(id);
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (
        event.key.toLowerCase() === 'k' &&
        (event.metaKey || event.ctrlKey) &&
        !event.altKey &&
        !event.shiftKey
      ) {
        event.preventDefault();
        setMounted(true);
        setOpen((current) => !current);
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <>
      <button
        ref={trigger}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => toggle(true)}
        className="inline-flex h-9 items-center gap-2 rounded-full border border-input bg-background/80 px-3 text-muted-foreground transition hover:text-foreground"
      >
        <Search aria-hidden className="h-3.5 w-3.5" />
        <span className="sr-only">{t('title')}</span>
        <kbd aria-hidden className="hidden font-mono text-xs sm:inline">
          {apple ? '⌘K' : 'Ctrl K'}
        </kbd>
      </button>
      {mounted && (
        <Suspense fallback={null}>
          <CommandDialog
            open={open}
            onOpenChange={toggle}
            returnFocusTo={trigger}
          />
        </Suspense>
      )}
    </>
  );
}
