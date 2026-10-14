const NAMED_ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
};

function decodeEntities(text: string): string {
  return text.replace(
    /&(#x[0-9a-f]+|#\d+|[a-z]+);/gi,
    (match, entity: string) => {
      if (entity[0] === '#') {
        const code =
          entity[1].toLowerCase() === 'x'
            ? Number.parseInt(entity.slice(2), 16)
            : Number.parseInt(entity.slice(1), 10);
        return Number.isFinite(code) && code >= 0 && code <= 0x10ffff
          ? String.fromCodePoint(code)
          : match;
      }
      return NAMED_ENTITIES[entity.toLowerCase()] ?? match;
    }
  );
}

// For fields that are plain text in the feed, such as CDATA titles: decodes
// entities without treating `<T>` as a tag.
export function decodeText(text: string): string {
  return decodeEntities(text).replace(/\s+/g, ' ').trim();
}

export function htmlToText(html: string): string {
  const withoutTags = html
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, ' ');
  return decodeEntities(withoutTags).replace(/\s+/g, ' ').trim();
}

export function firstImageSrc(
  html: string,
  allowedHosts: readonly string[]
): string | null {
  for (const match of html.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/gi)) {
    try {
      const url = new URL(decodeEntities(match[1]));
      if (url.protocol === 'https:' && allowedHosts.includes(url.hostname)) {
        return url.toString();
      }
    } catch {
      // Ignore malformed URLs.
    }
  }
  return null;
}

export function stripQuery(url: string): string {
  const parsed = new URL(url);
  parsed.search = '';
  parsed.hash = '';
  return parsed.toString();
}
