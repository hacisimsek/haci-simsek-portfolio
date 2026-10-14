// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { fold } from '@/lib/fold';

describe('fold', () => {
  it('drops Turkish diacritics and dotted/dotless i', () => {
    expect(fold('İletişim')).toBe('iletisim');
    expect(fold('ŞİMŞEK')).toBe('simsek');
    expect(fold('Yazılar')).toBe('yazilar');
    expect(fold('Görünüm ÇĞÖÜ')).toBe('gorunum cgou');
  });

  it('lowercases plain English text without changing letters', () => {
    expect(fold('INFO Projects')).toBe('info projects');
  });
});
