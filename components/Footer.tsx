import { ArrowRight, GitCommitHorizontal } from 'lucide-react';
import { useTranslations } from 'next-intl';
import CopyEmailButton from '@/components/copy-email-button';
import HideOnPath from '@/components/hide-on-path';
import {
  GithubIcon,
  LinkedinIcon,
  XIcon,
} from '@/components/icons/brand-icons';
import { Button } from '@/components/ui/button';
import { profile, socials } from '@/content';
import { Link } from '@/i18n/navigation';

const icons = { github: GithubIcon, linkedin: LinkedinIcon, x: XIcon };

const REPO = 'https://github.com/hacisimsek/haci-simsek-portfolio';

const socialLinks = socials
  .filter((social) => social.id !== 'medium')
  .map((social) => ({
    href: social.href,
    label: social.label,
    icon: icons[social.id as keyof typeof icons],
  }));

// The page's closing section: an honest invitation and one clear action,
// above a quiet row with the copyright, build and social links.
export default function Footer() {
  const msg = useTranslations('Footer');
  // Set by Vercel at build time; absent locally.
  const sha = process.env.VERCEL_GIT_COMMIT_SHA;
  return (
    <footer className="mt-24">
      <HideOnPath path="/contact">
        {/* Full-width rule; the band brings its own space below, so the
            bottom row sits close on /contact, where the band is hidden. */}
        <div className="border-t border-border/70 pt-14 pb-14">
          <section aria-labelledby="closing-title" className="max-w-3xl">
            <h2
              id="closing-title"
              className="font-display text-3xl font-semibold tracking-tight sm:text-5xl"
            >
              {msg('title')}
            </h2>
            <p className="mt-4 text-base leading-8 text-muted-foreground sm:text-lg">
              {msg('text', { company: profile.currentCompany })}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="rounded-full px-7">
                <Link href="/contact">
                  {msg('cta')}
                  <ArrowRight aria-hidden className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <CopyEmailButton email={profile.email} />
            </div>
          </section>
        </div>
      </HideOnPath>

      <div className="flex flex-col gap-4 border-t border-border/70 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <span>
            {msg('copyright', {
              year: new Date().getFullYear(),
              name: profile.name,
            })}
          </span>
          {sha ? (
            <a
              href={`${REPO}/commit/${sha}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-mono hover:text-foreground"
            >
              <GitCommitHorizontal aria-hidden className="h-3.5 w-3.5" />
              {msg('build', { sha: sha.slice(0, 7) })}
            </a>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          {socialLinks.map(({ href, label, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
