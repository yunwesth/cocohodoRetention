'use client';

import Link from 'next/link';
import { Hodo } from '@/features/mascot/hodo';
import { ArrowRight } from 'lucide-react';
import { BrandMark } from '@cocohodo/ui/brand-mark';
import { Notice } from '@/components/layout/shell';
import { isConfigured } from '@/lib/supabase';
import { websiteOrigin } from '@/config/public';
import { useAuthForm } from './use-auth-form';

export function AuthForm({ staff = false }: { staff?: boolean }) {
  const { phone, setPhone, sentPhone, setSentPhone, token, setToken, email, setEmail, password, setPassword, busy, error, setError, cooldown, submit, resend } = useAuthForm(staff);
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
