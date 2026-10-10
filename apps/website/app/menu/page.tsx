import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { PageIntro } from '../../components/ui/page-intro';
import { MenuBrowser } from '../../features/menu/menu-browser';
import { pageMetadata } from '../../lib/metadata';
export const metadata = pageMetadata('Our menu', 'Explore walnut pastries, taiyaki, bubble tea, shaved ice and coffee at Cocohodo Closter.', '/menu/');
export default function MenuPage() {
  return <div className="container"><PageIntro eyebrow="MADE FOR YOUR LITTLE MOMENTS" title="Find your next favorite."><p>Something warm, something sweet, something to sip.<br />Take a look around.</p></PageIntro><MenuBrowser /><div className="menu-note"><p>Selection and availability may vary. For current prices, visit the shop or your preferred ordering provider. Please ask the shop about ingredients and allergens before ordering.</p><Link href="/order/" className="text-link">Ready to order? <ArrowUpRight size={17} /></Link></div></div>;
}
