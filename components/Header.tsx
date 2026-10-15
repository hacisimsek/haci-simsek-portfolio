'use client';

import { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import CommandPalette from '@/components/command/command-palette';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import ThemeToggle from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { profile } from '@/content';
import { Link, usePathname } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', key: 'home' },
  { href: '/projects', key: 'projects' },
  { href: '/articles', key: 'articles' },
] as const;

function isCurrent(pathname: string, href: string) {
  return href === '/'
    ? pathname === '/'
    : pathname === href || pathname.startsWith(`${href}/`);
}

export default function Header() {
  const t = useTranslations('Nav');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Escape closes the open phone menu. A dialog above it (the command
  // palette) claims Escape first, and focus only returns to the button when
  // it was in the header, so a visitor typing elsewhere is not moved.
  useEffect(() => {
    if (!isMenuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || event.defaultPrevented) return;
      setIsMenuOpen(false);
      const active = document.activeElement;
      if (
        !active ||
        active === document.body ||
        headerRef.current?.contains(active)
      ) {
        toggleRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isMenuOpen]);

  return (
    <header ref={headerRef} className="sticky top-4 z-50 mb-10">
      {/* First stop for keyboard users: straight past the header. */}
      <a
        href="#main"
        onClick={(event) => {
          // A modified click (new tab, new window) is the browser's.
          if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
            return;
          event.preventDefault();
          document.getElementById('main')?.focus();
        }}
        className="sr-only rounded-full bg-accent text-sm font-medium text-accent-foreground focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[80] focus:px-4 focus:py-2"
      >
        {t('skip')}
      </a>
      <div
        data-glass
        className="flex min-h-[76px] items-center justify-between gap-4 glass px-5 py-3 sm:px-6"
      >
        <Link href="/" className="flex min-h-11 min-w-0 items-center">
          <div className="font-display text-lg font-semibold tracking-tight whitespace-nowrap sm:text-2xl">
            {profile.name}
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isCurrent(pathname, link.href) ? 'page' : undefined}
              className="rounded-full px-4 py-2 text-sm text-muted-foreground transition hover:bg-secondary hover:text-foreground aria-[current=page]:bg-secondary aria-[current=page]:text-foreground"
            >
              {t(link.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <CommandPalette />
          {/* On phones these two live in the menu, so every header control can
              be a 44px target without the bar overflowing. */}
          <div className="hidden items-center gap-2 md:flex">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>

          {/* Quiet beside each page's own primary action. */}
          <Button
            asChild
            variant="outline"
            className="hidden rounded-full px-5 aria-[current=page]:bg-secondary md:inline-flex"
          >
            <Link
              href="/contact"
              aria-current={
                isCurrent(pathname, '/contact') ? 'page' : undefined
              }
            >
              {t('contact')}
            </Link>
          </Button>

          <Button
            variant="outline"
            size="icon"
            ref={toggleRef}
            aria-expanded={isMenuOpen}
            aria-controls="phone-menu"
            className="h-11 w-11 rounded-full md:hidden"
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
        id="phone-menu"
        data-glass
        // Collapsed, the panel is only visually hidden; inert keeps its links
        // out of the tab order and the accessibility tree.
        inert={!isMenuOpen}
        className={cn(
          'mt-3 overflow-hidden glass px-4 transition-all duration-200 md:hidden',
          isMenuOpen
            ? 'max-h-[32rem] py-4 opacity-100'
            : 'max-h-0 border-transparent py-0 opacity-0'
        )}
      >
        <nav className="flex flex-col gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isCurrent(pathname, link.href) ? 'page' : undefined}
              className="rounded-2xl px-3 py-3 text-sm text-muted-foreground transition hover:bg-secondary hover:text-foreground aria-[current=page]:bg-secondary aria-[current=page]:text-foreground"
              onClick={() => setIsMenuOpen(false)}
            >
              {t(link.key)}
            </Link>
          ))}
          <Button asChild className="mt-2 h-11 rounded-full">
            <Link
              href="/contact"
              aria-current={
                isCurrent(pathname, '/contact') ? 'page' : undefined
              }
              onClick={() => setIsMenuOpen(false)}
            >
              {t('contact')}
            </Link>
          </Button>
        </nav>
        {isMenuOpen ? (
          <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-4">
            <LanguageSwitcher touch />
            <ThemeToggle className="h-11 w-11" />
          </div>
        ) : null}
      </div>
    </header>
  );
}
