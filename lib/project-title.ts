// Repo slugs and Medium topic slugs are not titles. Words with a fixed spelling are listed here;
// words typed in lowercase stay lowercase (sentence case), and words the
// author capitalised, as in CamelCase names, keep their capitals.
const SPELLING: Record<string, string> = {
  ai: 'AI',
  api: 'API',
  bdd: 'BDD',
  bff: 'BFF',
  cap: 'CAP',
  ecommerce: 'E-commerce',
  http: 'HTTP',
  https: 'HTTPS',
  ios: 'iOS',
  llm: 'LLM',
  notifyhub: 'NotifyHub',
  sisal: 'Sisal',
  springboot: 'Spring Boot',
  url: 'URL',
  youtube: 'YouTube',
};

function words(slug: string): string[] {
  return slug
    .split(/[-_\s]+/)
    .flatMap((part) =>
      part
        .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
        .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
        .split(' ')
    )
    .filter(Boolean);
}

export function projectTitle(slug: string): string {
  // Whole names split across words, such as spring-boot.
  const whole = SPELLING[slug.toLowerCase().replace(/[-_\s]+/g, '')];
  if (whole) return whole;
  const [first, ...rest] = words(slug).map(
    (word) => SPELLING[word.toLowerCase()] ?? word
  );
  if (!first) return slug;
  return [first.charAt(0).toUpperCase() + first.slice(1), ...rest].join(' ');
}
