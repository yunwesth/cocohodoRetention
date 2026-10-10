'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabase, isConfigured } from '@/lib/supabase';
import { friendlyError, normalizePhone } from '@/lib/loyalty';

export function useAuthForm(staff: boolean) {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [sentPhone, setSentPhone] = useState('');
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [cooldown, setCooldown] = useState(0);
  useEffect(() => { if (!cooldown) return; const id = setTimeout(() => setCooldown(cooldown - 1), 1000); return () => clearTimeout(id); }, [cooldown]);

  async function sendCode() {
    const normalized = normalizePhone(phone);
    const { error } = await getSupabase().auth.signInWithOtp({ phone: normalized });
    if (error) throw error;
    setSentPhone(normalized); setCooldown(60);
  }
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (busy || !isConfigured) return;
    setBusy(true); setError('');
    try {
      const supabase = getSupabase();
      if (staff) {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw error;
        const { data: allowed, error: roleError } = await supabase.rpc('is_staff');
        if (roleError) throw roleError;
        if (!allowed) { await supabase.auth.signOut(); throw new Error('This account does not have cashier access. Ask the shop owner for the staff login.'); }
        router.replace('/cashier');
      } else if (sentPhone) {
        const { error } = await supabase.auth.verifyOtp({ phone: sentPhone, token, type: 'sms' });
        if (error) throw error;
        router.replace('/');
      } else { await sendCode(); }
    } catch (error) { setError(friendlyError(error)); }
    finally { setBusy(false); }
  }
  async function resend() {
    if (cooldown || busy) return;
    setBusy(true); setError('');
    try { await sendCode(); } catch (error) { setError(friendlyError(error)); }
    finally { setBusy(false); }
  }

  return { phone, setPhone, sentPhone, setSentPhone, token, setToken, email, setEmail, password, setPassword, busy, error, setError, cooldown, submit, resend };
}
