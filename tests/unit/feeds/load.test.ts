// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest';
import { loadFeed } from '@/lib/feeds/load';

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe('loadFeed', () => {
  it('returns the data when loading succeeds', async () => {
    await expect(loadFeed(async () => [1, 2])).resolves.toEqual({
      ok: true,
      data: [1, 2],
    });
  });

  it('falls back to the error state while building', async () => {
    vi.stubEnv('NEXT_PHASE', 'phase-production-build');
    vi.spyOn(console, 'error').mockImplementation(() => {});
    await expect(
      loadFeed(async () => {
        throw new Error('down');
      })
    ).resolves.toEqual({ ok: false });
  });

  it('rethrows at runtime so ISR keeps the last good page', async () => {
    await expect(
      loadFeed(async () => {
        throw new Error('down');
      })
    ).rejects.toThrow('down');
  });
});
