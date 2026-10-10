import { MapPin, ArrowUpRight } from 'lucide-react';
import { PageIntro } from '../../components/ui/page-intro';
import { VisitDetails } from '../../features/visit/visit-details';
import { content } from '../../lib/content';
import { pageMetadata } from '../../lib/metadata';
export const metadata = pageMetadata('Visit us', 'Find Cocohodo at 255 Closter Dock Road, Closter NJ. Monday–Saturday 9 AM–6 PM, closed Sunday. Call (201) 767-2626.', '/contact/');
export default function ContactPage() {
  return <div className="container"><PageIntro eyebrow="YOUR NEIGHBORHOOD SWEET SPOT" title="There’s a little joy nearby."><p>A treat for the way home. A coffee with a friend.<br />We’d love to see you.</p></PageIntro><div className="contact-grid"><VisitDetails /><div className="directions-card"><MapPin size={42} strokeWidth={1.2} /><span className="eyebrow">CLOSTER, NEW JERSEY</span><h2>Meet us on<br /><em>Closter Dock Road.</em></h2><p>Open directions for the route from your location.</p><a className="button" href={content.store.directions.href} target="_blank" rel="noopener noreferrer">Open Google Maps <ArrowUpRight size={17} /></a></div></div><section className="contact-note"><h2>Planning a gift or a visit?</h2><p>Call the shop for current selection, gift box availability, and holiday hours. We’ll help you find a little something.</p><a className="text-link" href={content.store.phone.href}>{content.store.phone.value} <ArrowUpRight size={16} /></a></section></div>;
}
