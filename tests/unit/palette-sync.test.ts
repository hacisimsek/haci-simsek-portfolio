// @vitest-environment node
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { brand } from '@/lib/og/brand';

// CSS cannot import TypeScript, so the dark palette lives twice: the
// terminal tokens in globals.css and lib/og/brand.ts for generated images.
const css = readFileSync('app/globals.css', 'utf8');
const token = (name: string) =>
  css.match(new RegExp(`--color-${name}:\\s*(#[0-9a-f]{6})`, 'i'))?.[1];

describe('dark palette', () => {
  it('matches between globals.css and lib/og/brand.ts', () => {
    expect(token('terminal')).toBe(brand.background);
    expect(token('terminal-foreground')).toBe(brand.foreground);
    expect(token('terminal-dim')).toBe(brand.muted);
    expect(token('terminal-prompt')).toBe(brand.accent);
  });
});
