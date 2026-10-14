import type { ReactNode } from 'react';

// The real root layout lives in app/[locale]/layout.tsx. This file only exists
// so that app/not-found.tsx can handle requests outside a locale.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
