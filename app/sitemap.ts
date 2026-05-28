import type { MetadataRoute } from 'next';
import { canonicalUrl } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: canonicalUrl('/daily'),
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: canonicalUrl('/about'),
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];
}
