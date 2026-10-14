// zod/mini keeps the client bundle small; the API is functional checks.
import { z } from 'zod/mini';

export const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xanyoozp';

export type ContactErrorKey =
  'nameRequired' | 'emailInvalid' | 'messageShort' | 'messageLong';

export type ContactValues = {
  name: string;
  email: string;
  message: string;
  // Honeypot: hidden from people, filled in by naive bots.
  website: string;
};

export function contactSchema(t: (key: ContactErrorKey) => string) {
  return z.object({
    name: z.string().check(z.trim(), z.minLength(2, t('nameRequired'))),
    email: z.email(t('emailInvalid')),
    message: z
      .string()
      .check(
        z.trim(),
        z.minLength(20, t('messageShort')),
        z.maxLength(5000, t('messageLong'))
      ),
    website: z.string(),
  });
}

export type SubmitResult = 'sent' | 'failed';

export async function submitContact(
  { name, email, message, website }: ContactValues,
  fetchImpl: typeof fetch = fetch
): Promise<SubmitResult> {
  // Report success to bots so they don't retry, but send nothing.
  if (website) return 'sent';
  try {
    const response = await fetchImpl(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, message }),
    });
    return response.ok ? 'sent' : 'failed';
  } catch {
    return 'failed';
  }
}
