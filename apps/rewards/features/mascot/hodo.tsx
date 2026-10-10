'use client';

import { useEffect, useState } from 'react';
import styles from './hodo.module.css';

type Action = 'idle' | 'wave' | 'sip' | 'brew';
const actions: Action[] = ['wave', 'sip', 'brew'];

export function Hodo({ className = '' }: { className?: string }) {
  const [action, setAction] = useState<Action>('idle');
  const [greeting, setGreeting] = useState(0);

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let timer: ReturnType<typeof setTimeout>;
    let previous: Action = 'idle';
    function schedule() {
      clearTimeout(timer);
      if (motion.matches || document.hidden) return;
      timer = setTimeout(() => {
        const choices = actions.filter((item) => item !== previous);
        const next = choices[Math.floor(Math.random() * choices.length)];
        previous = next;
        setAction(next);
        timer = setTimeout(() => { setAction('idle'); schedule(); }, 3600);
      }, 6000 + Math.random() * 6000);
    }
    function reset() { setAction('idle'); schedule(); }
    if (greeting && !motion.matches && !document.hidden) {
      timer = setTimeout(() => {
        setAction('wave');
        timer = setTimeout(() => { setAction('idle'); schedule(); }, 3600);
      }, 0);
    } else schedule();
    motion.addEventListener('change', reset);
    document.addEventListener('visibilitychange', reset);
    return () => {
      clearTimeout(timer);
      motion.removeEventListener('change', reset);
      document.removeEventListener('visibilitychange', reset);
    };
  }, [greeting]);

  return <button type="button" className={`${styles.hodo} ${className}`} data-action={action} aria-label="Say hello to Hodo" onClick={() => setGreeting((value) => value + 1)}>
    <svg viewBox="0 0 260 260" fill="none" aria-hidden="true">
      <ellipse cx="130" cy="236" rx="62" ry="7" fill="#755135" opacity=".08" />
      <g className={styles.body} stroke="#75533e" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M89 205v16q0 17 19 14l13-12m20-18v17q2 17 20 11l10-16" fill="#efd0a0" />
        <path d="M130 30C141 30 149 36 154 44C170 39 185 48 188 63C204 65 215 78 211 94C224 104 228 120 219 133C227 150 224 168 212 180C211 198 197 211 179 212C165 224 145 226 130 220C115 226 95 224 81 212C63 211 49 198 48 180C36 168 33 150 41 133C32 120 36 104 49 94C45 78 56 65 72 63C75 48 90 39 106 44C111 36 119 30 130 30Z" fill="#f2d6a7" />
        <path d="M97 65C96 80 84 89 80 101M130 53C127 68 126 84 127 99M163 65C164 80 176 89 180 101" stroke="#c9955e" strokeWidth="7" />
        <g className={styles.face}>
          <ellipse cx="83" cy="140" rx="12" ry="10" fill="#eeb99a" stroke="none" />
          <ellipse cx="175" cy="140" rx="12" ry="10" fill="#eeb99a" stroke="none" />
          <g className={styles.eyes} fill="#75533e" stroke="none"><circle cx="97" cy="124" r="5" /><circle cx="159" cy="124" r="5" /></g>
          <path d="M120 135q8 11 17 0" strokeWidth="4" />
        </g>
        <path d="m66 163 66 43 62-43q-64 21-128 0Z" fill="#c8a788" />
        <path d="m188 171 27-15q9 22-13 26l19 17q-23 9-33-18" fill="#c8a788" />
        <g className={styles.waveArm}><path d="M65 165C43 171 24 150 22 133C19 120 24 112 34 112C45 112 50 123 50 134L64 143" fill="#f2d6a7" /></g>
        <g className={styles.brewArm}>
          <path d="M67 157 40 134" stroke="#f2d6a7" strokeWidth="23" />
          <g className={styles.kettle}><path d="M35 108q-21-4-21 10t21 10" /><path d="M32 103h35l6 31H28Z" fill="#c8a788" /><path d="m67 112 23 12-8 8-14-5" fill="#c8a788" /><path d="M34 102q14-15 29 0m-14-10v-4" /></g>
        </g>
        <g className={styles.cupArm}>
          <path d="M166 157L171 192Q172 198 178 198H196Q202 198 203 192L208 157Z" fill="#dbc1a4" strokeWidth="3.5" />
          <rect x="163" y="150" width="48" height="10" rx="4" fill="#ead8c4" strokeWidth="3.5" />
          {/* The palm covers the cup edge; only its outer curve is outlined. */}
          <path d="M224 172C215 166 198 168 193 178C188 189 200 202 215 199L225 192Z" fill="#f2d6a7" stroke="none" />
          <path d="M224 172C215 166 198 168 193 178C188 189 200 202 215 199" strokeWidth="3.5" />
          <g className={styles.steam} stroke="#b4977e" strokeWidth="2.5"><path d="M180 141q-6-6 0-12t0-12m14 24q-6-6 0-12" /></g>
        </g>
        <path className={styles.pour} d="M87 127q32 3 97 25" stroke="#996a41" strokeWidth="3" />
      </g>
    </svg>
  </button>;
}
