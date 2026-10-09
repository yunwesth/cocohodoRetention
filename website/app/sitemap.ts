import type { MetadataRoute } from 'next';
import { publicLaunch, siteOrigin } from '../lib/site';
export default function sitemap(): MetadataRoute.Sitemap {
  return publicLaunch ? ['/', '/menu/', '/order/', '/contact/', '/rewards/', '/privacy/', '/rewards/terms/'].map(path => ({ url: `${siteOrigin}${path}` })) : [];
}
