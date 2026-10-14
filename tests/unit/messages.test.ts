// @vitest-environment node
import { describe, expect, it } from 'vitest';
import en from '../../messages/en.json';
import tr from '../../messages/tr.json';

function flatten(value: unknown, prefix = ''): Record<string, string> {
  if (typeof value === 'string') return { [prefix]: value };
  return Object.entries(value as Record<string, unknown>).reduce(
    (all, [key, child]) => ({
      ...all,
      ...flatten(child, prefix ? `${prefix}.${key}` : key),
    }),
    {}
  );
}

describe('messages', () => {
  it('have the same keys in English and Turkish', () => {
    expect(Object.keys(flatten(tr)).sort()).toEqual(
      Object.keys(flatten(en)).sort()
    );
  });

  it('have no empty strings', () => {
    for (const messages of [en, tr]) {
      for (const [key, text] of Object.entries(flatten(messages))) {
        expect(text.trim(), key).not.toBe('');
      }
    }
  });

  it('use the same placeholders in both languages', () => {
    const placeholders = (text: string) =>
      (text.match(/\{\w+\}/g) ?? []).sort();
    const flatTr = flatten(tr);
    for (const [key, text] of Object.entries(flatten(en))) {
      expect(placeholders(flatTr[key] ?? ''), key).toEqual(placeholders(text));
    }
  });
});

describe('Turkish metadata', () => {
  it('puts the possessive on a Turkish noun, not on the name', () => {
    expect(tr.Metadata.description.startsWith('{name} portfolyosu')).toBe(
      false
    );
    expect(tr.Metadata.description).toMatch(/mühendisinin portfolyosu\.$/);
  });
});
