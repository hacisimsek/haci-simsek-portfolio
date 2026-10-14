'use client';

import type { ComponentProps, PointerEvent } from 'react';
import { tiltFromPointer } from '@/lib/tilt';
import { cn } from '@/lib/utils';

function canTilt() {
  return (
    matchMedia('(hover: hover) and (pointer: fine)').matches &&
    !matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

// A link that leans towards the pointer via the .tilt CSS variables. Touch,
// keyboard and reduced-motion users get the same link without the tilt.
export default function TiltCard({
  className,
  onPointerMove,
  onPointerLeave,
  onBlur,
  ...props
}: ComponentProps<'a'>) {
  function move(event: PointerEvent<HTMLAnchorElement>) {
    onPointerMove?.(event);
    if (!canTilt()) return;
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const { rotateX, rotateY } = tiltFromPointer(
      event.clientX,
      event.clientY,
      rect
    );
    card.style.setProperty('--rx', `${rotateX}deg`);
    card.style.setProperty('--ry', `${rotateY}deg`);
    card.style.setProperty('--x', `${event.clientX - rect.left}px`);
    card.style.setProperty('--y', `${event.clientY - rect.top}px`);
  }

  function reset(card: HTMLAnchorElement) {
    card.style.removeProperty('--rx');
    card.style.removeProperty('--ry');
  }

  return (
    <a
      {...props}
      className={cn('tilt', className)}
      onPointerMove={move}
      onPointerLeave={(event) => {
        onPointerLeave?.(event);
        reset(event.currentTarget);
      }}
      onBlur={(event) => {
        onBlur?.(event);
        reset(event.currentTarget);
      }}
    />
  );
}
