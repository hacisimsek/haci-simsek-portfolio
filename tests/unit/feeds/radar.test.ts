// @vitest-environment node
import { readFileSync } from 'node:fs';
import { afterEach, describe, expect, it, vi } from 'vitest';
import github from '../../fixtures/radar/github.json';
import hn from '../../fixtures/radar/hn.json';
import hf from '../../fixtures/radar/hf.json';
import devto from '../../fixtures/radar/devto.json';
import lobsters from '../../fixtures/radar/lobsters.json';
import {
  getRadar,
  parseDevto,
  parseGithub,
  parseHf,
  parseHn,
  parseLobsters,
  parseSimon,
} from '@/lib/feeds/radar';

const simon = readFileSync('tests/fixtures/radar/simon.xml', 'utf8');

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe('radar parsers', () => {
  it('maps rising GitHub repos with stars, language and a fallback summary', () => {
    const [first, second] = parseGithub(github);
    expect(first).toMatchObject({
      source: 'github',
      kind: 'repo',
      title: 'acme/agent-kit',
      url: 'https://github.com/acme/agent-kit',
      summary: 'A small toolkit for building LLM agents',
      stars: 4210,
      language: 'Python',
      rank: 0,
    });
    expect(second.summary).toBe('');
    expect(second.rank).toBe(1);
  });

  it('links Hacker News stories, falling back to the thread when there is no url', () => {
    const [story, ask] = parseHn(hn);
    expect(story).toMatchObject({
      source: 'hn',
      kind: 'news',
      url: 'https://example.com/70b-laptop',
      points: 512,
      comments: 203,
      discussion: 'https://news.ycombinator.com/item?id=50300001',
    });
    expect(ask.url).toBe('https://news.ycombinator.com/item?id=50300002');
  });

  it('maps Hugging Face daily papers to their paper pages', () => {
    expect(parseHf(hf)[0]).toMatchObject({
      source: 'hf',
      kind: 'paper',
      title: 'Sparse Mixture of Agents',
      url: 'https://huggingface.co/papers/2610.00001',
      points: 96,
      comments: 4,
    });
  });

  it('maps dev.to and Lobsters posts', () => {
    expect(parseDevto(devto)[0]).toMatchObject({
      source: 'devto',
      kind: 'post',
      points: 230,
      comments: 31,
      by: 'Carol',
    });
    const [link, text] = parseLobsters(lobsters);
    expect(link).toMatchObject({ source: 'lobsters', points: 99 });
    expect(link.publishedAt).toBe('2026-10-31T13:39:52.161Z');
    // A text post has no url; it links to its thread.
    expect(text.url).toBe('https://lobste.rs/s/def456/monad');
  });

  it('reads the Atom feed and drops entries that are not https', () => {
    const entries = parseSimon(simon);
    expect(entries).toHaveLength(1);
    expect(entries[0]).toMatchObject({
      source: 'simon',
      kind: 'post',
      title: 'Notes on running models locally',
      url: 'https://simonwillison.net/2026/Oct/31/local-models/',
    });
  });

  it('rejects payloads that do not match the source shape', () => {
    expect(() => parseHn({ hits: [{ title: 1 }] })).toThrow();
  });
});

describe('getRadar', () => {
  it('keeps the other sources when one is down', async () => {
    vi.stubEnv('RADAR_FIXTURE_URL', 'http://fixtures');
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string) => {
        const name = new URL(url).pathname.split('/').pop();
        if (name === 'hn') return new Response('down', { status: 503 });
        const body =
          name === 'simon'
            ? simon
            : JSON.stringify(
                { github, hf, devto, lobsters }[
                  name as 'github' | 'hf' | 'devto' | 'lobsters'
                ]
              );
        return new Response(body, { status: 200 });
      })
    );
    const radar = await getRadar();
    expect(radar.failed).toEqual(['hn']);
    expect(new Set(radar.items.map((item) => item.source))).toEqual(
      new Set(['github', 'hf', 'devto', 'lobsters', 'simon'])
    );
  });
});
