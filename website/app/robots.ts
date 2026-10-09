import type { MetadataRoute } from 'next';
import { publicLaunch, siteOrigin } from '../lib/site';
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: '*', ...(publicLaunch ? { allow: '/' } : { disallow: '/' }) }, ...(publicLaunch ? { sitemap: `${siteOrigin}/sitemap.xml` } : {}) };
}
