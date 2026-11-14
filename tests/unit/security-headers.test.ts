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
      'Content-Security-Policy': expect.any(String),
    });
  });

  it('limits scripts, frames and form posts to the site and Formspree', () => {
    const csp = securityHeaders.find(
      (h) => h.key === 'Content-Security-Policy'
    )!.value;
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("base-uri 'self'");
    expect(csp).toContain("form-action 'self' https://formspree.io");
    expect(csp).toContain("connect-src 'self' https://formspree.io");
    // Production never allows eval.
    expect(csp).not.toContain('unsafe-eval');
  });
});
