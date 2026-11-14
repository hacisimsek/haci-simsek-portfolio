'use client';

import { useTranslations } from 'next-intl';
import { useId, useState } from 'react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

// A group whose marked items are hidden on phones until one button opens them.
// Items mark themselves with the literal class
//   max-md:group-data-[open=false]/fold:hidden
// (a literal, so Tailwind finds it); from md up nothing folds and the button
// is gone.
export default function Fold({
  hidden,
  more,
  className,
  children,
}: {
  /** How many items are folded, for the button's label. */
  hidden: number;
  /** A label for the closed button when a count would read oddly. */
  more?: string;
  className?: string;
  children: ReactNode;
}) {
  const msg = useTranslations('Fold');
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <div id={id} data-open={open} className={cn('group/fold', className)}>
      {children}
      {hidden > 0 ? (
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen(!open)}
          className="mt-2 inline-flex min-h-11 items-center text-sm font-medium text-foreground hover:text-accent md:hidden"
        >
          {open ? msg('less') : (more ?? msg('more', { count: hidden }))}
        </button>
      ) : null}
    </div>
  );
}
