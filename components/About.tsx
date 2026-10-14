import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Mail } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/icons/brand-icons';
import { Button } from '@/components/ui/button';
import { profile, socials, t } from '@/content';
import { careerYears } from '@/lib/dates';

function socialHref(id: 'github' | 'linkedin') {
  return socials.find((social) => social.id === id)!.href;
}

export default function About() {
  const years = careerYears(profile.careerStart);
  const highlights = [
    { label: 'Experience', value: `${years} years in production engineering` },
    { label: 'Environment', value: t(profile.environment) },
  ];

  return (
    <section id="about" className="fade-up">
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="section-shell">
          <div className="mb-6 eyebrow">Editorial tech portfolio</div>
          <div className="max-w-3xl">
            <h1 className="page-title">{t(profile.headline)}</h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg sm:leading-7">
              {t(profile.intro).replace('{years}', String(years))}
            </p>
            {t(profile.bio).map((paragraph) => (
              <p
                key={paragraph}
                className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground"
              >
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {t(profile.expertise).map((item) => (
              <span key={item} className="meta-chip">
                {item}
              </span>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              asChild
              className="rounded-full bg-accent px-6 text-accent-foreground hover:bg-accent/90"
            >
              <Link href="/projects">
                View Projects
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full px-6">
              <Link href="/contact">Start a Conversation</Link>
            </Button>
          </div>

          <div className="mt-10 grid gap-3 border-t border-border/70 pt-6 sm:grid-cols-2">
            {highlights.map((item) => (
              <div
                key={item.label}
                className="rounded-3xl border border-border/60 bg-background/70 p-5"
              >
                <p className="text-xs tracking-[0.22em] text-muted-foreground uppercase">
                  {item.label}
                </p>
                <div className="mt-3 text-xl leading-8 font-semibold">
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="section-shell flex flex-col">
          <div>
            <div className="mb-4 eyebrow">
              Currently at {profile.currentCompany}
            </div>
            <div className="relative overflow-hidden rounded-4xl border border-border/70 bg-secondary/40 p-3">
              <Image
                src="/images/IMG_0569.JPG"
                alt={profile.asciiName}
                width={1200}
                height={1400}
                preload
                className="aspect-4/5 w-full rounded-[1.4rem] object-cover"
              />
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="rounded-3xl border border-border/70 bg-background/70 p-5">
              <p className="text-sm tracking-[0.24em] text-muted-foreground uppercase">
                Based in
              </p>
              <p className="mt-2 text-lg font-semibold">
                {t(profile.location)}
              </p>
            </div>

            <div className="flex gap-3">
              {[
                {
                  href: `mailto:${profile.email}`,
                  label: 'Email',
                  icon: Mail,
                },
                {
                  href: socialHref('github'),
                  label: 'GitHub',
                  icon: GithubIcon,
                },
                {
                  href: socialHref('linkedin'),
                  label: 'LinkedIn',
                  icon: LinkedinIcon,
                },
              ].map(({ href, label, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={
                    href.startsWith('http') ? 'noopener noreferrer' : undefined
                  }
                  className="flex flex-1 items-center justify-center gap-2 rounded-full border border-border/70 bg-background/80 px-4 py-3 text-sm text-muted-foreground transition hover:border-accent/50 hover:text-foreground"
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </a>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
