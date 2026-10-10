'use client';

import { useState } from 'react';
import { ArrowDown, ArrowRight, Coffee, Gift, Plus } from 'lucide-react';
import type { MemberCard } from '@/lib/loyalty';

export function ActivityHistory({ card }: { card: MemberCard }) {
  const [showAll, setShowAll] = useState(false);
  return <section className="activity-card" id="activity"><div className="section-header"><h2>A little history</h2></div><div className="activity-list">{card.activity.length ? (showAll ? card.activity : card.activity.slice(0, 3)).map((item) => <div className="activity-row" key={item.id}><div className={`activity-icon ${item.kind === 'redeem' ? 'gift' : ''}`}>{item.kind === 'award' ? <Coffee size={18} /> : <Gift size={18} />}</div><div className="activity-detail"><strong>{item.kind === 'award' ? 'A coffee kind of day' : 'A drink on us'}</strong><span>{new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span></div><span className={`activity-value ${item.kind === 'redeem' ? 'redeemed' : ''}`}>{item.kind === 'award' ? <><Plus size={12} />{item.drinks} {item.drinks === 1 ? 'stamp' : 'stamps'}</> : 'Redeemed'}</span></div>) : <div className="empty-activity"><Coffee size={25} /><p>Your first sip is the start of something good.</p><span>Scan your code on your next visit.</span></div>}</div>{card.activity.length > 3 ? <button className="activity-more" onClick={() => setShowAll(!showAll)}>{showAll ? 'Show fewer visits' : 'View recent activity'}{showAll ? <ArrowDown size={15} /> : <ArrowRight size={15} />}</button> : null}</section>;
}
