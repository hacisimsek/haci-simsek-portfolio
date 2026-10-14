import {
  education,
  experience,
  featuredProjects,
  profile,
  skills,
  socials,
  t as pick,
  type Locale,
} from '@/content';
import { formatPeriod } from '@/lib/dates';

export type Line = {
  kind: 'input' | 'output' | 'error';
  text: string;
  href?: string;
};

export type Effect =
  | { type: 'clear' }
  | { type: 'close' }
  | { type: 'theme'; theme: 'dark' | 'light' | 'system' }
  | { type: 'locale'; locale: Locale }
  | { type: 'navigate'; href: string };

type Context = {
  locale: Locale;
  t: (key: string, values?: Record<string, string | number>) => string;
};

type Result = { lines: Line[]; effect?: Effect };

const THEMES = ['dark', 'light', 'system'] as const;
const LOCALES = ['en', 'tr'] as const;

const out = (text: string, href?: string): Line => ({
  kind: 'output',
  text,
  ...(href ? { href } : {}),
});
const error = (text: string): Line => ({ kind: 'error', text });

const handlers: Record<string, (args: string[], ctx: Context) => Result> = {
  help: (_, { t }) => ({
    lines: [
      out(t('helpHeader')),
      ...COMMANDS.map((name) =>
        out(`  ${name.padEnd(12)}${t(`help.${name}`)}`)
      ),
    ],
  }),
  whoami: (_, { locale }) => {
    const major = education.find((item) => item.track === 'major')!;
    return {
      lines: [
        out(`${profile.name} · ${pick(profile.role, locale)}`),
        out(pick(profile.headline, locale)),
        out(`${pick(profile.city, locale)} · ${pick(major.school, locale)}`),
      ],
    };
  },
  skills: (_, { locale }) => ({
    lines: skills.map((category) =>
      out(
        `${pick(category.title, locale)}: ${pick(category.items, locale).join(', ')}`
      )
    ),
  }),
  experience: (_, { locale }) => ({
    lines: experience.map((role) =>
      out(
        `${formatPeriod(role.start, role.end, locale).padEnd(22)}${pick(role.title, locale)} · ${pick(role.company, locale)}`
      )
    ),
  }),
  projects: (_, { t }) => ({
    lines: [
      out(t('projectsHeader')),
      ...featuredProjects.map((project) =>
        out(project.name, `https://github.com/hacisimsek/${project.name}`)
      ),
    ],
  }),
  contact: () => ({
    lines: [
      out(profile.email, `mailto:${profile.email}`),
      ...socials.map((social) => out(social.label, social.href)),
    ],
  }),
  theme: ([value], { t }) => {
    const theme = THEMES.find((name) => name === value);
    if (!theme) {
      return { lines: [error(`${t('usage')}: theme <${THEMES.join('|')}>`)] };
    }
    return {
      lines: [out(t('themeSet', { theme }))],
      effect: { type: 'theme', theme },
    };
  },
  lang: ([value], { t }) => {
    const locale = LOCALES.find((name) => name === value);
    if (!locale) {
      return { lines: [error(`${t('usage')}: lang <${LOCALES.join('|')}>`)] };
    }
    return {
      lines: [out(t('langSet', { language: locale }))],
      effect: { type: 'locale', locale },
    };
  },
  clear: () => ({ lines: [], effect: { type: 'clear' } }),
  exit: (_, { t }) => ({ lines: [out(t('bye'))], effect: { type: 'close' } }),
  sudo: (args, { t }) => {
    if (args.join(' ') !== 'hire-me')
      return { lines: [error(t('sudoDenied'))] };
    return {
      lines: [out(t('hirePassword')), out(t('hireGranted'))],
      effect: { type: 'navigate', href: '/contact' },
    };
  },
};

export const COMMANDS = Object.keys(handlers).sort();

export function run(input: string, ctx: Context): Result {
  const [name = '', ...args] = input.trim().split(/\s+/).filter(Boolean);
  if (!name) return { lines: [] };
  const handler = handlers[name.toLowerCase()];
  if (!handler) {
    return { lines: [error(ctx.t('notFound', { command: name }))] };
  }
  return handler(
    args.map((arg) => arg.toLowerCase()),
    ctx
  );
}

export function complete(prefix: string): string[] {
  const value = prefix.trim().toLowerCase();
  return COMMANDS.filter((name) => name.startsWith(value));
}
