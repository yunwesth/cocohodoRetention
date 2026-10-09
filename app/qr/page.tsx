import type { Viewport } from 'next';
import { MemberQRScreen } from '@/components/member-qr-screen';

export const viewport: Viewport = { themeColor: '#faf7f2' };

export default function QRPage() { return <MemberQRScreen />; }
