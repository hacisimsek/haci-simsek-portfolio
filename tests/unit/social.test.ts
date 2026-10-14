// @vitest-environment node
import { describe, expect, it } from 'vitest';
import type { Social } from '@/content';
import { xHandle } from '@/lib/social';

const x = (href: string): Social => ({ id: 'x', label: 'X', href });

describe('xHandle', () => {
  it('turns the X profile URL into an @handle', () => {
    expect(xHandle([x('https://x.com/CodeWithHaci')])).toBe('@CodeWithHaci');
    expect(xHandle([x('https://x.com/CodeWithHaci/')])).toBe('@CodeWithHaci');
  });

  it('is undefined without an X profile', () => {
    expect(
      xHandle([{ id: 'github', label: 'GitHub', href: 'https://github.com/a' }])
    ).toBeUndefined();
  });
});
