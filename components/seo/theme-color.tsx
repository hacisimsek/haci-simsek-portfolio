'use client';

import { useTheme } from 'next-themes';
import { useEffect } from 'react';
import { brand } from '@/lib/og/brand';

// --background in sRGB for the light theme; dark comes from brand.background.
const LIGHT = '#f9fafd';

// The site defaults to dark regardless of the OS, so the browser chrome
// follows the theme the page actually shows rather than prefers-color-scheme.
export default function ThemeColor() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!resolvedTheme) return;
    const meta = document.querySelector('meta[name="theme-color"]');
    meta?.setAttribute(
      'content',
      resolvedTheme === 'light' ? LIGHT : brand.background
    );
  }, [resolvedTheme]);

  return null;
}
