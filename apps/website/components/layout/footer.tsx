import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { BrandMark } from '@cocohodo/ui/brand-mark';
import { content, addressLine, hoursLine, closedLine } from '../../lib/content';
import { rewardsOrigin } from '../../config/public';

export function Footer() {
  return <footer className="site-footer"><div className="container"><div className="footer-grid"><div><Link className="wordmark" href="/"><BrandMark /><span>cocohodo<small>A LITTLE EVERYDAY JOY.</small></span></Link><p>Korean treats. Coffee moments.<br />Right here in Closter.</p></div><div><h2>Come on over</h2><a href={content.store.directions.href} target="_blank" rel="noopener noreferrer"><MapPin size={14} />{addressLine}</a><a href={content.store.phone.href}>{content.store.phone.value}</a><p>{hoursLine}<br />{closedLine}</p></div><div><h2>Explore</h2><Link href="/menu/">Our menu</Link><Link href="/order/">Order online</Link><Link href="/rewards/">Cocohodo rewards</Link><Link href="/contact/">Visit us</Link></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Cocohodo Closter</span><div><Link href="/privacy/">Privacy</Link><Link href="/rewards/terms/">Rewards terms</Link><a href={`${rewardsOrigin}/cashier/login`}>Staff sign in</a></div></div></div></footer>;
}
