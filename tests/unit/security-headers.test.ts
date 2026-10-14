// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { securityHeaders } from '@/lib/security-headers';

describe('securityHeaders', () => {
  it('sets the baseline hardening headers', () => {
    expect(
      Object.fromEntries(securityHeaders.map((h) => [h.key, h.value]))
    ).toEqual({
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'X-Frame-Options': 'DENY',
      'Permissions-Policy':
        'camera=(), microphone=(), geolocation=(), browsing-topics=()',
    });
  });
});
