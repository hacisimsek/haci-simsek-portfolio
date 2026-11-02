// @vitest-environment node
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { STORY_MEDIA } from '@/lib/story';

// CSS decides whether the story pins and scrolls; useStoryEnabled decides
// whether to follow the scroll. Both must use the same query.
describe('story media query', () => {
  it('matches between globals.css and lib/story.ts', () => {
    const css = readFileSync('app/globals.css', 'utf8');
    expect(css).toContain(
      `@media ${STORY_MEDIA} and (prefers-reduced-motion: no-preference) {`
    );
  });
});
