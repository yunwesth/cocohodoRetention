'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Camera, Check, Coffee, Gift, Minus, Plus, ScanLine, ShieldCheck, X } from 'lucide-react';
import { Shell, LoadingState, Notice } from './shell';
import { Scanner } from './scanner';
import { getSupabase, isConfigured } from '@/lib/supabase';
import { friendlyError, MemberCard, normalizeMemberCode, readableCode } from '@/lib/loyalty';

type PendingAction = { id: string; code: string; kind: 'award' | 'redeem'; drinks: number };

export function Cashier() {
  const router = useRouter();
  const [allowed, setAllowed] = useState(!isConfigured);
  const [scanning, setScanning] = useState(false);
  const [code, setCode] = useState('');
  const [card, setCard] = useState<MemberCard | null>(null);
  const [drinks, setDrinks] = useState(1);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [confirmRedeem, setConfirmRedeem] = useState(false);
  const [online, setOnline] = useState(true);
  const [pending, setPending] = useState<PendingAction | null>(null);
  const actionLock = useRef(false);
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('cocohodo-pending-action');
      if (stored) {
        const saved = JSON.parse(stored) as PendingAction;
        if (typeof saved.id === 'string' && typeof saved.code === 'string' && ['award', 'redeem'].includes(saved.kind) && Number.isInteger(saved.drinks)) {
          // Restore an external transaction journal after hydration.
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setPending(saved);
        } else { sessionStorage.removeItem('cocohodo-pending-action'); }
      }
    } catch { /* Mutation checks storage availability before sending a request. */ }
    async function authorize() {
      if (!isConfigured) return;
      try {
        const { data: { user }, error } = await getSupabase().auth.getUser();
        if (error || !user) { router.replace('/cashier/login'); return; }
        const { data, error: roleError } = await getSupabase().rpc('is_staff');
        if (roleError) throw roleError;
        if (!data) { router.replace('/cashier/login'); return; }
        setAllowed(true);
      } catch (error) { setError(friendlyError(error)); }
    }
    void authorize();
    const updateOnline = () => setOnline(navigator.onLine);
    updateOnline();
    window.addEventListener('online', updateOnline); window.addEventListener('offline', updateOnline);
    const subscription = isConfigured ? getSupabase().auth.onAuthStateChange((event) => { if (event === 'SIGNED_OUT') { setAllowed(false); setCard(null); router.replace('/cashier/login'); } }) : null;
    return () => { window.removeEventListener('online', updateOnline); window.removeEventListener('offline', updateOnline); subscription?.data.subscription.unsubscribe(); };
  }, [router]);

  async function lookup(value: string) {
    setScanning(false);
    if (actionLock.current || !isConfigured || pending) return;
    actionLock.current = true; setBusy(true); setError(''); setSuccess(''); setCard(null);
    try {
      const normalized = normalizeMemberCode(value);
      const { data, error } = await getSupabase().rpc('lookup_member', { p_member_code: normalized });
      if (error) throw error;
      setCard(data as MemberCard); setCode(normalized); setDrinks(1); setConfirmRedeem(false);
    } catch (error) { setError(friendlyError(error)); }
    finally { actionLock.current = false; setBusy(false); }
  }
  function manualLookup(event: FormEvent) { event.preventDefault(); void lookup(code); }

  async function mutate(kind: 'award' | 'redeem', retry?: PendingAction) {
    if (actionLock.current || !isConfigured || !navigator.onLine || (!card && !retry)) return;
    const action = retry ?? { id: crypto.randomUUID(), code: card!.member_code, kind, drinks: kind === 'award' ? drinks : 0 };
    // Save before sending so a lost response or reload can safely retry the same request.
    try { sessionStorage.setItem('cocohodo-pending-action', JSON.stringify(action)); }
    catch { setError('Enable browser session storage before awarding or redeeming stamps.'); return; }
    setPending(action); actionLock.current = true; setBusy(true); setError(''); setSuccess('');
    try {
      const { data, error } = await getSupabase().rpc('apply_loyalty_action', { p_member_code: action.code, p_kind: action.kind, p_drinks: action.drinks, p_request_id: action.id });
      if (error) {
        // Server-declared validation/auth failures are definitive; transport errors remain retryable.
        if (['P0001', '22023', '42501', 'PGRST301', 'PGRST302', '23514', '22003'].includes(error.code)) { sessionStorage.removeItem('cocohodo-pending-action'); setPending(null); }
        throw error;
      }
      setCard(data as MemberCard); setCode(action.code); setConfirmRedeem(false);
      setSuccess(action.kind === 'award' ? `${action.drinks} ${action.drinks === 1 ? 'stamp' : 'stamps'} added. A little closer to their next reward.` : 'Free drink redeemed. Their next card is ready.');
      sessionStorage.removeItem('cocohodo-pending-action'); setPending(null);
    } catch (error) { setError(friendlyError(error)); }
    finally { actionLock.current = false; setBusy(false); }
  }

  function nextCustomer() { if (pending || busy) return; setCard(null); setCode(''); setSuccess(''); setError(''); setConfirmRedeem(false); setScanning(true); }

  return <Shell staff><div className="page-heading"><div><div className="overline"><span />A LITTLE HOSPITALITY GOES A LONG WAY</div><h1>Make their day.</h1><p>Scan a member’s code. Add a little something to their usual.</p></div><span className="club-pill"><ShieldCheck size={16} />CASHIER STATION</span></div>
    {!online && <Notice>You’re offline. Reconnect before adding stamps or redeeming a reward.</Notice>}
    {error && <Notice>{error} {!allowed && <Link href="/cashier/login">Return to staff sign in</Link>}</Notice>}
    {success && <div className="success-notice" role="status"><Check size={18} />{success}</div>}
    {pending && <div className="pending-action"><strong>A transaction needs confirmation.</strong><p>Retry the saved {pending.kind === 'award' ? `${pending.drinks}-stamp award` : 'redemption'} to confirm its result. It will only be applied once.</p><button className="button primary" disabled={busy || !online || !allowed || !isConfigured} onClick={() => void mutate(pending.kind, pending)}>{busy ? 'Checking…' : 'Confirm saved transaction'}</button></div>}
    {!allowed ? <LoadingState /> : <div className="cashier-grid"><section className="scanner-card"><div className="section-header"><h2><ScanLine size={20} />Find a member</h2>{scanning && <button className="icon-button" aria-label="Stop scanning" onClick={() => setScanning(false)}><X size={18} /></button>}</div>{scanning ? <Scanner onScan={(value) => void lookup(value)} /> : <div className="scanner-placeholder"><div className="scanner-illustration"><ScanLine size={62} strokeWidth={1} /></div><h3>The next good thing starts with a scan.</h3><p>Use your device’s camera to scan<br />the customer’s member QR code.</p><button className="button primary" onClick={() => { setScanning(true); setCard(null); setSuccess(''); }} disabled={!isConfigured || busy || !!pending || !online}><Camera size={17} />Open scanner</button></div>}<div className="manual-entry"><div className="or-divider"><span>OR ENTER THEIR MEMBER CODE</span></div><form onSubmit={manualLookup}><label className="sr-only" htmlFor="member-code">Member code</label><input id="member-code" placeholder="Paste or type member code" value={code} onChange={(e) => setCode(e.target.value)} disabled={busy || !!pending} /><button className="button secondary" type="submit" disabled={!isConfigured || busy || !code.trim() || !!pending || !online}>{busy ? 'Finding…' : 'Find member'}<ArrowRight size={16} /></button></form><p>The customer can copy their full code from their rewards page.</p></div></section>
      <section className="transaction-card"><div className="section-header"><h2>Member’s card</h2><Coffee size={20} /></div>{!card ? <div className="no-member"><div><Coffee size={32} strokeWidth={1.2} /></div><h3>A familiar face, a fresh reward.</h3><p>Scan or enter a member code to see<br />their stamps and available reward.</p></div> : <><p className="cashier-member-code">{readableCode(card.member_code)}</p><div className="cashier-progress"><strong>{card.stamps}<span> / 10</span></strong><span>{card.stamps === 10 ? 'Free drink ready' : 'Stamps collected'}</span></div><div className="progress-track"><span style={{ width: `${card.stamps * 10}%` }} /></div>{card.pending_stamps > 0 && <p className="input-hint">{card.pending_stamps} stamps saved for after redemption.</p>}
        {card.stamps === 10 ? <div className="redeem-panel"><Gift size={26} /><h3>Their next drink is on us.</h3><p>Serve the free drink, then confirm redemption to start their next card. Free drinks do not earn stamps.</p>{confirmRedeem ? <><p className="confirm-text">Has the customer received their free drink?</p><button className="button primary" disabled={busy || !online || !!pending} onClick={() => void mutate('redeem')}>Yes, redeem free drink<Check size={17} /></button><button className="text-button" disabled={busy} onClick={() => setConfirmRedeem(false)}>Cancel</button></> : <button className="button primary" disabled={busy || !online || !!pending} onClick={() => setConfirmRedeem(true)}>Redeem free drink<Gift size={17} /></button>}</div> : <div className="award-panel"><label htmlFor="drink-count">Eligible drinks purchased</label><div className="quantity-input"><button aria-label="Remove one drink" disabled={busy || !!pending || drinks <= 1} onClick={() => setDrinks(drinks - 1)}><Minus size={18} /></button><input id="drink-count" type="number" min={1} max={100} value={drinks || ''} disabled={busy || !!pending} onChange={(e) => setDrinks(Number(e.target.value))} /><button aria-label="Add one drink" disabled={busy || !!pending || drinks >= 100} onClick={() => setDrinks(drinks + 1)}><Plus size={18} /></button></div><p>One stamp per paid drink. Exclude free reward drinks.</p>{card.stamps + drinks > 10 && <div className="overflow-hint">This completes their card. {card.stamps + drinks - 10} extra stamps will be saved until they redeem.</div>}<button className="button primary" disabled={busy || !online || !!pending || !Number.isInteger(drinks) || drinks < 1 || drinks > 100} onClick={() => void mutate('award')}>{busy ? 'Adding stamps…' : `Confirm ${drinks} ${drinks === 1 ? 'stamp' : 'stamps'}`}<Plus size={16} /></button></div>}
        <button className="next-customer" disabled={busy || !!pending} onClick={nextCustomer}>Next customer<ArrowRight size={16} /></button></> }</section></div>}
    <div className="cashier-note"><ShieldCheck size={17} /><p>Every stamp and redemption is recorded under the shared shop account. Confirm the purchase before awarding stamps.</p></div>
  </Shell>;
}
