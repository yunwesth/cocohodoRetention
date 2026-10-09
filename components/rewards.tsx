'use client';

import { useState } from 'react';
import { useMemberCard } from './use-member-card';
import { Hodo } from './hodo';
import { ArrowDown, ArrowRight, Coffee, Gift, Plus, Sparkles } from 'lucide-react';
import { Shell, LoadingState, Notice } from './shell';
import { BrandMark } from './brand';
import { MemberCard } from '@/lib/loyalty';

function StampCard({ card }: { card: MemberCard }) {
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

export function Rewards() {
  const { card, error, refresh } = useMemberCard();
  const [showAll, setShowAll] = useState(false);
  return <Shell>
    {error && <Notice><span>{error} </span><button className="text-button" onClick={() => void refresh()}>Try again</button><a className="text-button" href="/login">Sign in</a></Notice>}
    {!card ? <LoadingState /> : <>
      <section className="hodo-welcome" aria-labelledby="welcome-heading"><p className="hodo-greeting">A little moment for you</p><h1 id="welcome-heading">{card.stamps === 10 ? 'Your treat is ready!' : 'Good to see you again.'}</h1><div className="hodo-scene"><Hodo /><span className="hodo-bubble">{card.stamps === 10 ? 'You earned this ♡' : 'Let’s collect happy little moments.'}</span></div></section>
      <div className="rewards-grid"><StampCard card={card} /></div>
      <div className="lower-grid">
        <section className="activity-card" id="activity"><div className="section-header"><h2>A little history</h2></div><div className="activity-list">{card.activity.length ? (showAll ? card.activity : card.activity.slice(0, 3)).map((item) => <div className="activity-row" key={item.id}><div className={`activity-icon ${item.kind === 'redeem' ? 'gift' : ''}`}>{item.kind === 'award' ? <Coffee size={18} /> : <Gift size={18} />}</div><div className="activity-detail"><strong>{item.kind === 'award' ? 'A coffee kind of day' : 'A drink on us'}</strong><span>{new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span></div><span className={`activity-value ${item.kind === 'redeem' ? 'redeemed' : ''}`}>{item.kind === 'award' ? <><Plus size={12} />{item.drinks} {item.drinks === 1 ? 'stamp' : 'stamps'}</> : 'Redeemed'}</span></div>) : <div className="empty-activity"><Coffee size={25} /><p>Your first sip is the start of something good.</p><span>Scan your code on your next visit.</span></div>}</div>{card.activity.length > 3 ? <button className="activity-more" onClick={() => setShowAll(!showAll)}>{showAll ? 'Show fewer visits' : 'View recent activity'}{showAll ? <ArrowDown size={15} /> : <ArrowRight size={15} />}</button> : null}</section>
      </div>
      <details className="how-section" id="how-it-works"><summary>How it works</summary><p>Show your QR code at the counter. Each eligible drink earns one stamp. Collect 10 for a free drink.</p><p>No expiration. Redeem a full card before collecting more; extra stamps from your last purchase are saved.</p></details>
    </>}
  </Shell>;
}
