// Repo slugs are not titles. Words with a fixed spelling are listed here;
// everything else becomes a sentence-case phrase.
const SPELLING: Record<string, string> = {
  api: 'API',
  bff: 'BFF',
  ecommerce: 'E-commerce',
  notifyhub: 'NotifyHub',
  url: 'URL',
};

export function projectTitle(slug: string): string {
  const words = slug
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((word) => SPELLING[word.toLowerCase()] ?? word.toLowerCase());
  const [first = '', ...rest] = words;
  return [first.charAt(0).toUpperCase() + first.slice(1), ...rest].join(' ');
}
