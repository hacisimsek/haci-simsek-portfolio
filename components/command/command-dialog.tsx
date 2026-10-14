'use client';

import { useTranslations } from 'next-intl';
import { Suspense, lazy, type RefObject } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        // The trigger lives outside this lazily loaded dialog, so Radix
        // can't find it on its own.
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          returnFocusTo.current?.focus();
        }}
      >
        <DialogTitle className="sr-only">{t('title')}</DialogTitle>
        <DialogDescription className="sr-only">
          {t('description')}
        </DialogDescription>
        <Suspense fallback={<div className="h-14" />}>
          <CommandMenu onDone={() => onOpenChange(false)} />
        </Suspense>
      </DialogContent>
    </Dialog>
  );
}
