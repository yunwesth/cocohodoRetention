import { Gift, Sparkles } from 'lucide-react';
import { BrandMark } from '@cocohodo/ui/brand-mark';
import type { MemberCard } from '@/lib/loyalty';

export function StampCard({ card }: { card: MemberCard }) {
  const ready = card.stamps === 10;
  return <section className="stamp-card" aria-labelledby="stamp-heading">
    <div className="card-topline"><span className="eyebrow">MY STAMPS</span></div>
    <div className="stamp-title-row"><div><h2 id="stamp-heading">{ready ? 'This one’s on us.' : 'Every sip gets you closer.'}</h2><p>{ready ? 'Your free drink is ready. You’ve earned it.' : <>Just <strong>{10 - card.stamps} more {10 - card.stamps === 1 ? 'stamp' : 'stamps'}</strong> until a little treat on us.</>}</p></div><div className="stamp-count">{card.stamps}<span>/ 10</span></div></div>
    <div className="stamps" aria-label={`${card.stamps} out of 10 stamps`}>
      {Array.from({ length: 10 }, (_, i) => <div key={i} className={`stamp ${i < card.stamps ? 'filled' : ''} ${i === 9 ? 'reward-stamp' : ''}`}><div className="stamp-circle">{i < card.stamps ? <BrandMark /> : i === 9 ? <Gift size={23} strokeWidth={1.3} /> : <span>{String(i + 1).padStart(2, '0')}</span>}</div></div>)}
    </div>
    <div className="stamp-card-bottom"><span><Gift size={17} />{ready ? 'Free drink ready' : '10 stamps. Your favorite drink, free.'}</span></div>
    {card.pending_stamps > 0 && <div className="pending-note"><Sparkles size={16} />{card.pending_stamps} {card.pending_stamps === 1 ? 'stamp is' : 'stamps are'} saved for after you redeem this card.</div>}
  </section>;
}

