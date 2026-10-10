'use client';

import { useMemberCard } from './use-member-card';
import { Hodo } from '@/features/mascot/hodo';
import { Shell, LoadingState, Notice } from '@/components/layout/shell';
import { StampCard } from './stamp-card';
import { ActivityHistory } from './activity-history';

export function Rewards() {
  const { card, error, refresh } = useMemberCard();
  return <Shell>
    {error && <Notice><span>{error} </span><button className="text-button" onClick={() => void refresh()}>Try again</button><a className="text-button" href="/login">Sign in</a></Notice>}
    {!card ? <LoadingState /> : <>
      <section className="hodo-welcome" aria-labelledby="welcome-heading"><p className="hodo-greeting">A little moment for you</p><h1 id="welcome-heading">{card.stamps === 10 ? 'Your treat is ready!' : 'Good to see you again.'}</h1><div className="hodo-scene"><Hodo /><span className="hodo-bubble">{card.stamps === 10 ? 'You earned this ♡' : 'Let’s collect happy little moments.'}</span></div></section>
      <div className="rewards-grid"><StampCard card={card} /></div>
      <div className="lower-grid">
        <ActivityHistory card={card} />
      </div>
      <details className="how-section" id="how-it-works"><summary>How it works</summary><p>Show your QR code at the counter. Each eligible drink earns one stamp. Collect 10 for a free drink.</p><p>No expiration. Redeem a full card before collecting more; extra stamps from your last purchase are saved.</p></details>
    </>}
  </Shell>;
}
