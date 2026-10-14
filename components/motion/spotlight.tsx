'use client';

import type { ComponentProps, PointerEvent } from 'react';
import { cn } from '@/lib/utils';

// Feeds the pointer position to the .spotlight gradient. CSS only paints it
// for fine pointers, so touch devices never see a stuck highlight.
export default function Spotlight({
  className,
  ...props
}: ComponentProps<'div'>) {
  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty(
      '--x',
      `${event.clientX - rect.left}px`
    );
    event.currentTarget.style.setProperty(
      '--y',
      `${event.clientY - rect.top}px`
    );
  }

  return (
    <div
      onPointerMove={onPointerMove}
      className={cn('spotlight', className)}
      {...props}
    />
  );
}
