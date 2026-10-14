import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import Education from '@/components/Education';
import AboutBento from '@/components/sections/about-bento';
import Career from '@/components/sections/career';
import FeaturedProjects from '@/components/sections/featured-projects';
import Hero from '@/components/sections/hero';
import LatestWriting from '@/components/sections/latest-writing';
import Skills from '@/components/sections/skills';
import Stats from '@/components/sections/stats';
import { experience, featuredProjects, profile } from '@/content';
import { routing } from '@/i18n/routing';
import { selectFeatured } from '@/lib/featured';
import { getRepos } from '@/lib/feeds/github';
import { loadFeed } from '@/lib/feeds/load';
import { getArticles } from '@/lib/feeds/medium';
import { buildStats } from '@/lib/stats';

// The home page shows live repo and article data, so it refreshes as often as
// the GitHub feed does.
export const revalidate = 3600;

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const [repos, articles] = await Promise.all([
    loadFeed(getRepos),
    loadFeed(getArticles),
  ]);
  const stats = buildStats({
    careerStart: profile.careerStart,
    roles: experience,
    repos: repos.ok ? repos.data.length : undefined,
    articles: articles.ok ? articles.data.length : undefined,
  });

  return (
    <div className="space-y-16 pb-6 sm:space-y-24">
      <div className="space-y-6">
        <Hero />
        <Stats stats={stats} />
      </div>
      <AboutBento latestArticle={articles.ok ? articles.data[0] : undefined} />
      <FeaturedProjects
        repos={repos.ok ? selectFeatured(repos.data, featuredProjects) : []}
      />
      <Career />
      <Skills />
      <Education />
      <LatestWriting articles={articles.ok ? articles.data.slice(0, 3) : []} />
    </div>
  );
}
