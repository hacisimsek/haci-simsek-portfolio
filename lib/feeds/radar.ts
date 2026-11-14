import 'server-only';
import { XMLParser } from 'fast-xml-parser';
import { z } from 'zod';
import { decodeText } from './html';

// The radar: what is rising in AI and on GitHub, from free public APIs. The
// server fetches and caches it, so visitors never hit the sources directly.
export const RADAR_REVALIDATE = 1800;

export type RadarSource =
  'github' | 'hn' | 'hf' | 'devto' | 'lobsters' | 'simon';
export type RadarKind = 'repo' | 'news' | 'paper' | 'post';

export interface RadarItem {
  id: string;
  source: RadarSource;
  kind: RadarKind;
  title: string;
  url: string;
  summary: string;
  publishedAt: string;
  /** Position in its source's own ranking, 0 = top. */
  rank: number;
  stars?: number;
  language?: string | null;
  points?: number;
  comments?: number;
  /** Where people talk about it, when that differs from the link. */
  discussion?: string;
  by?: string;
  /** A small square mark: the author's avatar or the linked site's icon. */
  icon: string;
  /** A wide picture, for the sources that have one. */
  image?: string;
}

const https = z.url({ protocol: /^https$/ });
const iso = (value: string) => new Date(value).toISOString();
// The site's own icon; next/image fetches it server side, so visitors never
// ask Google themselves.
const siteIcon = (url: string) =>
  `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=64`;
const httpsOr = (value: string | null | undefined) =>
  https.safeParse(value).success ? value! : undefined;
const days = (n: number) => Date.now() - n * 86_400_000;

const githubSchema = z.object({
  items: z.array(
    z.object({
      full_name: z.string(),
      html_url: https,
      description: z.string().nullable(),
      language: z.string().nullable(),
      stargazers_count: z.number(),
      created_at: z.string(),
    })
  ),
});

// The radar shows under the owner's name, so repositories built to get around
// paid plans or identity checks stay off it.
// shortcut: a keyword list misses renamed tools; add words as they turn up.
const UNWANTED =
  /zero.?cost|sheerid|keygen|jailbreak|bypass|crack(ed|er)?(?![a-z])|license.?key|free.?(pro|premium|plus|trial)/i;
// Chinese, Japanese and Korean scripts; the pages are English and Turkish.
const CJK = /[\u3040-\u30ff\u3400-\u9fff\uac00-\ud7af]/;

export function parseGithub(payload: unknown): RadarItem[] {
  return githubSchema
    .parse(payload)
    .items.filter(
      (repo) => !UNWANTED.test(`${repo.full_name} ${repo.description ?? ''}`)
    )
    .map((repo, rank) => ({
      id: `github:${repo.full_name}`,
      source: 'github',
      kind: 'repo',
      title: repo.full_name,
      url: repo.html_url,
      summary:
        repo.description && !CJK.test(repo.description)
          ? repo.description.trim()
          : '',
      publishedAt: iso(repo.created_at),
      rank,
      stars: repo.stargazers_count,
      language: repo.language,
      icon: `https://avatars.githubusercontent.com/${repo.full_name.split('/')[0]}?s=64`,
      image: `https://opengraph.githubassets.com/1/${repo.full_name}`,
    }));
}

const hnSchema = z.object({
  hits: z.array(
    z.object({
      objectID: z.string(),
      title: z.string(),
      url: z.string().nullable().optional(),
      points: z.number(),
      num_comments: z.number().nullable().optional(),
      author: z.string(),
      created_at: z.string(),
    })
  ),
});

export function parseHn(payload: unknown): RadarItem[] {
  return hnSchema
    .parse(payload)
    .hits.sort((a, b) => b.points - a.points)
    .map((story, rank) => {
      const thread = `https://news.ycombinator.com/item?id=${story.objectID}`;
      const url = https.safeParse(story.url).success ? story.url! : thread;
      return {
        id: `hn:${story.objectID}`,
        source: 'hn',
        kind: 'news',
        title: story.title,
        // Ask HN and text posts have no link of their own.
        url,
        summary: '',
        publishedAt: iso(story.created_at),
        rank,
        points: story.points,
        comments: story.num_comments ?? 0,
        discussion: thread,
        by: story.author,
        icon: siteIcon(url),
      };
    });
}

