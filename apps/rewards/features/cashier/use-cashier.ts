'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabase, isConfigured } from '@/lib/supabase';
import { friendlyError, MemberCard, normalizeMemberCode } from '@/lib/loyalty';

type PendingAction = { id: string; code: string; kind: 'award' | 'redeem'; drinks: number };

export function useCashier() {
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

  return { allowed, scanning, setScanning, code, setCode, card, setCard, drinks, setDrinks, busy, error, success, setSuccess, confirmRedeem, setConfirmRedeem, online, pending, lookup, manualLookup, mutate, nextCustomer };
}
