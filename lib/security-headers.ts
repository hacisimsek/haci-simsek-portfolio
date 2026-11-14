// Applied to every route in next.config.ts.
//
// shortcut: script-src allows 'unsafe-inline' because Next's inline bootstrap
// scripts would otherwise need per-request nonces, which would make every page
// dynamic. Move to nonces if the site ever renders untrusted HTML.
const dev = process.env.NODE_ENV === 'development';

const csp = [
  "default-src 'self'",
  // Dev React uses eval for its error overlay.
  `script-src 'self' 'unsafe-inline'${dev ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline'",
  // Remote pictures all come through /_next/image, so only data/blob extras.
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self' https://formspree.io",
  "form-action 'self' https://formspree.io",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "object-src 'none'",
].join('; ');

export const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'DENY' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
  { key: 'Content-Security-Policy', value: csp },
];
