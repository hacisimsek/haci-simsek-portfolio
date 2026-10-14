import type { Social } from '@/content';

// "https://x.com/CodeWithHaci/" → "@CodeWithHaci"; undefined without an X
// profile so callers can leave the field out.
export function xHandle(socials: Social[]): string | undefined {
  const x = socials.find((social) => social.id === 'x');
  if (!x) return undefined;
  const name = new URL(x.href).pathname.replace(/^\/+|\/+$/g, '');
  return name ? `@${name}` : undefined;
}
