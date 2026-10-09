import type { Metadata, Viewport } from 'next';
import { Navigation } from '../components/navigation';
import { Footer } from '../components/site';
import { siteOrigin, publicLaunch } from '../lib/site';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title: { default: 'Cocohodo Closter | Korean pastries & coffee', template: '%s | Cocohodo Closter' },
  description: 'Explore Korean walnut pastries, croissant taiyaki, bubble tea and coffee at Cocohodo in Closter, New Jersey.',
  robots: { index: publicLaunch, follow: publicLaunch },
  icons: { icon: '/icon.svg' },
};
export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#f8f5f2' };
export default function Layout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body><a className="skip-link" href="#main">Skip to content</a><Navigation /><main id="main">{children}</main><Footer /></body></html>;
}
