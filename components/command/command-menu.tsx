'use client';

import {
  ArrowRight,
  Check,
  Copy,
  ExternalLink,
  Languages,
  Monitor,
  Moon,
  Sun,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { useEffect, useMemo, useState } from 'react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { profile, socials } from '@/content';
import { usePathname, useRouter } from '@/i18n/navigation';
import { fold } from '@/lib/fold';
import {
  buildCommands,
  type CommandAction,
  type CommandItem as Item,
} from './commands';

// Every word typed must appear in the item's folded label or keywords.
function filter(_value: string, search: string, keywords?: string[]) {
  const haystack = fold((keywords ?? []).join(' '));
  return fold(search)
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => haystack.includes(word))
    ? 1
    : 0;
}

const themeIcons = { dark: Moon, light: Sun, system: Monitor } as const;

function ItemIcon({
  action,
  copied,
}: {
  action: CommandAction;
  copied: boolean;
}) {
  const className = 'h-4 w-4 shrink-0 text-muted-foreground';
  switch (action.type) {
    case 'navigate':
      return <ArrowRight aria-hidden className={className} />;
    case 'theme': {
      const Icon = themeIcons[action.theme];
      return <Icon aria-hidden className={className} />;
    }
    case 'locale':
      return <Languages aria-hidden className={className} />;
    case 'copy-email':
      return copied ? (
        <Check aria-hidden className={className} />
      ) : (
        <Copy aria-hidden className={className} />
      );
    case 'external':
      return <ExternalLink aria-hidden className={className} />;
  }
}

export default function CommandMenu({ onDone }: { onDone: () => void }) {
  const t = useTranslations('Command');
  const router = useRouter();
  const pathname = usePathname();
  const { setTheme } = useTheme();
  const [copied, setCopied] = useState(false);

  const groups = useMemo(
    () =>
      buildCommands({
        t: (key) => t(key as Parameters<typeof t>[0]),
        socials,
      }),
    [t]
  );

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1500);
    return () => window.clearTimeout(timer);
  }, [copied]);

  async function run(item: Item) {
    const { action } = item;
    if (action.type === 'copy-email') {
      try {
        await navigator.clipboard.writeText(profile.email);
        setCopied(true);
        return;
      } catch {
        // Clipboard blocked: fall back to the mail client.
        onDone();
        window.location.assign(`mailto:${profile.email}`);
        return;
      }
    }

    onDone();
    switch (action.type) {
      case 'navigate':
        router.push(action.href);
        break;
      case 'theme':
        setTheme(action.theme);
        break;
      case 'locale':
        router.replace(pathname, { locale: action.locale });
        break;
      case 'external':
        window.open(action.href, '_blank', 'noopener,noreferrer');
        break;
    }
  }

  return (
    <Command filter={filter} label={t('title')}>
      <CommandInput autoFocus placeholder={t('placeholder')} />
      <CommandList>
        <CommandEmpty>{t('empty')}</CommandEmpty>
        {groups.map((group) => (
          <CommandGroup key={group.id} heading={group.heading}>
            {group.items.map((item) => {
              const isCopied = copied && item.action.type === 'copy-email';
              return (
                <CommandItem
                  key={item.id}
                  value={item.id}
                  keywords={item.keywords}
                  onSelect={() => void run(item)}
                >
                  <ItemIcon action={item.action} copied={isCopied} />
                  <span>{isCopied ? t('copied') : item.label}</span>
                </CommandItem>
              );
            })}
          </CommandGroup>
        ))}
      </CommandList>
    </Command>
  );
}
