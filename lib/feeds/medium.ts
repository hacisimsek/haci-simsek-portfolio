import 'server-only';
import { XMLParser } from 'fast-xml-parser';
import { z } from 'zod';
import { decodeText, firstImageSrc, htmlToText, stripQuery } from './html';

export const ARTICLES_REVALIDATE = 21600;
export const ARTICLE_FALLBACK_THUMBNAIL =
  'https://cdn-images-1.medium.com/v2/resize:fit:564/0*-BkwD9DCSLszd2ag.jpg';

const IMAGE_HOSTS = ['cdn-images-1.medium.com', 'miro.medium.com'] as const;

const itemSchema = z.object({
  title: z.string(),
  link: z.url({ protocol: /^https$/ }),
  pubDate: z.string(),
  category: z.array(z.string()).default([]),
  'content:encoded': z.string().default(''),
});

const feedSchema = z.object({
  rss: z.object({
    channel: z.object({ item: z.array(itemSchema).default([]) }),
  }),
});

export interface Article {
  title: string;
  url: string;
  excerpt: string;
  categories: string[];
  thumbnail: string;
  publishedAt: string;
}

// The parser leaves entities alone; decodeText (plain-text titles) and
// htmlToText (HTML content) each decode them exactly once.
const parser = new XMLParser({
  ignoreAttributes: true,
  processEntities: false,
  parseTagValue: false,
  trimValues: true,
  isArray: (name) => name === 'item' || name === 'category',
});

export function parseMediumFeed(xml: string): Article[] {
  const feed = feedSchema.parse(parser.parse(xml));
  return feed.rss.channel.item.map((item) => {
    const html = item['content:encoded'];
    return {
      title: decodeText(item.title),
      url: stripQuery(item.link),
      excerpt: htmlToText(html),
      categories: item.category,
      thumbnail: firstImageSrc(html, IMAGE_HOSTS) ?? ARTICLE_FALLBACK_THUMBNAIL,
      publishedAt: new Date(item.pubDate).toISOString(),
    };
  });
}

export async function getArticles(): Promise<Article[]> {
  const url =
    process.env.MEDIUM_FEED_URL ?? 'https://medium.com/feed/@hacisimsek';
  const response = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (compatible; hacisimsek.com feed reader; +https://hacisimsek.com)',
      Accept: 'application/rss+xml, application/xml;q=0.9',
    },
    next: { revalidate: ARTICLES_REVALIDATE },
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) {
    throw new Error(`Medium responded ${response.status}`);
  }
  return parseMediumFeed(await response.text());
}
