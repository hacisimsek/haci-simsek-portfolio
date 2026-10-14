// @vitest-environment node
import { describe, expect, it, vi } from 'vitest';
import {
  contactSchema,
  FORMSPREE_ENDPOINT,
  submitContact,
  type ContactValues,
} from '@/lib/contact';

const t = (key: string) => `[${key}]`;
const valid: ContactValues = {
  name: 'Ada',
  email: 'ada@example.com',
  message: 'We need help moving our checkout to services.',
  _gotcha: '',
};

describe('contactSchema', () => {
  const schema = contactSchema(t);
  const errorFor = (values: Partial<ContactValues>) =>
    schema.safeParse({ ...valid, ...values }).error?.issues[0]?.message;

  it('accepts a complete message', () => {
    expect(schema.safeParse(valid).success).toBe(true);
  });

  it('trims a pasted email before checking it', () => {
    const result = schema.safeParse({ ...valid, email: ' ada@example.com ' });
    expect(result.success).toBe(true);
    expect(result.data?.email).toBe('ada@example.com');
  });

  it('explains each invalid field with a translated message', () => {
    expect(errorFor({ name: ' A ' })).toBe('[nameRequired]');
    expect(errorFor({ email: 'ada@' })).toBe('[emailInvalid]');
    expect(errorFor({ message: 'x'.repeat(19) })).toBe('[messageShort]');
    expect(errorFor({ message: 'x'.repeat(5001) })).toBe('[messageLong]');
  });
});

describe('submitContact', () => {
  it('posts JSON to Formspree without the honeypot field', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response('{}'));
    await expect(submitContact(valid, fetchImpl)).resolves.toBe('sent');
    const [url, init] = fetchImpl.mock.calls[0];
    expect(url).toBe(FORMSPREE_ENDPOINT);
    expect(init.method).toBe('POST');
    expect(init.headers).toMatchObject({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    });
    expect(JSON.parse(init.body)).toEqual({
      name: 'Ada',
      email: 'ada@example.com',
      message: valid.message,
    });
  });

  it('pretends to succeed for bots and sends nothing', async () => {
    const fetchImpl = vi.fn();
    await expect(
      submitContact({ ...valid, _gotcha: 'spam.example' }, fetchImpl)
    ).resolves.toBe('sent');
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('reports failures from Formspree and the network', async () => {
    const rejected = vi
      .fn()
      .mockResolvedValue(new Response('', { status: 422 }));
    await expect(submitContact(valid, rejected)).resolves.toBe('failed');
    const offline = vi.fn().mockRejectedValue(new TypeError('offline'));
    await expect(submitContact(valid, offline)).resolves.toBe('failed');
  });
});
