import Link from 'next/link';
import { ArrowRight, ArrowUpRight, MapPin, Sparkles } from 'lucide-react';
import { BrandMark } from '../../components/brand';
import { FoodPhoto, RewardsSection, VisitDetails } from '../components/site';
import { address, content, pageMetadata, siteOrigin } from '../lib/site';

export const metadata = pageMetadata('Korean pastries & coffee in Closter', 'A little everyday joy. Discover walnut pastries, croissant taiyaki, bubble tea, and coffee at Cocohodo Closter.', '/');
const favorites = [
  { name: 'Walnut pastries', korean: '호도과자', photo: 'walnut-pastries', id: 'walnut-pastries', note: 'Little bites. A lovely tradition.' },
  { name: 'Croissant taiyaki', korean: '크로아상 붕어빵', photo: 'Taiyaki', id: 'taiyaki', note: 'A flaky little pick-me-up.' },
  { name: 'Bubble tea', korean: '버블티', photo: 'boba-tea', id: 'bubble-tea-smoothies', note: 'Your sip of something happy.' },
  { name: 'Shaved ice', korean: '눈꽃빙수', photo: 'CocoShavedIce', id: 'shaved-ice', note: 'A sweet reason to slow down.' },
];
export default function Home() {
  const business = { '@context': 'https://schema.org', '@type': 'CafeOrCoffeeShop', name: content.store.name.value, url: siteOrigin, telephone: '+12017672626', address: { '@type': 'PostalAddress', streetAddress: address.street, addressLocality: address.city, addressRegion: address.region, postalCode: address.postalCode, addressCountry: address.country }, hasMenu: `${siteOrigin}/menu/`, openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: content.store.hours.value.daysOpen, opens: content.store.hours.value.opens, closes: content.store.hours.value.closes }] };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(business).replace(/</g, '\\u003c') }} />
    <section className="hero container"><div className="hero-copy"><span className="eyebrow"><span className="little-dot" /> YOUR LITTLE CORNER OF CLOSTER</span><h1>A little sweet.<br />A little warm.<br /><em>A little joy.</em></h1><p>Korean walnut pastries, croissant taiyaki, and your favorite cup. Small moments, made sweeter.</p><div className="button-row"><Link href="/menu/" className="button">Explore the menu <ArrowRight size={17} /></Link><Link href="/contact/" className="text-link">Come say hello <ArrowUpRight size={17} /></Link></div><div className="hero-location"><MapPin size={16} /><span>{address.street} · Closter, NJ</span></div></div><div className="hero-art"><FoodPhoto name="korean-walnut-pastry" alt="Golden Korean walnut pastries, photographed for Cocohodo's website" priority /><div className="hero-sticker"><BrandMark /><span>A LITTLE<br />EVERYDAY JOY</span></div><span className="photo-caption">KOREAN TRADITION. CLOSTER CHARM.</span></div></section>
    <div className="ribbon" aria-hidden="true"><span>WALNUT PASTRIES</span><BrandMark /><span>CROISSANT TAIYAKI</span><BrandMark /><span>BUBBLE TEA</span><BrandMark /><span>COFFEE & LITTLE MOMENTS</span><BrandMark /></div>
    <section className="section container"><div className="section-heading"><div><span className="eyebrow">FIND YOUR HAPPY LITTLE THING</span><h2>Something sweet.<br /><em>Something for you.</em></h2></div><Link href="/menu/" className="text-link">See the menu <ArrowRight size={17} /></Link></div><div className="favorites-grid">{favorites.map((item) => <Link className="favorite" href={`/menu/#${item.id}`} key={item.id}><FoodPhoto name={item.photo} alt={item.name} /><div className="favorite-title"><h3>{item.name}</h3><ArrowUpRight size={19} /></div><span className="korean" lang="ko">{item.korean}</span><p>{item.note}</p></Link>)}</div></section>
    <section className="story-section container"><FoodPhoto name="taiyaki-flowers" alt="Taiyaki pastries beside pink blossoms" /><div className="story-copy"><span className="eyebrow">A TASTE OF SOMETHING FAMILIAR</span><h2>Little treats.<br /><em>Lovely traditions.</em></h2><p>There’s a kind of joy in finding your favorite pastry. In a coffee break that lasts a little longer. In bringing a box of something sweet to someone you love.</p><p>From Korean walnut pastries to croissant taiyaki, we’re here for those little moments. Find yours at Cocohodo Closter.</p><Link href="/contact/" className="text-link">Our little corner <ArrowRight size={17} /></Link></div></section>
    <RewardsSection />
    <section className="visit-section container"><VisitDetails /><div className="visit-art"><Sparkles size={35} /><span>Coffee in hand.<br /><em>Closter at heart.</em></span><div className="visit-art-bottom"><BrandMark /><p>Your next little moment<br />is just around the corner.</p></div></div></section>
  </>;
}
