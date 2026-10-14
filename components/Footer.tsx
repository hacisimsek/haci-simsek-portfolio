import { useTranslations } from 'next-intl';
import { ArrowUpRight, GitCommitHorizontal } from 'lucide-react';
import {
  GithubIcon,
  LinkedinIcon,
  XIcon,
} from '@/components/icons/brand-icons';
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

export default function Footer() {
  const msg = useTranslations('Footer');
  // Set by Vercel at build time; absent locally.
  const sha = process.env.VERCEL_GIT_COMMIT_SHA;
  return (
    <footer className="mt-24">
      <div className="flex flex-col gap-6 surface-card px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <p className="font-medium">{msg('availability')}</p>
          <p className="max-w-xl text-sm leading-7 text-muted-foreground">
            {msg('text')}
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:items-end">
          <div className="flex items-center gap-3">
            {socialLinks.map(({ href, label, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-border/70 bg-background/85 text-muted-foreground transition hover:-translate-y-0.5 hover:border-accent/50 hover:text-foreground"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>

          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-sm font-medium text-foreground transition hover:text-accent"
          >
            {msg('cta')}
            <ArrowUpRight className="h-4 w-4" />
          </Link>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground sm:justify-end">
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

          <p className="text-xs text-muted-foreground">
            {msg('copyright', {
              year: new Date().getFullYear(),
              name: profile.asciiName,
            })}
          </p>
        </div>
      </div>
    </footer>
  );
}
