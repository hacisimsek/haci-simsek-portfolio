// @vitest-environment node
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { STORY_MEDIA } from '@/lib/story';

// CSS decides whether the story is drawn; the scroller decides whether to
// listen. Both must use the same query.
describe('story media query', () => {
  it('matches between globals.css and lib/story.ts', () => {
    const css = readFileSync('app/globals.css', 'utf8');
    const variant = css.match(/@custom-variant story \(@media (.+)\);/)?.[1];
    expect(variant).toBe(STORY_MEDIA);
  });

  it('lights the story with the accent only: purple means undo', () => {
    const css = readFileSync('app/globals.css', 'utf8');
    const glow = css.match(/\.story-glow \{[^}]*\}/)?.[0] ?? '';
    expect(glow).toContain('--accent');
    expect(glow).not.toContain('--primary');
  });
});