const hfSchema = z.array(
  z.object({
    paper: z.object({
      id: z.string().regex(/^[\w.-]+$/),
      title: z.string(),
      upvotes: z.number(),
      publishedAt: z.string(),
    }),
    numComments: z.number().optional(),
  })
);

export function parseHf(payload: unknown): RadarItem[] {
  return hfSchema
    .parse(payload)
    .sort((a, b) => b.paper.upvotes - a.paper.upvotes)
    .map(({ paper, numComments }, rank) => ({
      id: `hf:${paper.id}`,
      source: 'hf',
      kind: 'paper',
      title: paper.title.trim(),
      url: `https://huggingface.co/papers/${paper.id}`,
      summary: '',
      publishedAt: iso(paper.publishedAt),
      rank,
      points: paper.upvotes,
      comments: numComments ?? 0,
      icon: siteIcon('https://huggingface.co'),
      image: `https://cdn-thumbnails.huggingface.co/social-thumbnails/papers/${paper.id}.png`,
    }));
}

const devtoSchema = z.array(
  z.object({
    id: z.number(),
    title: z.string(),
    url: https,
    public_reactions_count: z.number(),
    comments_count: z.number(),
    published_at: z.string(),
    cover_image: z.string().nullable().optional(),
    user: z.object({
      name: z.string(),
      profile_image_90: z.string().optional(),
    }),
  })
);

export function parseDevto(payload: unknown): RadarItem[] {
  return devtoSchema.parse(payload).map((post, rank) => ({
    id: `devto:${post.id}`,
    source: 'devto',
    kind: 'post',
    title: post.title,
    url: post.url,
    summary: '',
    publishedAt: iso(post.published_at),
    rank,
    points: post.public_reactions_count,
    comments: post.comments_count,
    by: post.user.name,
    icon: httpsOr(post.user.profile_image_90) ?? siteIcon(post.url),
    image: httpsOr(post.cover_image),
  }));
}

const lobstersSchema = z.array(
  z.object({
    short_id: z.string(),
    title: z.string(),
    url: z.string(),
    score: z.number(),
    comment_count: z.number(),
    created_at: z.string(),
    submitter_user: z.string(),
    comments_url: https,
  })
);

export function parseLobsters(payload: unknown): RadarItem[] {
  // Lobsters is general tech, so it gets a smaller share than the AI sources.
  return lobstersSchema
    .parse(payload)
    .slice(0, 15)
    .map((story, rank) => {
      const url = httpsOr(story.url) ?? story.comments_url;
      return {
        id: `lobsters:${story.short_id}`,
        source: 'lobsters' as const,
        kind: 'post' as const,
        title: story.title,
        url,
        summary: '',
        publishedAt: iso(story.created_at),
        rank,
        points: story.score,
        comments: story.comment_count,
        discussion: story.comments_url,
        by: story.submitter_user,
        icon: siteIcon(url),
      };
    });
}

const atom = new XMLParser({
  // Keep titles such as "2025" as text.
  parseTagValue: false,
  ignoreAttributes: false,
  attributeNamePrefix: '',
  processEntities: false,
  isArray: (name) => name === 'entry' || name === 'link',
});

const atomSchema = z.object({
  feed: z.object({
    entry: z
      .array(
        z.object({
          title: z.string(),
          link: z.array(z.object({ href: z.string() })),
          published: z.string(),
        })
      )
      .default([]),
  }),
});

export function parseSimon(xml: string): RadarItem[] {
  return atomSchema
    .parse(atom.parse(xml))
    .feed.entry.filter((entry) => https.safeParse(entry.link[0]?.href).success)
    .slice(0, 12)
    .map((entry, rank) => ({
      id: `simon:${entry.link[0].href}`,
      source: 'simon',
      kind: 'post',
      title: decodeText(entry.title),
      url: entry.link[0].href,
      summary: '',
      publishedAt: iso(entry.published),
      rank,
      by: 'Simon Willison',
      icon: siteIcon(entry.link[0].href),
    }));
}

