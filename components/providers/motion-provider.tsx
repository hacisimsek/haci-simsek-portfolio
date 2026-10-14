'use client';

import { LazyMotion, MotionConfig } from 'motion/react';
import type { ReactNode } from 'react';

// Animation features arrive in their own chunk after hydration; `m.*`
// components render statically until then.
const loadFeatures = () =>
  import('@/lib/motion-features').then((module) => module.default);

export default function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
