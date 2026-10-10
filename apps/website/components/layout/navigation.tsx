'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { BrandMark } from '@cocohodo/ui/brand-mark';

export function Navigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const links = [['/menu/', 'Menu'], ['/rewards/', 'Rewards'], ['/contact/', 'Visit us']];
  return <header className="site-header"><div className="header-inner">
    <Link href="/" className="wordmark" aria-label="Cocohodo Closter home" onClick={() => setOpen(false)}><BrandMark /><span>cocohodo<small>CLOSTER, NEW JERSEY</small></span></Link>
    <button className="menu-toggle" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-controls="site-navigation" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
    <nav id="site-navigation" aria-label="Main navigation" className={open ? 'site-nav is-open' : 'site-nav'} onKeyDown={(event) => { if (event.key === 'Escape') { setOpen(false); document.querySelector<HTMLButtonElement>('.menu-toggle')?.focus(); } }}>
      {links.map(([href, label]) => <Link key={href} href={href} aria-current={pathname.replace(/\/$/, '') === href.replace(/\/$/, '') ? 'page' : undefined} onClick={() => setOpen(false)}>{label}</Link>)}
      <Link className="button small" href="/order/" onClick={() => setOpen(false)}>Order online <ArrowUpRight size={16} /></Link>
    </nav>
  </div></header>;
}
