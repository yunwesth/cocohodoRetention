'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabase, isConfigured } from '@/lib/supabase';
import { friendlyError, MemberCard, previewCard } from '@/lib/loyalty';

export function useMemberCard() {
  const router = useRouter();
  const [card, setCard] = useState<MemberCard | null>(isConfigured ? null : previewCard);
  const [error, setError] = useState('');
  const refresh = useCallback(async () => {
    if (!isConfigured) return;
    try {
      const supabase = getSupabase();
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (!user && (!authError || authError.name === 'AuthSessionMissingError' || [400, 401, 403].includes(authError.status ?? 0))) {
        setCard(null); router.replace('/login'); return;
      }
      if (authError) throw authError;
      if (!user) { router.replace('/login'); return; }
      const { data, error } = await supabase.rpc('get_my_card');
      if (error) throw error;
      setCard(data as MemberCard); setError('');
    } catch (error) { setError(friendlyError(error)); }
  }, [router]);
  useEffect(() => {
    // Initial synchronization with the authenticated remote membership.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh();
    const onVisible = () => { if (document.visibilityState === 'visible') void refresh(); };
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('focus', onVisible);
    const timer = setInterval(onVisible, 15000);
    const subscription = isConfigured ? getSupabase().auth.onAuthStateChange((event) => { if (event === 'SIGNED_OUT') router.replace('/login'); }) : null;
    return () => { clearInterval(timer); document.removeEventListener('visibilitychange', onVisible); window.removeEventListener('focus', onVisible); subscription?.data.subscription.unsubscribe(); };
  }, [refresh, router]);
  return { card, error, refresh };
}
