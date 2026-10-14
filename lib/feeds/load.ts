export type FeedResult<T> = { ok: true; data: T } | { ok: false };

// During `next build` a feed outage renders the error state instead of
// failing the build. At runtime the error propagates, so an ISR revalidation
// failure keeps serving the last successfully generated page.
export async function loadFeed<T>(
  load: () => Promise<T>
): Promise<FeedResult<T>> {
  try {
    return { ok: true, data: await load() };
  } catch (error) {
    if (process.env.NEXT_PHASE !== 'phase-production-build') {
      throw error;
    }
    console.error('Feed unavailable during build:', error);
    return { ok: false };
  }
}
