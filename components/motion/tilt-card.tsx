'use client';

import { m, useSpring } from 'motion/react';
import type { ComponentProps, PointerEvent } from 'react';
import { tiltFromPointer } from '@/lib/tilt';

const spring = { stiffness: 220, damping: 22 };

function canTilt() {
  return (
    matchMedia('(hover: hover) and (pointer: fine)').matches &&
    !matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

// A link that leans towards the pointer. Touch, keyboard and reduced-motion
// users get the same link without the tilt.
export default function TiltCard({
  style,
  onPointerMove,
  onPointerLeave,
  onBlur,
  ...props
}: ComponentProps<typeof m.a>) {
  const rotateX = useSpring(0, spring);
  const rotateY = useSpring(0, spring);

  function move(event: PointerEvent<HTMLAnchorElement>) {
    onPointerMove?.(event);
    if (!canTilt()) return;
    const tilt = tiltFromPointer(
      event.clientX,
      event.clientY,
      event.currentTarget.getBoundingClientRect()
    );
    rotateX.set(tilt.rotateX);
    rotateY.set(tilt.rotateY);
    event.currentTarget.style.setProperty(
      '--x',
      `${event.clientX - event.currentTarget.getBoundingClientRect().left}px`
    );
    event.currentTarget.style.setProperty(
      '--y',
      `${event.clientY - event.currentTarget.getBoundingClientRect().top}px`
    );
  }

  function reset() {
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <m.a
      {...props}
      style={{ ...style, rotateX, rotateY, transformPerspective: 900 }}
      onPointerMove={move}
      onPointerLeave={(event) => {
        onPointerLeave?.(event);
        reset();
      }}
      onBlur={(event) => {
        onBlur?.(event);
        reset();
      }}
    />
  );
}
