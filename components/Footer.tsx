import { useTranslations } from 'next-intl';
import { ArrowUpRight } from 'lucide-react';
import {
  GithubIcon,
  LinkedinIcon,
  XIcon,
} from '@/components/icons/brand-icons';
import { profile, socials } from '@/content';
import { Link } from '@/i18n/navigation';

const icons = { github: GithubIcon, linkedin: LinkedinIcon, x: XIcon };

const socialLinks = socials
  .filter((social) => social.id !== 'medium')
  .map((social) => ({
    href: social.href,
    label: social.label,
    icon: icons[social.id as keyof typeof icons],
  }));

export default function Footer() {
  const msg = useTranslations('Footer');
  return (
    <footer className="mt-16 fade-up">
      <div className="flex flex-col gap-6 surface-card px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="eyebrow">{msg('eyebrow')}</div>
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
