import type { MetadataRoute } from 'next';
import { sitemapEntries } from '@/lib/sitemap-entries';

export default function sitemap(): MetadataRoute.Sitemap {
  return sitemapEntries();
}
