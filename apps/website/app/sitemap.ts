import type { MetadataRoute } from 'next';
import { publicLaunch } from '../config/server';
import { siteOrigin } from '../config/public';
export default function sitemap(): MetadataRoute.Sitemap {
  return publicLaunch ? ['/', '/menu/', '/order/', '/contact/', '/rewards/', '/privacy/', '/rewards/terms/'].map(path => ({ url: `${siteOrigin}${path}` })) : [];
}
