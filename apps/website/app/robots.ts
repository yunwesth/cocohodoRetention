import type { MetadataRoute } from 'next';
import { publicLaunch } from '../config/server';
import { siteOrigin } from '../config/public';
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: '*', ...(publicLaunch ? { allow: '/' } : { disallow: '/' }) }, ...(publicLaunch ? { sitemap: `${siteOrigin}/sitemap.xml` } : {}) };
}
