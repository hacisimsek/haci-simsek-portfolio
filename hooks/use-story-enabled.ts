'use client';

import { useSyncExternalStore } from 'react';
import { STORY_MEDIA } from '@/lib/story';

function subscribe(onChange: () => void) {
  const media = window.matchMedia(STORY_MEDIA);
  media.addEventListener('change', onChange);
  return () => media.removeEventListener('change', onChange);
}

// True where the scroll story is drawn (wide screen, fine pointer). The
// server says no, so the scroll listener only ever starts after hydration; the
// section's own visibility comes from CSS, not from this.
export function useStoryEnabled() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(STORY_MEDIA).matches,
    () => false
  );
}
