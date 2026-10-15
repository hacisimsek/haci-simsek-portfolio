'use client';

import type { ReactNode } from 'react';
import { usePathname } from '@/i18n/navigation';

// Renders its server-rendered children everywhere except on one page, e.g. the
// footer's "start a conversation" band on the contact page itself.
export default function HideOnPath({
  path,
  children,
}: {
  path: string;
  children: ReactNode;
}) {
  return usePathname() === path ? null : children;
}
