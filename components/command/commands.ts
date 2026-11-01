import type { Locale, Social } from '@/content';
import { fold } from '@/lib/fold';

export type CommandAction =
  | { type: 'navigate'; href: string }
  | { type: 'theme'; theme: 'dark' | 'light' | 'system' }
  | { type: 'locale'; locale: Locale }
  | { type: 'copy-email' }
  | { type: 'external'; href: string }
  | { type: 'terminal' };

export type CommandItem = {
  id: string;
  label: string;
  keywords: string[];
  action: CommandAction;
};

export type CommandGroup = {
  id: 'navigate' | 'preferences' | 'contact' | 'links';
  heading: string;
  items: CommandItem[];
};

type Translate = (key: string) => string;

const sections = [
  { id: 'nav-home', key: 'nav.home', href: '/' },
  { id: 'nav-about', key: 'nav.about', href: '/#about' },
  { id: 'nav-career', key: 'nav.career', href: '/#career' },
  { id: 'nav-skills', key: 'nav.skills', href: '/#skills' },
  { id: 'nav-projects', key: 'nav.projects', href: '/projects' },
  { id: 'nav-articles', key: 'nav.articles', href: '/articles' },
  { id: 'nav-radar', key: 'nav.radar', href: '/radar' },
  { id: 'nav-contact', key: 'nav.contact', href: '/contact' },
] as const;

const themes = ['dark', 'light', 'system'] as const;
const locales = ['en', 'tr'] as const satisfies readonly Locale[];

function item(
  id: string,
  label: string,
  action: CommandAction,
  extra: string[] = []
): CommandItem {
  return { id, label, action, keywords: [fold(label), ...extra] };
}

// Pure so the palette's contents can be tested without rendering it.
export function buildCommands({
  t,
  socials,
}: {
  t: Translate;
  socials: Social[];
}): CommandGroup[] {
  return [
    {
      id: 'navigate',
      heading: t('groups.navigate'),
      items: [
        ...sections.map(({ id, key, href }) =>
          item(id, t(key), { type: 'navigate', href }, [key.slice(4)])
        ),
        item('open-terminal', t('openTerminal'), { type: 'terminal' }, [
          'terminal',
          'shell',
          'console',
        ]),
      ],
    },
    {
      id: 'preferences',
      heading: t('groups.preferences'),
      items: [
        ...themes.map((theme) =>
          item(
            `theme-${theme}`,
            t(`theme.${theme}`),
            { type: 'theme', theme },
            ['theme', theme]
          )
        ),
        ...locales.map((locale) =>
          item(
            `locale-${locale}`,
            t(`locale.${locale}`),
            {
              type: 'locale',
              locale,
            },
            ['language', locale]
          )
        ),
      ],
    },
    {
      id: 'contact',
      heading: t('groups.contact'),
      items: [
        item('copy-email', t('copyEmail'), { type: 'copy-email' }, [
          'email',
          'mail',
        ]),
      ],
    },
    {
      id: 'links',
      heading: t('groups.links'),
      items: socials.map((social) =>
        item(`link-${social.id}`, social.label, {
          type: 'external',
          href: social.href,
        })
      ),
    },
  ];
}
