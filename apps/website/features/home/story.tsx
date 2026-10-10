import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { FoodPhoto } from '../../components/ui/food-photo';

export function StorySection() {
  return <section className="story-section container"><FoodPhoto name="taiyaki-flowers" alt="Taiyaki pastries beside pink blossoms" /><div className="story-copy"><span className="eyebrow">A TASTE OF SOMETHING FAMILIAR</span><h2>Little treats.<br /><em>Lovely traditions.</em></h2><p>There’s a kind of joy in finding your favorite pastry. In a coffee break that lasts a little longer. In bringing a box of something sweet to someone you love.</p><p>From Korean walnut pastries to croissant taiyaki, we’re here for those little moments. Find yours at Cocohodo Closter.</p><Link href="/contact/" className="text-link">Our little corner <ArrowRight size={17} /></Link></div></section>;
}
