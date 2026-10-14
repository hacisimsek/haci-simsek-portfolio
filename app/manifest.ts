import type { MetadataRoute } from 'next';
import { profile } from '@/content';
import { brand } from '@/lib/og/brand';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: profile.asciiName,
    short_name: profile.asciiName,
    description: profile.headline.en,
    start_url: '/',
    display: 'standalone',
    background_color: brand.background,
    theme_color: brand.background,
    icons: [
      { src: '/icon', sizes: '512x512', type: 'image/png' },
      { src: '/apple-icon', sizes: '180x180', type: 'image/png' },
    ],
  };
}