// Each source's real URL; e2e builds point them all at the fixture server.
function sourceUrl(name: RadarSource, real: string) {
  const fixture = process.env.RADAR_FIXTURE_URL;
  return fixture ? `${fixture}/radar/${name}` : real;
}

function sources(): Record<RadarSource, () => Promise<RadarItem[]>> {
  const week = new Date(days(7)).toISOString().slice(0, 10);
  const since = Math.floor(days(3) / 1000);
  const githubHeaders: Record<string, string> = {
    Accept: 'application/vnd.github+json',
  };
  if (process.env.GITHUB_TOKEN) {
    githubHeaders.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return {
    github: async () =>
      parseGithub(
        await get(
          sourceUrl(
            'github',
            `https://api.github.com/search/repositories?q=created:>${week}+stars:>50&sort=stars&order=desc&per_page=20`
          ),
          githubHeaders
        ).then((r) => r.json())
      ),
    // Algolia ANDs query words; optionalWords makes either one enough.
    hn: async () =>
      parseHn(
        await get(
          sourceUrl(
            'hn',
            `https://hn.algolia.com/api/v1/search?tags=story&query=AI%20LLM&optionalWords=AI%20LLM&numericFilters=points%3E80,created_at_i%3E${since}&hitsPerPage=20`
          )
        ).then((r) => r.json())
      ),
    hf: async () =>
      parseHf(
        await get(
          sourceUrl('hf', 'https://huggingface.co/api/daily_papers?limit=20')
        ).then((r) => r.json())
      ),
    devto: async () =>
      parseDevto(
        await get(
          sourceUrl(
            'devto',
            'https://dev.to/api/articles?tag=ai&top=3&per_page=12'
          )
        ).then((r) => r.json())
      ),
    lobsters: async () =>
      parseLobsters(
        await get(sourceUrl('lobsters', 'https://lobste.rs/hottest.json')).then(
          (r) => r.json()
        )
      ),
    simon: async () =>
      parseSimon(
        await get(
          sourceUrl('simon', 'https://simonwillison.net/atom/everything/')
        ).then((r) => r.text())
      ),
  };
}

async function get(url: string, headers: Record<string, string> = {}) {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'hacisimsek.com radar (+https://hacisimsek.com/radar)',
      ...headers,
    },
    next: { revalidate: RADAR_REVALIDATE },
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) throw new Error(`${url} responded ${response.status}`);
  return response;
}

/** Every source at once; a source that fails is listed, not fatal. */
export async function getRadar(): Promise<{
  items: RadarItem[];
  failed: RadarSource[];
  fetchedAt: number;
}> {
  const entries = Object.entries(sources()) as [
    RadarSource,
    () => Promise<RadarItem[]>,
  ][];
  const results = await Promise.allSettled(entries.map(([, load]) => load()));
  const failed: RadarSource[] = [];
  const items = results.flatMap((result, index) => {
    if (result.status === 'fulfilled') return result.value;
    console.error('Radar source unavailable:', result.reason);
    failed.push(entries[index][0]);
    return [];
  });
  return { items, failed, fetchedAt: Date.now() };
}

export interface RadarPick {
  item: RadarItem;
  /** Stars a day for repos, points (or upvotes) for everything else. */
  signal: number;
}

/** The strongest item of each kind: repos by stars a day, the rest by points. */
export function pickRadar(items: RadarItem[], now: number): RadarPick[] {
  const best = new Map<RadarKind, RadarPick>();
  for (const item of items) {
    const signal =
      item.kind === 'repo'
        ? Math.round(
            (item.stars ?? 0) /
              Math.max(1, (now - Date.parse(item.publishedAt)) / 86_400_000)
          )
        : (item.points ?? 0);
    if (signal > (best.get(item.kind)?.signal ?? 0)) {
      best.set(item.kind, { item, signal });
    }
  }
  return (['repo', 'news', 'paper', 'post'] as const).flatMap((kind) => {
    const pick = best.get(kind);
    return pick ? [pick] : [];
  });
}
