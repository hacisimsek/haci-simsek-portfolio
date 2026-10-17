import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import Education from '@/components/Education';
import About from '@/components/sections/about';
import Career from '@/components/sections/career';
import FeaturedProjects from '@/components/sections/featured-projects';
import Hero from '@/components/sections/hero';
import LatestWriting from '@/components/sections/latest-writing';
import Skills from '@/components/sections/skills';
import RequestStory from '@/components/story/request-story';
import { featuredProjects } from '@/content';
import { routing } from '@/i18n/routing';
import { selectFeatured } from '@/lib/featured';
import { getRepos } from '@/lib/feeds/github';
import { loadFeed } from '@/lib/feeds/load';
import { getArticles } from '@/lib/feeds/medium';

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

  return (
    <div className="space-y-16 pb-6 sm:space-y-24">
      <Hero />
      <RequestStory />
      <About />
      <FeaturedProjects
        repos={
          repos.ok
            ? // Only authored picks; a missing one shortens the list.
              selectFeatured(
                repos.data,
                featuredProjects,
                featuredProjects.length,
                {
                  fill: false,
                }
              )
            : []
        }
      />
      <Career />
      <Skills />
      <Education />
      <LatestWriting articles={articles.ok ? articles.data.slice(0, 3) : []} />
    </div>
  );
}
