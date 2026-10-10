import Link from 'next/link';
export default function NotFound() {
  return <div className="container empty-state"><span className="eyebrow">A LITTLE DETOUR</span><h1>This page wandered off.</h1><p>There’s still something sweet waiting for you.</p><Link className="button" href="/">Back to Cocohodo</Link></div>;
}
