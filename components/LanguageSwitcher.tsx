'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { cn } from '@/lib/utils';

// `touch` gives each option a 44px target for the phone menu.
export default function LanguageSwitcher({
  touch = false,
}: {
  touch?: boolean;
}) {
  const t = useTranslations('LanguageSwitcher');
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <nav
      aria-label={t('label')}
      className="flex items-center rounded-full border border-input bg-background/80 p-1"
    >
      {routing.locales.map((option) => {
        const active = option === locale;
        return (
          <Link
            key={option}
            href={pathname}
            locale={option}
            hrefLang={option}
            lang={option}
            aria-label={t(option)}
            aria-current={active ? 'true' : undefined}
            className={cn(
              'rounded-full px-2.5 py-1 font-mono text-xs uppercase transition',
              touch &&
                'inline-flex min-h-11 min-w-11 items-center justify-center',
              active
                ? 'bg-secondary text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {option}
          </Link>
        );
      })}
    </nav>
  );
}
