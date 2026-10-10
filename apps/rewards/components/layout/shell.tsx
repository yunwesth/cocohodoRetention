'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { ArrowUpRight, ChevronDown, Gift, HelpCircle, History, Home, QrCode, LogOut, ScanLine, X } from 'lucide-react';
import { BrandMark } from '@cocohodo/ui/brand-mark';
import { getSupabase, isConfigured } from '@/lib/supabase';
import { websiteOrigin } from '@/config/public';

export function Shell({ children, staff = false }: { children: React.ReactNode; staff?: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const [menu, setMenu] = useState(false);
  const [help, setHelp] = useState(false);
  const [error, setError] = useState('');
  async function signOut() {
    if (isConfigured) {
      const { error } = await getSupabase().auth.signOut();
      if (error) { setError('Could not sign out. Please try again.'); return; }
    }
    router.replace(staff ? '/cashier/login' : '/login');
  }
  if (!staff) return <div className="companion-shell" id="home">
    <header className="companion-header"><Link href="/" className="brand"><BrandMark /><span>COCOHODO</span></Link><div className="account-wrap"><button className="account-button" aria-label="Account menu" aria-expanded={menu} onClick={() => setMenu(!menu)}><span>C</span><ChevronDown size={14} /></button>{menu && <div className="account-menu"><p>COCOHODO member</p><Link className="account-staff" href="/cashier">Staff access</Link><button onClick={signOut}><LogOut size={15} />{isConfigured ? 'Sign out' : 'Go to sign in'}</button>{error && <p role="alert">{error}</p>}</div>}</div></header>
    {!isConfigured && <div className="companion-preview"><span>PREVIEW</span> Sample card · Sign-in is not live yet.</div>}
    <main className="companion-content">{children}</main>
    <a className="website-return" href={websiteOrigin}>Back to Cocohodo <ArrowUpRight size={14} /></a>
    <nav className="companion-nav" aria-label="Main navigation"><Link href="/#home"><Home size={21} />Home</Link><Link href="/qr"><QrCode size={21} />My QR</Link><Link href="/#activity"><History size={21} />Activity</Link></nav>
  </div>;
  return <div className="app-shell">
    <aside className="sidebar">
      <Link href="/" className="brand"><BrandMark /><span>COCOHODO</span></Link>
      <div className="sidebar-body">
        <nav aria-label="Main navigation">
          {staff ? <Link href="/cashier" className="nav-item active"><ScanLine size={19} />Cashier station<span className="nav-dot" /></Link> : <>
            <Link href="/" className={`nav-item ${pathname === '/' ? 'active' : ''}`}><Gift size={19} />My rewards<span className="nav-dot" /></Link>
            <Link href="/#activity" className="nav-item"><History size={19} />My activity</Link>
            <Link href="/#how-it-works" className="nav-item"><HelpCircle size={19} />How it works</Link>
          </>}
        </nav>
        <div className="sidebar-bottom"><button className="nav-item" onClick={() => setHelp(!help)} aria-expanded={help}><HelpCircle size={18} />Need a hand?</button>{help && <div className="help-note">Ask your COCOHODO cashier for help with your stamps or free drink.</div>}<Link href={staff ? '/' : '/cashier'} className="staff-link">{staff ? 'Customer rewards' : 'Staff access'}<ArrowUpRight size={14} /></Link></div>
      </div>
    </aside>
    <div className="main-wrap">
      <header className="topbar"><div className="breadcrumb">COCOHODO <span>/</span> <strong>{staff ? 'Cashier station' : 'My rewards'}</strong></div><Link className="mobile-brand" href="/">COCOHODO<span>®</span></Link><div className="account-wrap"><span className="member-status"><span />{staff ? 'Shop account' : 'A little everyday joy'}</span><button className="account-button" aria-label="Account menu" aria-expanded={menu} onClick={() => setMenu(!menu)}><span>{staff ? 'S' : 'C'}</span><ChevronDown size={14} /></button>{menu && <div className="account-menu"><p>{staff ? 'COCOHODO shop account' : 'COCOHODO member'}</p><button onClick={signOut}><LogOut size={15} />{isConfigured ? 'Sign out' : 'Go to sign in'}</button>{error && <p role="alert">{error}</p>}</div>}</div></header>
      {!isConfigured && <div className="preview-banner"><span className="preview-tag">PREVIEW</span>Sample card · Sign-in and stamps are not live yet.</div>}
      <main className="page-content">{children}</main>
      <footer className="footer"><span>© {new Date().getFullYear()} COCOHODO</span><a href={websiteOrigin}>Back to Cocohodo</a></footer>
    </div>
    <nav className="mobile-nav" aria-label="Mobile navigation"><Link href={staff ? '/cashier' : '/'}><Gift size={20} />{staff ? 'Cashier' : 'Rewards'}</Link><Link href="/#activity"><History size={20} />Activity</Link><Link href="/#how-it-works"><HelpCircle size={20} />How it works</Link></nav>
  </div>;
}

export function Notice({ children, onClose }: { children: React.ReactNode; onClose?: () => void }) {
  return <div className="notice" role="alert"><span>{children}</span>{onClose && <button aria-label="Dismiss message" onClick={onClose}><X size={16} /></button>}</div>;
}

export function LoadingState() {
  return <div className="loading-state" role="status"><BrandMark /><span>Getting your coffee corner ready…</span></div>;
}
