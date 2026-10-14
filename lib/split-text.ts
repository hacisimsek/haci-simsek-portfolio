const segmenter = new Intl.Segmenter('tr', { granularity: 'grapheme' });

// Grapheme clusters, so "İ" with a combining dot or "ş" never splits.
export function splitGraphemes(text: string): string[] {
  return Array.from(segmenter.segment(text), (part) => part.segment);
}
