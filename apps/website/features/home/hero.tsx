import Link from 'next/link';
import { ArrowRight, ArrowUpRight, MapPin } from 'lucide-react';
import { BrandMark } from '@cocohodo/ui/brand-mark';
import { FoodPhoto } from '../../components/ui/food-photo';
import { address } from '../../lib/content';

export function HeroSection() {
  return <section className="hero container"><div className="hero-copy"><span className="eyebrow"><span className="little-dot" /> YOUR LITTLE CORNER OF CLOSTER</span><h1>A little sweet.<br />A little warm.<br /><em>A little joy.</em></h1><p>Korean walnut pastries, croissant taiyaki, and your favorite cup. Small moments, made sweeter.</p><div className="button-row"><Link href="/menu/" className="button">Explore the menu <ArrowRight size={17} /></Link><Link href="/contact/" className="text-link">Come say hello <ArrowUpRight size={17} /></Link></div><div className="hero-location"><MapPin size={16} /><span>{address.street} · Closter, NJ</span></div></div><div className="hero-art"><FoodPhoto name="korean-walnut-pastry" alt="Golden Korean walnut pastries, photographed for Cocohodo's website" priority /><div className="hero-sticker"><BrandMark /><span>A LITTLE<br />EVERYDAY JOY</span></div><span className="photo-caption">KOREAN TRADITION. CLOSTER CHARM.</span></div></section>;
}
