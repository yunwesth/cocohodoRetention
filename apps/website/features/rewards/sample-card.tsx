import { Gift } from 'lucide-react';
import { BrandMark } from '@cocohodo/ui/brand-mark';

export function RewardsCard() {
  return <div className="sample-card" aria-label="Sample rewards card with seven of ten stamps"><div className="card-brand"><BrandMark /><span>cocohodo</span><span className="sample-label">SAMPLE CARD</span></div><p>A little closer to<br /><em>your next treat.</em></p><div className="sample-stamps" aria-hidden="true">{Array.from({ length: 10 }, (_, i) => <span key={i} className={i < 7 ? 'filled' : ''}>{i === 9 ? <Gift size={22} /> : i < 7 ? <BrandMark /> : i + 1}</span>)}</div><div className="card-caption"><span>7 of 10 stamps</span><span>Made for your everyday moments.</span></div></div>;
}
