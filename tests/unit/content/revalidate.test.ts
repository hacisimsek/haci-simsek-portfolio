// @vitest-environment node
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/font/google', () => ({
  Space_Grotesk: () => ({ variable: 'font-display' }),
  JetBrains_Mono: () => ({ variable: 'font-mono' }),
}));

describe('root layout', () => {
  it('regenerates pages daily so computed years and dates stay current', async () => {
    const layout = await import('@/app/layout');
    expect(layout.revalidate).toBe(86400);
  });
});
