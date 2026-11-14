'use client';

import { useTranslations } from 'next-intl';
import { Suspense, lazy, useRef, type RefObject } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { useLenisPause } from '@/hooks/use-lenis-pause';

const CommandMenu = lazy(() => import('./command-menu'));

export default function CommandDialog({
  open,
  onOpenChange,
  returnFocusTo,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  returnFocusTo: RefObject<HTMLButtonElement | null>;
}) {
  const t = useTranslations('Command');
  const afterClose = useRef<(() => void) | undefined>(undefined);

  useLenisPause(open);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        // The trigger lives outside this lazily loaded dialog, so Radix
        // can't find it on its own.
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          returnFocusTo.current?.focus();
          const next = afterClose.current;
          afterClose.current = undefined;
          next?.();
        }}
      >
        <DialogTitle className="sr-only">{t('title')}</DialogTitle>
        <DialogDescription className="sr-only">
          {t('description')}
        </DialogDescription>
        <Suspense fallback={<div className="h-14" />}>
          <CommandMenu
            onDone={(next) => {
              afterClose.current = next;
              onOpenChange(false);
            }}
          />
        </Suspense>
      </DialogContent>
    </Dialog>
  );
}
