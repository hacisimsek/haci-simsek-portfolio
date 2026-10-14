'use client';

import { Command as CommandIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import {
  lazy,
  Suspense,
  useEffect,
  useState,
  useSyncExternalStore,
} from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

// cmdk and the command list load on first open, not with the page.
const loadMenu = () => import('./command-menu');
const CommandMenu = lazy(loadMenu);

const subscribe = () => () => {};
const isApple = () => /Mac|iPhone|iPad/.test(navigator.userAgent);
// The server can't know the platform; it renders the neutral "Ctrl K" label
// and the client switches to ⌘K after hydration.
const notApple = () => false;

export default function CommandPalette() {
  const t = useTranslations('Command');
  const [open, setOpen] = useState(false);
  const apple = useSyncExternalStore(subscribe, isApple, notApple);

  // Warm the chunk once the page is idle so the first ⌘K opens instantly.
  useEffect(() => {
    if (!('requestIdleCallback' in window)) return;
    const id = window.requestIdleCallback(() => void loadMenu());
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
        setOpen((current) => !current);
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex h-9 items-center gap-2 rounded-full border border-input bg-background/80 px-3 text-muted-foreground transition hover:text-foreground">
        <CommandIcon aria-hidden className="h-3.5 w-3.5" />
        <span className="sr-only">{t('title')}</span>
        <kbd aria-hidden className="hidden font-mono text-xs sm:inline">
          {apple ? '⌘K' : 'Ctrl K'}
        </kbd>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="sr-only">{t('title')}</DialogTitle>
        <DialogDescription className="sr-only">
          {t('description')}
        </DialogDescription>
        <Suspense fallback={<div className="h-14" />}>
          <CommandMenu onDone={() => setOpen(false)} />
        </Suspense>
      </DialogContent>
    </Dialog>
  );
}
