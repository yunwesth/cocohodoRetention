import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { FoodPhoto } from '../../components/ui/food-photo';
import { favorites } from '../../content/home';

export function FavoritesSection() {
  return <section className="section container"><div className="section-heading"><div><span className="eyebrow">FIND YOUR HAPPY LITTLE THING</span><h2>Something sweet.<br /><em>Something for you.</em></h2></div><Link href="/menu/" className="text-link">See the menu <ArrowRight size={17} /></Link></div><div className="favorites-grid">{favorites.map((item) => <Link className="favorite" href={`/menu/#${item.id}`} key={item.id}><FoodPhoto name={item.photo} alt={item.name} /><div className="favorite-title"><h3>{item.name}</h3><ArrowUpRight size={19} /></div><span className="korean" lang="ko">{item.korean}</span><p>{item.note}</p></Link>)}</div></section>;
}
