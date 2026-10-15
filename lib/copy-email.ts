import { openMailto } from '@/lib/mailto';

// Copies the address, or opens the mail client when the clipboard is blocked.
export async function copyEmail(email: string): Promise<'copied' | 'mailto'> {
  try {
    await navigator.clipboard.writeText(email);
    return 'copied';
  } catch {
    openMailto(email);
    return 'mailto';
  }
}
