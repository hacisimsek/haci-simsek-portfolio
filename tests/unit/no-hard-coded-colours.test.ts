// @vitest-environment node
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

// Components take colours from the theme tokens in globals.css. The only
// exception is the browser chrome colour, which must be a literal.
const ALLOWED = new Set(['components/seo/theme-color.tsx']);

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? files(path) : [path];
  });
}

describe('components', () => {
  it('use colour tokens instead of hex literals', () => {
    const offenders = files('components')
      .filter((path) => path.endsWith('.tsx') && !ALLOWED.has(path))
      .filter((path) => /#[0-9a-fA-F]{6}\b/.test(readFileSync(path, 'utf8')));
    expect(offenders).toEqual([]);
  });
});
