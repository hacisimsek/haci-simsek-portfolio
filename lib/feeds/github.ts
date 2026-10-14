import 'server-only';
import { z } from 'zod';

export const PROJECTS_REVALIDATE = 3600;

const PROFILE_REPO = 'hacisimsek';

const repoSchema = z.object({
  name: z.string(),
  description: z.string().nullable(),
  html_url: z.url(),
  language: z.string().nullable(),
  updated_at: z.string(),
  fork: z.boolean(),
  archived: z.boolean(),
});

export interface Repo {
  name: string;
  description: string;
  url: string;
  language: string | null;
  updatedAt: string;
}

export function selectRepos(payload: unknown): Repo[] {
  return z
    .array(repoSchema)
    .parse(payload)
    .filter(
      (repo) =>
        !repo.fork &&
        !repo.archived &&
        repo.name !== PROFILE_REPO &&
        repo.description?.trim()
    )
    .map((repo) => ({
      name: repo.name,
      description: repo.description!.trim(),
      url: repo.html_url,
      language: repo.language,
      updatedAt: repo.updated_at,
    }))
    .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt));
}

export async function getRepos(): Promise<Repo[]> {
  const base = process.env.GITHUB_API_URL ?? 'https://api.github.com';
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const response = await fetch(
    `${base}/users/hacisimsek/repos?per_page=100&sort=updated`,
    {
      headers,
      next: { revalidate: PROJECTS_REVALIDATE },
      signal: AbortSignal.timeout(10_000),
    }
  );
  if (!response.ok) {
    throw new Error(`GitHub responded ${response.status}`);
  }
  return selectRepos(await response.json());
}
