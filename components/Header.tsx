'use client';

import { useState } from 'react';
import { Menu, MoonIcon, SunIcon, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { Button } from '@/components/ui/button';
import { profile } from '@/content';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', key: 'home' },
  { href: '/projects', key: 'projects' },
  { href: '/articles', key: 'articles' },
  { href: '/contact', key: 'contact' },
] as const;

export default function Header() {
  const t = useTranslations('Nav');
  const { setTheme, resolvedTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-4 z-50 mb-10 fade-up">
      <div className="flex min-h-[88px] items-center justify-between gap-4 surface-card px-5 py-4 sm:px-6">
        <Link href="/" className="min-w-0">
          <div className="text-xl font-semibold tracking-tight sm:text-2xl">
            {profile.name}
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2 text-sm text-muted-foreground transition hover:bg-secondary hover:text-foreground"
            >
              {t(link.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />

          <Button
            variant="outline"
            size="icon"
            className="rounded-full bg-background/80"
            onClick={() =>
              setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
            }
          >
            <SunIcon className="h-[1.1rem] w-[1.1rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
            <MoonIcon className="absolute h-[1.1rem] w-[1.1rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
            <span className="sr-only">{t('toggleTheme')}</span>
          </Button>

          <Button
            asChild
            className="hidden rounded-full bg-accent px-5 text-accent-foreground hover:bg-accent/90 md:inline-flex"
          >
            <Link href="/contact">{t('letsTalk')}</Link>
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="rounded-full md:hidden"
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            {isMenuOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
            <span className="sr-only">{t('toggleNavigation')}</span>
          </Button>
        </div>
      </div>

      <div
        className={cn(
          'mt-3 overflow-hidden surface-card px-4 transition-all duration-200 md:hidden',
          isMenuOpen
            ? 'max-h-80 py-4 opacity-100'
            : 'max-h-0 border-transparent py-0 opacity-0'
        )}
      >
        <nav className="flex flex-col gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-2xl px-3 py-3 text-sm text-muted-foreground transition hover:bg-secondary hover:text-foreground"
              onClick={() => setIsMenuOpen(false)}
            >
              {t(link.key)}
            </Link>
          ))}
          <Button
            asChild
            className="mt-2 rounded-full bg-accent text-accent-foreground hover:bg-accent/90"
          >
            <Link href="/contact" onClick={() => setIsMenuOpen(false)}>
              {t('letsTalk')}
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
