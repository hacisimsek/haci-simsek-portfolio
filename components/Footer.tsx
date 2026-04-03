import Link from 'next/link';
import { ArrowUpRight, Github, Linkedin, Twitter } from 'lucide-react';

const socialLinks = [
  {
    href: 'https://github.com/hacisimsek',
    label: 'GitHub',
    icon: Github,
  },
  {
    href: 'https://www.linkedin.com/in/haci-simsek/',
    label: 'LinkedIn',
    icon: Linkedin,
  },
  {
    href: 'https://x.com/CodeWithHaci',
    label: 'X',
    icon: Twitter,
  },
];

export default function Footer() {
  return (
    <footer className="mt-16 fade-up">
      <div className="surface-card flex flex-col gap-6 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="eyebrow">Available for selective collaborations</div>
          <p className="max-w-xl text-sm leading-7 text-muted-foreground">
            Building robust backend systems, distributed platform capabilities,
            and architecture that remains operable under real production load.
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
            Start a conversation
            <ArrowUpRight className="h-4 w-4" />
          </Link>

          <p className="text-xs text-muted-foreground">
            © 2026 Haci Simsek. Designed with intent, not templates.
          </p>
        </div>
      </div>
    </footer>
  );
}
