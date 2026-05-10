'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, MoonIcon, SunIcon, X } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Projects' },
  { href: '/articles', label: 'Articles' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  const { setTheme, resolvedTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-4 z-50 mb-10 fade-up">
      <div className="surface-card flex min-h-[88px] items-center justify-between gap-4 px-5 py-4 sm:px-6">
        <Link href="/" className="min-w-0">
          <div className="text-xl font-semibold tracking-tight sm:text-2xl">
            Hacı Şimşek
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2 text-sm text-muted-foreground transition hover:bg-secondary hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full bg-background/80"
            onClick={() =>
              setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
            }
          >
            <SunIcon className="h-[1.1rem] w-[1.1rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <MoonIcon className="absolute h-[1.1rem] w-[1.1rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          <Button
            asChild
            className="hidden rounded-full bg-accent px-5 text-accent-foreground hover:bg-accent/90 md:inline-flex"
          >
            <Link href="/contact">Let&apos;s Talk</Link>
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
            <span className="sr-only">Toggle navigation</span>
          </Button>
        </div>
      </div>

      <div
        className={cn(
          'surface-card mt-3 overflow-hidden px-4 transition-all duration-200 md:hidden',
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
              {link.label}
            </Link>
          ))}
          <Button asChild className="mt-2 rounded-full bg-accent text-accent-foreground hover:bg-accent/90">
            <Link href="/contact" onClick={() => setIsMenuOpen(false)}>
              Let&apos;s Talk
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
