import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { rewardsLive } from '../../config/public';
import { RewardsCard } from './sample-card';

export function RewardsSection() {
  return <section className="rewards-band"><div className="container rewards-grid"><div><span className="eyebrow">A LITTLE THANK-YOU</span><h2>Your daily ritual.<br /><em>A little more rewarding.</em></h2><p>Make room for a little joy on your next visit. Your digital stamp card keeps your coffee moments together.</p><Link href="/rewards/" className="button light">Explore rewards <ArrowRight size={17} /></Link><span className="subnote">{rewardsLive ? 'Your card, right on your phone.' : 'Take a look at our rewards preview.'}</span></div><RewardsCard /></div></section>;
}
