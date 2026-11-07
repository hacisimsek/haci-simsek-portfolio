import { fileURLToPath } from 'node:url';
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import { securityHeaders } from './lib/security-headers';

const withNextIntl = createNextIntlPlugin();

// Analytics ship only in Vercel builds; elsewhere they resolve to a no-op.
const insightsStub = './lib/vercel-insights-stub.tsx';
const insightsAliases: Record<string, string> =
  process.env.VERCEL === '1'
    ? {}
    : {
        '@vercel/analytics/next': insightsStub,
        '@vercel/speed-insights/next': insightsStub,
      };

const nextConfig: NextConfig = {
  turbopack: { resolveAlias: insightsAliases },
  // Same stub for `next build --webpack`; webpack wants absolute paths.
  webpack(config) {
    for (const [name, path] of Object.entries(insightsAliases)) {
      config.resolve.alias[name] = fileURLToPath(
        new URL(path, import.meta.url)
      );
    }
    return config;
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    // The radar's avatars, site icons and cover pictures (lib/feeds/radar.ts).
    // Objects, not new URL(): a URL pattern also pins an empty query string.
    remotePatterns: [
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: 'opengraph.githubassets.com' },
      {
        protocol: 'https',
        hostname: 'cdn-thumbnails.huggingface.co',
        pathname: '/social-thumbnails/papers/**',
      },
      { protocol: 'https', hostname: 'media2.dev.to' },
      {
        protocol: 'https',
        hostname: 'www.google.com',
        pathname: '/s2/favicons',
      },
    ],
    // Radar pictures rarely change; a week keeps the optimizer's work low.
    minimumCacheTTL: 604800,
  },
  // Some clients still ask for /favicon.ico; hand them the generated icon.
  async rewrites() {
    return [{ source: '/favicon.ico', destination: '/icon' }];
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};

export default withNextIntl(nextConfig);
