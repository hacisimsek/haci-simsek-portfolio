// @vitest-environment node
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

// Components take colours from the theme tokens in globals.css. The only
// exception is the browser chrome colour, which must be a literal.
const ALLOWED = new Set(['components/seo/theme-color.tsx']);

// Any colour literal: 3/4/6/8-digit hex or a CSS colour function.
const COLOUR =
  /#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})\b|\b(?:rgba?|hsla?|oklch|oklab)\(/i;

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? files(path) : [path];
  });
}

describe('components', () => {
  it('recognise every colour literal form', () => {
    for (const sample of [
      '#fff',
      '#ffff',
      '#ff5f57',
      '#ff5f57aa',
      'rgb(0 0 0)',
      'hsl(1 2% 3%)',
      'oklch(0.5 0.1 200)',
    ]) {
      expect(COLOUR.test(sample), sample).toBe(true);
    }
    expect(COLOUR.test('bg-terminal text-foreground')).toBe(false);
  });

  it('use colour tokens instead of hex literals', () => {
    const offenders = files('components')
      .filter((path) => path.endsWith('.tsx') && !ALLOWED.has(path))
      .filter((path) => COLOUR.test(readFileSync(path, 'utf8')));
    expect(offenders).toEqual([]);
  });
});
