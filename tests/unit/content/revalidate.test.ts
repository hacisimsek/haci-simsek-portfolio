// @vitest-environment node
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/font/google', () => ({
  Space_Grotesk: () => ({ variable: 'font-display' }),
  Geist: () => ({ variable: 'font-geist' }),
  Geist_Mono: () => ({ variable: 'font-geist-mono' }),
}));

describe('root layout', () => {
  it('regenerates pages daily so computed years and dates stay current', async () => {
    const layout = await import('@/app/[locale]/layout');
    expect(layout.revalidate).toBe(86400);
  });
});
