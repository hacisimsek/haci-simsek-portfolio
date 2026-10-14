// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { splitGraphemes } from '@/lib/split-text';

describe('splitGraphemes', () => {
  it('keeps Turkish letters and combining marks whole', () => {
    expect(splitGraphemes('Hacı Şimşek')).toEqual([
      'H',
      'a',
      'c',
      'ı',
      ' ',
      'Ş',
      'i',
      'm',
      'ş',
      'e',
      'k',
    ]);
    expect(splitGraphemes('İ̇x')).toEqual(['İ̇', 'x']);
  });
});
