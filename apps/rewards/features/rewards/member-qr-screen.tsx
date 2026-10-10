'use client';

import Link from 'next/link';
import { Hodo } from '@/features/mascot/hodo';
import { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useMemberCard } from './use-member-card';

export function MemberQRScreen() {
  const { card, error, refresh } = useMemberCard();

  const memberCode = card?.member_code;

  useEffect(() => {
    if (!memberCode || !('wakeLock' in navigator)) return;
    let disposed = false;
    let pending = false;
    let lock: WakeLockSentinel | null = null;
    async function keepAwake() {
      if (disposed || pending || document.visibilityState !== 'visible' || (lock && !lock.released)) return;
      pending = true;
      try {
        const acquired = await navigator.wakeLock.request('screen');
        if (disposed) await acquired.release();
        else lock = acquired;
      } catch {
        // Scanning still works if the browser or battery policy denies wake lock.
      } finally { pending = false; }
    }
    void keepAwake();
    document.addEventListener('visibilitychange', keepAwake);
    return () => {
      disposed = true;
      document.removeEventListener('visibilitychange', keepAwake);
      void lock?.release().catch(() => {});
    };
  }, [memberCode]);

  return <main className="member-qr-screen">
    <Link href="/" className="qr-back" aria-label="Back to rewards"><ArrowLeft size={24} /></Link>
    <h1 className="qr-page-title">My QR</h1>
    {error ? <div className="qr-screen-status" role="alert"><p>{error}</p><button className="button secondary" onClick={() => void refresh()}>Try again</button></div> : card ? <section className="qr-pass" aria-label="Member pass"><div className="qr-pass-welcome"><Hodo /><h2>A little closer to your treat.</h2><p>Show this code at the counter.</p></div><div className="qr-pass-code"><QRCodeSVG value={`cocohodo:${card.member_code}`} size={360} level="M" marginSize={4} bgColor="#ffffff" fgColor="#000000" role="img" aria-label="Your COCOHODO member QR code" /></div><div className="qr-pass-footer"><span>COCOHODO</span><span>{card.stamps === 10 ? 'Your free drink is ready ♡' : `${card.stamps} / 10 stamps collected`}</span></div></section> : <p role="status">Loading QR…</p>}
  </main>;
}
