'use client';

import Link from 'next/link';
import { Hodo } from './hodo';
import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { BrandMark } from './brand';
import { Notice } from './shell';
import { getSupabase, isConfigured } from '@/lib/supabase';
import { friendlyError, normalizePhone } from '@/lib/loyalty';
import { websiteOrigin } from '@/lib/website';

export function AuthForm({ staff = false }: { staff?: boolean }) {
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

  return <main className="auth-page">
    <section className="auth-panel"><Link href="/" className="brand"><BrandMark /><span>COCOHODO</span></Link><div className="auth-form-wrap">{!staff && !sentPhone && <Hodo className="auth-hodo" />}<h1>{staff ? 'Staff sign in' : sentPhone ? 'Enter your code' : 'Sign in'}</h1>{sentPhone && <p className="auth-description">Code sent to {sentPhone}.</p>}
      {!isConfigured && <div className="setup-notice">Online sign-in is not available yet. <Link href="/">View preview</Link></div>}
      {error && <Notice>{error}</Notice>}
      <form onSubmit={submit}>
        {staff ? <><label htmlFor="email">Shop email</label><input id="email" type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="team@your-shop.com" disabled={busy} /><label htmlFor="password">Password</label><input id="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your shop password" disabled={busy} /></> : sentPhone ? <><label htmlFor="code">Verification code</label><input id="code" className="otp-input" autoFocus inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} required value={token} onChange={(e) => setToken(e.target.value.replace(/\D/g, ''))} placeholder="000000" disabled={busy} /><button type="button" className="text-button change-number" onClick={() => { setSentPhone(''); setToken(''); setError(''); }} disabled={busy}>Use a different phone number</button></> : <><label htmlFor="phone">Phone number</label><div className="phone-field"><span>US +1</span><input id="phone" type="tel" autoComplete="tel-national" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(201) 555-0123" disabled={busy} /></div></>}
        <button className="button primary auth-submit" disabled={busy || !isConfigured || (!staff && !sentPhone && cooldown > 0)} type="submit">{busy ? 'One moment…' : staff ? 'Sign in' : sentPhone ? 'Verify & continue' : 'Send me a code'}{!busy && <ArrowRight size={17} />}</button>
        {sentPhone && <p className="resend-line">Didn’t get a code? <button type="button" disabled={cooldown > 0 || busy} onClick={resend}>{cooldown ? `Resend in ${cooldown}s` : 'Send again'}</button></p>}
        {!staff && !sentPhone && <p className="auth-fineprint">We’ll text you a sign-in code. Message and data rates may apply.</p>}
      </form>
    </div><div className="auth-switch"><Link href={staff ? '/login' : '/cashier/login'}>{staff ? 'Customer sign in' : 'Staff sign in'}</Link><a href={websiteOrigin}>Back to Cocohodo</a></div></section>
  </main>;
}
