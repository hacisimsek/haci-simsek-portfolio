import Link from 'next/link';
import { ArrowRight, FileText, FolderGit2, Layers3 } from 'lucide-react';
import About from '@/components/About';
import Career from '@/components/Career';
import Education from '@/components/Education';

const featuredAreas = [
  {
    title: 'Featured projects',
    description:
      'A selected view into experiments, shipped ideas, and production-minded engineering work.',
    href: '/projects',
    icon: FolderGit2,
  },
  {
    title: 'Technical writing',
    description:
      'Articles where architecture, implementation detail, and practical lessons are unpacked clearly.',
    href: '/articles',
    icon: FileText,
  },
  {
    title: 'Current focus',
    description:
      'Authentication flows, backend resilience, scalable frontend foundations, and cleaner developer experience.',
    href: '/contact',
    icon: Layers3,
  },
];

export default function Home() {
  return (
    <div className="space-y-6 pb-6">
      <About />
      <Career />
      <Education />

      <section className="fade-up">
        <div className="section-shell">
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="eyebrow mb-4">Beyond the resume</div>
              <h2 className="section-title">
                Proof of work, writing, and next conversations
              </h2>
            </div>
            <p className="section-copy">
              The site should do more than list roles. These entry points make
              it easier to evaluate how I think, what I build, and where a
              collaboration could start.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {featuredAreas.map(({ title, description, href, icon: Icon }) => (
              <Link
                key={title}
                href={href}
                className="group rounded-[1.8rem] border border-border/70 bg-background/75 p-6 transition hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_18px_40px_-32px_hsl(var(--foreground)/0.65)]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-foreground">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-xl font-semibold">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {description}
                </p>
                <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-foreground">
                  Explore
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
