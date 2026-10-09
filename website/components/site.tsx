import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ArrowUpRight, MapPin, Phone, Gift } from 'lucide-react';
import { BrandMark } from '../../components/brand';
import { content, addressLine, hoursLine, closedLine, rewardsOrigin, rewardsLive } from '../lib/site';

export function FoodPhoto({ name, alt, className = '', priority = false }: { name: string; alt: string; className?: string; priority?: boolean }) {
  return <div className={`food-photo ${className}`}><Image src={`/photos/${name}.webp`} alt={alt} fill sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 650px" priority={priority} /></div>;
}
export function PageIntro({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return <div className="page-intro"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><div className="intro-copy">{children}</div></div>;
}
export function RewardsCard() {
  return <div className="sample-card" aria-label="Sample rewards card with seven of ten stamps"><div className="card-brand"><BrandMark /><span>cocohodo</span><span className="sample-label">SAMPLE CARD</span></div><p>A little closer to<br /><em>your next treat.</em></p><div className="sample-stamps" aria-hidden="true">{Array.from({ length: 10 }, (_, i) => <span key={i} className={i < 7 ? 'filled' : ''}>{i === 9 ? <Gift size={22} /> : i < 7 ? <BrandMark /> : i + 1}</span>)}</div><div className="card-caption"><span>7 of 10 stamps</span><span>Made for your everyday moments.</span></div></div>;
}
export function RewardsSection() {
  return <section className="rewards-band"><div className="container rewards-grid"><div><span className="eyebrow">A LITTLE THANK-YOU</span><h2>Your daily ritual.<br /><em>A little more rewarding.</em></h2><p>Make room for a little joy on your next visit. Your digital stamp card keeps your coffee moments together.</p><Link href="/rewards/" className="button light">Explore rewards <ArrowRight size={17} /></Link><span className="subnote">{rewardsLive ? 'Your card, right on your phone.' : 'Take a look at our rewards preview.'}</span></div><RewardsCard /></div></section>;
}
export function VisitDetails() {
  return <div className="visit-details"><div><span className="eyebrow">FIND OUR LITTLE CORNER</span><h2>See you in<br /><em>Closter.</em></h2></div><address>{addressLine}</address><div className="hours"><p>{hoursLine}</p><p>{closedLine}</p></div><div className="button-row"><a className="button" href={content.store.directions.href} target="_blank" rel="noopener noreferrer">Get directions <ArrowUpRight size={17} /></a><a className="text-link" href={content.store.phone.href}><Phone size={16} />{content.store.phone.value}</a></div><p className="fine">Visiting on a holiday? Give us a call to confirm our hours.</p></div>;
}
export function Footer() {
  return <footer className="site-footer"><div className="container"><div className="footer-grid"><div><Link className="wordmark" href="/"><BrandMark /><span>cocohodo<small>A LITTLE EVERYDAY JOY.</small></span></Link><p>Korean treats. Coffee moments.<br />Right here in Closter.</p></div><div><h2>Come on over</h2><a href={content.store.directions.href} target="_blank" rel="noopener noreferrer"><MapPin size={14} />{addressLine}</a><a href={content.store.phone.href}>{content.store.phone.value}</a><p>{hoursLine}<br />{closedLine}</p></div><div><h2>Explore</h2><Link href="/menu/">Our menu</Link><Link href="/order/">Order online</Link><Link href="/rewards/">Cocohodo rewards</Link><Link href="/contact/">Visit us</Link></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Cocohodo Closter</span><div><Link href="/privacy/">Privacy</Link><Link href="/rewards/terms/">Rewards terms</Link><a href={`${rewardsOrigin}/cashier/login`}>Staff sign in</a></div></div></div></footer>;
}
